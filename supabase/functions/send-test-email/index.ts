// Sends a sample order confirmation email via the connected Gmail account.
// Used by the Admin "Send test email" button to verify wiring without a real payment.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BRAND_GOLD = "#C9A961";
const BRAND_CHARCOAL = "#1A1A1A";

function escHtml(s: unknown): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function b64url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function buildRawMime(to: string, subject: string, html: string): string {
  const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const message = [
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    html,
  ].join('\r\n');
  return b64url(message);
}

async function sendGmail(to: string, subject: string, html: string) {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const GMAIL_KEY = Deno.env.get('GOOGLE_MAIL_API_KEY');
  if (!LOVABLE_API_KEY || !GMAIL_KEY) {
    throw new Error('Gmail connector is not configured');
  }
  const res = await fetch('https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': GMAIL_KEY,
    },
    body: JSON.stringify({ raw: buildRawMime(to, subject, html) }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gmail send failed: ${res.status} ${errText}`);
  }
}

function buildSampleEmail(order: any, forAdmin: boolean) {
  const items = order.items.map((i: any) =>
    `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${escHtml(i.name)}</td><td style="padding:8px;border-bottom:1px solid #eee;">${escHtml(i.quantity)}</td><td style="padding:8px;border-bottom:1px solid #eee;">GH¢${(Number(i.price) * Number(i.quantity)).toFixed(2)}</td></tr>`
  ).join("");

  const heading = forAdmin ? "New Order Received (TEST)" : "Order Confirmation (TEST)";
  const intro = forAdmin
    ? `<p style="color:#555;font-size:14px;">⚠️ This is a TEST email triggered from the Admin Dashboard. A new order has been placed by <strong>${escHtml(order.email)}</strong>.</p>`
    : `<p style="color:#333;font-size:15px;line-height:1.6;">⚠️ <strong>TEST EMAIL</strong><br/><br/>Thank you for your payment.<br/>We have successfully received your payment and are currently processing your order.<br/>Delivery details will be communicated to you shortly.<br/><br/>Thank you for choosing us.</p>`;

  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f9f9f9;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:4px;overflow:hidden;">
<div style="background:${BRAND_CHARCOAL};padding:24px;text-align:center;">
<h1 style="color:${BRAND_GOLD};margin:0;letter-spacing:4px;font-size:24px;">VITORÉ</h1>
</div>
<div style="padding:30px;">
<h2 style="color:${BRAND_CHARCOAL};font-size:20px;margin-bottom:16px;">${heading}</h2>
${intro}
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
<tr style="background:#f5f5f5;"><th style="padding:8px;text-align:left;">Item</th><th style="padding:8px;text-align:left;">Qty</th><th style="padding:8px;text-align:left;">Subtotal</th></tr>
${items}
</table>
<p style="font-size:16px;font-weight:bold;color:${BRAND_CHARCOAL};">Total: GH¢${Number(order.total_amount).toFixed(2)}</p>
<p style="color:#555;font-size:13px;">Phone: ${escHtml(order.phone)}</p>
<p style="color:#555;font-size:13px;">Delivery Location: ${escHtml(order.delivery_location)}</p>
<p style="color:#555;font-size:13px;">Reference: ${escHtml(order.payment_reference)}</p>
<p style="color:#999;font-size:12px;margin-top:30px;border-top:1px solid #eee;padding-top:20px;">Vitoré — Thank you for choosing us.</p>
</div></div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { recipient } = await req.json().catch(() => ({ recipient: null }));

    const ADMIN_EMAILS = ["rhis.cky10@gmail.com", "vitorecollection74@gmail.com"];
    const customerEmail = (typeof recipient === 'string' && recipient.includes('@')) ? recipient : ADMIN_EMAILS[0];

    const sampleOrder = {
      id: 'test-order-id',
      email: customerEmail,
      phone: '+233 20 000 0000',
      delivery_location: 'Accra, Ghana — Test Address',
      payment_reference: `TEST-${Date.now()}`,
      total_amount: 250.00,
      items: [
        { name: 'Vitoré Signature Perfume 50ml', quantity: 1, price: 180.00 },
        { name: 'Luxury Body Lotion', quantity: 1, price: 70.00 },
      ],
    };

    // Send customer-style email + admin notifications
    await sendGmail(customerEmail, '[TEST] Your Vitoré Order Confirmation', buildSampleEmail(sampleOrder, false));
    await Promise.all(ADMIN_EMAILS.map((addr) =>
      sendGmail(addr, `[TEST] New Order from ${sampleOrder.email} — GH¢${sampleOrder.total_amount.toFixed(2)}`, buildSampleEmail(sampleOrder, true))
    ));

    return new Response(JSON.stringify({
      ok: true,
      sent_to_customer: customerEmail,
      sent_to_admins: ADMIN_EMAILS,
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('send-test-email error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
