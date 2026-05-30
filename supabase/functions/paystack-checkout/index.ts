import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function normalizeGhPhone(input: string): string {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.startsWith('233')) return digits;
  if (digits.startsWith('0') && digits.length === 10) return '233' + digits.slice(1);
  if (digits.length === 9) return '233' + digits;
  return digits;
}

async function paystackFetch(path: string, secretKey: string, body?: unknown, attempts = 3): Promise<any> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`https://api.paystack.co${path}`, {
        method: body ? 'POST' : 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `Paystack ${res.status}`);
      return data;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Paystack request failed');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) throw new Error('PAYSTACK_SECRET_KEY is not configured');

    const { orderId, channels, callback_url, mobile_money_provider } = await req.json();

    if (!orderId || typeof orderId !== 'string') {
      return new Response(JSON.stringify({ error: 'orderId is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Look up order server-side using service role — never trust client-supplied amount/email
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, email, phone, items, total_amount, currency, payment_status, user_id')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (order.payment_status === 'paid') {
      return new Response(JSON.stringify({ error: 'Order is already paid' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If the order is owned by a user, require a matching authenticated user
    if (order.user_id) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const anonClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } },
      );
      const { data: claimsData } = await anonClient.auth.getClaims(authHeader.replace('Bearer ', ''));
      if (!claimsData?.claims || claimsData.claims.sub !== order.user_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const amountInPesewas = Math.round(Number(order.total_amount) * 100);
    if (!Number.isFinite(amountInPesewas) || amountInPesewas <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid order total' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const metadata = {
      order_id: order.id,
      items: order.items,
      phone: order.phone ? normalizeGhPhone(order.phone) : undefined,
      mobile_money_provider,
      custom_fields: [
        { display_name: "Order ID", variable_name: "order_id", value: String(order.id) },
      ],
    };

    const initBody: Record<string, unknown> = {
      email: order.email,
      amount: amountInPesewas,
      currency: order.currency || 'GHS',
      callback_url,
      channels: channels || ['card', 'mobile_money', 'bank_transfer'],
      metadata,
    };

    const data = await paystackFetch('/transaction/initialize', PAYSTACK_SECRET_KEY, initBody);

    // Persist the reference back to the order immediately
    if (data?.data?.reference) {
      await supabase.from('orders').update({ payment_reference: data.data.reference }).eq('id', order.id);
    }

    return new Response(JSON.stringify({
      mode: 'redirect',
      authorization_url: data?.data?.authorization_url,
      reference: data?.data?.reference,
      access_code: data?.data?.access_code,
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: unknown) {
    console.error('Paystack checkout error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Checkout failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
