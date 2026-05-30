import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) throw new Error('PAYSTACK_SECRET_KEY is not configured');

    const { reference, otp } = await req.json();
    if (typeof reference !== 'string' || typeof otp !== 'string' || !reference || !otp) {
      return new Response(JSON.stringify({ error: 'reference and otp are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!/^[A-Za-z0-9_-]{4,128}$/.test(reference) || !/^\d{3,10}$/.test(otp)) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ensure the reference belongs to an order we issued — prevents arbitrary
    // OTP submissions against unrelated Paystack transactions.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: order } = await supabase
      .from('orders')
      .select('id, user_id')
      .eq('payment_reference', reference)
      .maybeSingle();

    if (!order) {
      return new Response(JSON.stringify({ error: 'Unknown reference' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If the order belongs to a logged-in user, require matching auth
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

    const res = await fetch('https://api.paystack.co/charge/submit_otp', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp, reference }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || `Paystack ${res.status}`);

    const d = data?.data || {};
    return new Response(JSON.stringify({
      status: d.status,
      reference: d.reference,
      display_text: d.display_text || d.message || null,
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: unknown) {
    console.error('paystack-submit-otp error:', error);
    return new Response(JSON.stringify({ error: 'Request failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
