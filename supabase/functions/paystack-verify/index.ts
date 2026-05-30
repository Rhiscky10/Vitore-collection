import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ADMIN_EMAILS = ["rhis.cky10@gmail.com", "vitorecollection74@gmail.com"];
const BRAND_GOLD = "#C9A961";
const BRAND_CHARCOAL = "#1A1A1A";

// ---------- PDF generation ----------
function generateReceiptPDF(order: any): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 60;

  // Header band
  doc.setFillColor(BRAND_CHARCOAL);
  doc.rect(0, 0, pageWidth, 90, "F");
  doc.setTextColor(BRAND_GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("VITORÉ", 40, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#EFEFEF");
  doc.text("Premium Luxury — Order Receipt", 40, 70);

  y = 130;
  doc.setTextColor(BRAND_CHARCOAL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Order Confirmation", 40, y);

  y += 25;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#555");
  const orderDate = new Date(order.created_at || Date.now()).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
  doc.text(`Order ID: ${order.id}`, 40, y); y += 14;
  doc.text(`Reference: ${order.payment_reference || "—"}`, 40, y); y += 14;
  doc.text(`Date: ${orderDate}`, 40, y); y += 14;
  doc.text(`Customer: ${order.email}`, 40, y); y += 14;
  if (order.phone) { doc.text(`Phone: ${order.phone}`, 40, y); y += 14; }
  if (order.delivery_location) { doc.text(`Delivery: ${order.delivery_location}`, 40, y, { maxWidth: 500 } as any); y += 28; }

  // Items table
  y += 20;
  doc.setFillColor(BRAND_GOLD);
  doc.rect(40, y - 14, pageWidth - 80, 22, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ITEM", 50, y);
  doc.text("QTY", 360, y);
  doc.text("PRICE", 410, y);
  doc.text("SUBTOTAL", 490, y);

  y += 20;
  doc.setTextColor(BRAND_CHARCOAL);
  doc.setFont("helvetica", "normal");
  const items = Array.isArray(order.items) ? order.items : [];
  for (const it of items) {
    const subtotal = (Number(it.price) * Number(it.quantity)).toFixed(2);
    const name = String(it.name).length > 50 ? String(it.name).slice(0, 47) + "..." : it.name;
    doc.text(name, 50, y);
    doc.text(String(it.quantity), 360, y);
    doc.text(`GH¢${Number(it.price).toFixed(2)}`, 410, y);
    doc.text(`GH¢${subtotal}`, 490, y);
    y += 18;
    doc.setDrawColor("#EEEEEE");
    doc.line(40, y - 8, pageWidth - 40, y - 8);
  }

  // Total
  y += 20;
  doc.setFillColor("#F8F4EC");
  doc.rect(40, y - 14, pageWidth - 80, 30, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(BRAND_CHARCOAL);
  doc.text("TOTAL", 50, y + 4);
  doc.setTextColor(BRAND_GOLD);
  doc.setFontSize(14);
  doc.text(`GH¢${Number(order.total_amount).toFixed(2)}`, 490, y + 4);

  // Footer
  y = doc.internal.pageSize.getHeight() - 80;
  doc.setDrawColor(BRAND_GOLD);
  doc.setLineWidth(1);
  doc.line(40, y, pageWidth - 40, y);
  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#888");
  doc.text("Thank you for shopping with Vitoré.", 40, y); y += 12;
  doc.text("For inquiries, contact rhis.cky10@gmail.com", 40, y); y += 12;
  doc.text("This is an electronically generated receipt — no signature required.", 40, y);

  return doc.output("arraybuffer") as unknown as Uint8Array;
}

// ---------- Email helpers ----------
function escHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildSuccessEmailHtml(order: any, forAdmin: boolean, receiptUrl?: string) {
  const items = Array.isArray(order.items)
    ? order.items.map((i: any) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${escHtml(i.name)}</td><td style="padding:8px;border-bottom:1px solid #eee;">${escHtml(i.quantity)}</td><td style="padding:8px;border-bottom:1px solid #eee;">GH¢${(Number(i.price) * Number(i.quantity)).toFixed(2)}</td></tr>`).join("")
    : "";

  const heading = forAdmin ? "New Order Received" : "Order Confirmation";
  const intro = forAdmin
    ? `<p style="color:#555;font-size:14px;">A new order has been placed by <strong>${escHtml(order.email)}</strong>.</p>`
    : `<p style="color:#333;font-size:15px;line-height:1.6;">Thank you for your payment.<br/>We have successfully received your payment and are currently processing your order.<br/>Delivery details will be communicated to you shortly.<br/><br/>Thank you for choosing us.</p><p style="color:#555;font-size:13px;">Your branded receipt is attached as a downloadable PDF below.</p>`;

  const receiptBtn = !forAdmin && receiptUrl
    ? `<div style="text-align:center;margin:30px 0;"><a href="${escHtml(receiptUrl)}" style="background:${BRAND_GOLD};color:#fff;padding:14px 32px;text-decoration:none;font-weight:bold;letter-spacing:1px;text-transform:uppercase;font-size:13px;border-radius:2px;">Download Receipt PDF</a></div>`
    : "";

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
${order.phone ? `<p style="color:#555;font-size:13px;">Phone: ${escHtml(order.phone)}</p>` : ""}
${order.delivery_location ? `<p style="color:#555;font-size:13px;">Delivery Location: ${escHtml(order.delivery_location)}</p>` : ""}
<p style="color:#555;font-size:13px;">Reference: ${escHtml(order.payment_reference || order.id)}</p>
${receiptBtn}
<p style="color:#999;font-size:12px;margin-top:30px;border-top:1px solid #eee;padding-top:20px;">Vitoré — Thank you for choosing us.</p>
</div></div></body></html>`;
}

function buildFailureEmailHtml(order: any, status: string, gatewayResponse: string) {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f9f9f9;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:4px;overflow:hidden;">
<div style="background:${BRAND_CHARCOAL};padding:24px;text-align:center;">
<h1 style="color:${BRAND_GOLD};margin:0;letter-spacing:4px;font-size:24px;">VITORÉ</h1>
</div>
<div style="padding:30px;">
<h2 style="color:#B00020;font-size:20px;margin-bottom:16px;">⚠️ Payment ${escHtml(status === 'abandoned' ? 'Cancelled' : 'Failed')}</h2>
<p style="color:#555;font-size:14px;">A payment attempt did not complete successfully.</p>
<table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:13px;">
<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Customer</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${escHtml(order.email)}</strong></td></tr>
${order.phone ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${escHtml(order.phone)}</td></tr>` : ""}
${order.delivery_location ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;vertical-align:top;">Delivery Location</td><td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap;">${escHtml(order.delivery_location)}</td></tr>` : ""}
<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Amount</td><td style="padding:8px;border-bottom:1px solid #eee;">GH¢${Number(order.total_amount).toFixed(2)}</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Reference</td><td style="padding:8px;border-bottom:1px solid #eee;">${escHtml(order.payment_reference || order.id)}</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Status</td><td style="padding:8px;border-bottom:1px solid #eee;">${escHtml(status)}</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#888;">Gateway</td><td style="padding:8px;border-bottom:1px solid #eee;">${escHtml(gatewayResponse || "—")}</td></tr>
</table>
<p style="color:#999;font-size:12px;margin-top:30px;border-top:1px solid #eee;padding-top:20px;">You may want to follow up with this customer.</p>
</div></div></body></html>`;
}

// Base64url-encode a UTF-8 string (Gmail API requires base64url RFC 2822)
function b64url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function buildRawMime(to: string, subject: string, html: string): string {
  // RFC 2822 message with HTML body. Encode subject as UTF-8 (RFC 2047) for safety.
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

async function sendEmail(to: string, subject: string, html: string) {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const GMAIL_KEY = Deno.env.get('GOOGLE_MAIL_API_KEY');
  if (!LOVABLE_API_KEY || !GMAIL_KEY) {
    console.error('Email skipped: LOVABLE_API_KEY or GOOGLE_MAIL_API_KEY not configured');
    return;
  }
  try {
    const raw = buildRawMime(to, subject, html);
    const response = await fetch(
      'https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': GMAIL_KEY,
        },
        body: JSON.stringify({ raw }),
      }
    );
    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gmail send failed for ${to}: ${response.status} ${errText}`);
    } else {
      console.log(`Gmail email sent to ${to}`);
    }
  } catch (err) {
    console.error(`Gmail send error for ${to}:`, err);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) throw new Error('PAYSTACK_SECRET_KEY is not configured');

    const { reference } = await req.json();
    if (!reference) {
      return new Response(JSON.stringify({ error: 'Reference is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { 'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
    const data = await response.json();
    if (!response.ok || !data?.status) throw new Error(data?.message || 'Verification failed');

    const txn = data?.data || {};
    const txnStatus = txn.status; // success | failed | abandoned | reversed | pending
    let paymentStatus = txnStatus === 'success' ? 'paid' : (txnStatus === 'abandoned' ? 'cancelled' : (txnStatus === 'pending' || !txnStatus ? 'pending' : 'failed'));

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the order BEFORE marking it paid, so we can verify the amount Paystack received
    const { data: orderForCheck } = await supabase
      .from('orders').select('*').eq('payment_reference', reference).single();

    // CRITICAL: verify Paystack-reported amount matches the order total to prevent price manipulation
    if (paymentStatus === 'paid' && orderForCheck) {
      const expectedPesewas = Math.round(Number(orderForCheck.total_amount) * 100);
      const paidPesewas = Number(txn.amount);
      // Allow ±2 pesewa rounding tolerance
      if (!Number.isFinite(paidPesewas) || Math.abs(paidPesewas - expectedPesewas) > 2) {
        console.error(`Amount mismatch on ref ${reference}: expected ${expectedPesewas}, paid ${paidPesewas}`);
        paymentStatus = 'failed';
      }
    }

    await supabase.from('orders').update({ payment_status: paymentStatus }).eq('payment_reference', reference);

    const orderData = orderForCheck;

    if (orderData) {
      if (paymentStatus === 'paid') {
        // Generate PDF receipt and upload to private storage
        let receiptUrl: string | undefined;
        try {
          const pdfBytes = generateReceiptPDF(orderData);
          const filePath = `${orderData.id}/receipt-${reference}.pdf`;
          const { error: upErr } = await supabase.storage
            .from('order-receipts')
            .upload(filePath, pdfBytes, { contentType: 'application/pdf', upsert: true });
          if (upErr) {
            console.error('Receipt upload failed:', upErr);
          } else {
            const { data: signed } = await supabase.storage
              .from('order-receipts')
              .createSignedUrl(filePath, 60 * 60 * 24 * 30); // 30 days
            receiptUrl = signed?.signedUrl;
          }
        } catch (pdfErr) {
          console.error('PDF generation error:', pdfErr);
        }

        await sendEmail(
          orderData.email,
          'Your Vitoré Order Confirmation',
          buildSuccessEmailHtml(orderData, false, receiptUrl)
        );
        await Promise.all(ADMIN_EMAILS.map((addr) => sendEmail(
          addr,
          `New Order from ${orderData.email} — GH¢${Number(orderData.total_amount).toFixed(2)}`,
          buildSuccessEmailHtml(orderData, true)
        )));
      } else if (paymentStatus !== 'pending') {
        // Notify admins of failed/cancelled transaction (skip while still pending)
        await Promise.all(ADMIN_EMAILS.map((addr) => sendEmail(
          addr,
          `Payment ${paymentStatus.toUpperCase()} — ${orderData.email} — GH¢${Number(orderData.total_amount).toFixed(2)}`,
          buildFailureEmailHtml(orderData, txnStatus || 'unknown', txn.gateway_response || '')
        )));
      }
    }

    return new Response(JSON.stringify({
      status: paymentStatus,
      reference: txn.reference,
      amount: txn.amount,
      currency: txn.currency,
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: unknown) {
    console.error('Paystack verify error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
