import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
import { finalizeMockCheckout } from '../services/paymentService.js';
import { renderMockCheckoutPage, renderPaymentSuccessPage } from '../views/mockCheckoutPage.js';

function safeFrontendBase(raw) {
  try {
    const url = new URL(raw || env.frontendOrigin);
    if (!['http:', 'https:'].includes(url.protocol)) return env.frontendOrigin;
    return url.origin;
  } catch {
    return env.frontendOrigin;
  }
}


async function findPendingOrder(sessionId) {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .maybeSingle();
  if (error) throw error;
  if (!order) throw new HttpError(404, 'Mock payment session not found');
  return order;
}

export async function showMockCheckout(req, res) {
  const sessionId = String(req.params.sessionId || '');
  const order = await findPendingOrder(sessionId);
  const returnUrl = safeFrontendBase(req.query.return_url);
  res.type('html').send(renderMockCheckoutPage({ sessionId, order, returnUrl }));
}

export async function payMockCheckout(req, res) {
  const sessionId = String(req.params.sessionId || '');
  const order = await findPendingOrder(sessionId);
  const returnUrl = safeFrontendBase(req.body?.return_url);

  if (order.is_paid) return res.redirect(`${returnUrl}/allorders`);

  const cardNumber = String(req.body?.card_number || '').replace(/\D/g, '');
  const cardholder = String(req.body?.cardholder || '').trim();
  const expiry = String(req.body?.expiry || '').trim();
  const cvv = String(req.body?.cvv || '').replace(/\D/g, '');

  if (!cardholder || !/^\d{2}\/\d{2}$/.test(expiry) || !/^\d{3,4}$/.test(cvv)) {
    return res.status(400).type('html').send(renderMockCheckoutPage({
      sessionId,
      order,
      returnUrl,
      errorMessage: 'Please enter valid test card details.'
    }));
  }

  if (cardNumber === '4000000000000002') {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: 'failed' })
      .eq('id', order.id);
    if (error) throw error;

    return res.status(402).type('html').send(renderMockCheckoutPage({
      sessionId,
      order,
      returnUrl,
      errorMessage: 'Payment declined. Please try another card.'
    }));
  }

  if (cardNumber !== '4242424242424242') {
    return res.status(400).type('html').send(renderMockCheckoutPage({
      sessionId,
      order,
      returnUrl,
      errorMessage: 'Payment could not be completed. Please check the card details and try again.'
    }));
  }

  await finalizeMockCheckout({ order, sessionId });
  return res.type('html').send(renderPaymentSuccessPage(returnUrl));
}

export async function cancelMockCheckout(req, res) {
  const sessionId = String(req.params.sessionId || '');
  const returnUrl = safeFrontendBase(req.query.return_url);
  const order = await findPendingOrder(sessionId);

  if (!order.is_paid) {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: 'failed' })
      .eq('id', order.id);
    if (error) throw error;
  }

  return res.redirect(`${returnUrl}/cart`);
}
