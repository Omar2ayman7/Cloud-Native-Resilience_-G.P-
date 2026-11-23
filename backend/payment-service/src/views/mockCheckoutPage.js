function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function renderMockCheckoutPage({ sessionId, order, returnUrl, errorMessage = '' }) {
  const amount = Number(order.total_order_price || 0).toFixed(2);
  const error = errorMessage
    ? `<div class="alert">${escapeHtml(errorMessage)}</div>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>FreshCart Secure Checkout</title>
  <style>
    *{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:#f5f7f8;color:#1f2937}
    .wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.card{width:min(520px,100%);background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:28px;box-shadow:0 18px 50px rgba(15,23,42,.08)}
    .brand{font-size:24px;font-weight:800;color:#0aad0a;margin-bottom:4px}.sub{color:#6b7280;margin-bottom:24px}.total{display:flex;justify-content:space-between;background:#f0fdf4;border:1px solid #bbf7d0;padding:14px 16px;border-radius:12px;margin-bottom:20px;font-weight:700}
    label{display:block;font-size:14px;font-weight:700;margin:12px 0 6px}input{width:100%;padding:12px 13px;border:1px solid #d1d5db;border-radius:10px;font-size:16px;outline:none}input:focus{border-color:#0aad0a;box-shadow:0 0 0 3px rgba(10,173,10,.12)}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:22px}.pay,.cancel{display:flex;align-items:center;justify-content:center;min-height:46px;border-radius:10px;text-decoration:none;font-weight:800;font-size:15px}.pay{border:0;background:#0aad0a;color:#fff;cursor:pointer}.pay:hover{background:#088c08}.cancel{border:1px solid #d1d5db;color:#374151;background:#fff}
    .note{font-size:12px;color:#6b7280;margin-top:18px;line-height:1.55}.alert{background:#fef2f2;color:#b91c1c;border:1px solid #fecaca;padding:11px 12px;border-radius:10px;margin-bottom:14px}
  </style>
</head>
<body>
  <main class="wrap"><section class="card">
    <div class="brand">FreshCart</div>
    <div class="sub">Secure checkout</div>
    ${error}
    <div class="total"><span>Order total</span><span>${amount} EGP</span></div>
    <form method="post" action="/api/v1/mock-payment/pay/${encodeURIComponent(sessionId)}">
      <input type="hidden" name="return_url" value="${escapeHtml(returnUrl)}" />
      <label>Cardholder name</label>
      <input name="cardholder" autocomplete="off" placeholder="Ahmed Ali" required />
      <label>Card number</label>
      <input name="card_number" inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242" required />
      <div class="row">
        <div><label>Expiry date</label><input name="expiry" autocomplete="off" placeholder="12/30" required /></div>
        <div><label>CVV</label><input name="cvv" inputmode="numeric" autocomplete="off" placeholder="123" required /></div>
      </div>
      <div class="actions">
        <button class="pay" type="submit">Pay now</button>
        <a class="cancel" href="/api/v1/mock-payment/cancel/${encodeURIComponent(sessionId)}?return_url=${encodeURIComponent(returnUrl)}">Cancel</a>
      </div>
    </form>
    <div class="note">Development simulation only. FreshCart does not store the card number or CVV entered on this page.</div>
  </section></main>
</body>
</html>`;
}

export function renderPaymentSuccessPage(returnUrl) {
  const target = `${returnUrl}/allorders`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="2;url=${escapeHtml(target)}" />
  <title>Payment Successful</title>
  <style>
    *{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:#f5f7f8;color:#1f2937}
    .wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.card{width:min(520px,100%);background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:34px 28px;text-align:center;box-shadow:0 18px 50px rgba(15,23,42,.08)}
    .icon{width:72px;height:72px;margin:0 auto 18px;border-radius:50%;display:grid;place-items:center;background:#ecfdf3;color:#0aad0a;font-size:38px;font-weight:900}.brand{font-size:24px;font-weight:800;color:#0aad0a;margin-bottom:8px}h1{font-size:24px;margin:0 0 10px}.sub{color:#6b7280;line-height:1.55;margin-bottom:22px}.link{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border-radius:10px;background:#0aad0a;color:#fff;text-decoration:none;font-weight:800}.small{font-size:12px;color:#9ca3af;margin-top:14px}
  </style>
</head>
<body>
  <main class="wrap"><section class="card">
    <div class="icon">✓</div>
    <div class="brand">FreshCart</div>
    <h1>Payment successful</h1>
    <div class="sub">Your payment was completed successfully. Your order has been created and you will be redirected to All Orders.</div>
    <a class="link" href="${escapeHtml(target)}">View all orders</a>
    <div class="small">Redirecting automatically...</div>
  </section></main>
  <script>
    setTimeout(function () {
      window.location.replace(${JSON.stringify(target)});
    }, 1500);
  </script>
</body>
</html>`;
}
