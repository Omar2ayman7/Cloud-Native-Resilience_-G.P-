import { supabase } from '../config/supabase.js';
import { stripe } from '../config/stripe.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
import { finalizePaidCheckout } from '../services/paymentService.js';
import { randomUUID } from 'node:crypto';

function safeFrontendBase(raw) {
  const fallback = env.frontendOrigin;
  try {
    const url = new URL(raw || fallback);
    if (!['http:', 'https:'].includes(url.protocol)) return fallback;
    return url.origin;
  } catch {
    return fallback;
  }
}

export async function createCheckoutSession(req, res) {
  const useStripe = env.paymentProvider === 'stripe';
  if (useStripe && !stripe) throw new HttpError(500, 'Stripe is not configured');

  const { details, phone, city } = req.body?.shippingAddress || {};
  if (!details || !phone || !city) {
    throw new HttpError(400, 'shippingAddress details, phone and city are required');
  }

  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('*')
    .eq('id', req.params.cartId)
    .eq('user_id', req.user.id)
    .eq('status', 'active')
    .maybeSingle();
  if (cartError) throw cartError;
  if (!cart) throw new HttpError(404, 'Active cart not found');

  const { data: items, error: itemsError } = await supabase
    .from('cart_items')
    .select('*, products(id,title,image_cover,price,quantity)')
    .eq('cart_id', cart.id);
  if (itemsError) throw itemsError;
  if (!items?.length) throw new HttpError(400, 'Cart is empty');

  for (const item of items) {
    if (!item.products || item.quantity > item.products.quantity) {
      throw new HttpError(400, `${item.products?.title || 'A product'} does not have enough stock`);
    }
  }

  const total = items.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase.from('orders').insert({
    user_id: req.user.id,
    cart_id: cart.id,
    total_order_price: total,
    payment_method: 'card',
    payment_status: 'pending',
    is_paid: false,
    shipping_details: details,
    shipping_phone: phone,
    shipping_city: city
  }).select('*').single();
  if (orderError) throw orderError;

  const snapshots = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_title: item.products.title,
    product_image: item.products.image_cover,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: Number(item.unit_price) * item.quantity
  }));

  const { error: snapshotError } = await supabase.from('order_items').insert(snapshots);
  if (snapshotError) throw snapshotError;

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('email')
    .eq('id', req.user.id)
    .single();
  if (userError) throw userError;

  const frontendBase = safeFrontendBase(req.query.url);
  const backendBase = env.backendPublicUrl.replace(/\/$/, '');

  if (!useStripe) {
    const sessionId = `mock_${randomUUID()}`;
    const { error: sessionUpdateError } = await supabase
      .from('orders')
      .update({ stripe_session_id: sessionId })
      .eq('id', order.id);
    if (sessionUpdateError) throw sessionUpdateError;

    const mockUrl = `${backendBase}/api/v1/mock-payment/checkout/${encodeURIComponent(sessionId)}?return_url=${encodeURIComponent(frontendBase)}`;
    return res.json({ status: 'success', session: { id: sessionId, url: mockUrl } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: env.stripeCurrency,
        unit_amount: Math.round(Number(item.unit_price) * 100),
        product_data: {
          name: item.products.title,
          images: item.products.image_cover ? [item.products.image_cover] : undefined
        }
      }
    })),
    success_url: `${backendBase}/api/v1/orders/checkout-success?session_id={CHECKOUT_SESSION_ID}&return_url=${encodeURIComponent(frontendBase)}`,
    cancel_url: `${frontendBase}/cart`,
    metadata: { orderId: order.id, userId: req.user.id, cartId: cart.id },
    payment_intent_data: {
      metadata: { orderId: order.id, userId: req.user.id, cartId: cart.id }
    }
  });

  const { error: sessionUpdateError } = await supabase
    .from('orders')
    .update({ stripe_session_id: session.id })
    .eq('id', order.id);
  if (sessionUpdateError) throw sessionUpdateError;

  return res.json({ status: 'success', session: { id: session.id, url: session.url } });
}

export async function checkoutSuccess(req, res) {
  if (!stripe) throw new HttpError(500, 'Stripe is not configured');
  const sessionId = String(req.query.session_id || '');
  if (!sessionId) throw new HttpError(400, 'session_id is required');

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent']
  });

  if (session.payment_status !== 'paid') {
    throw new HttpError(400, 'Payment has not been completed');
  }

  await finalizePaidCheckout(session);
  const frontendBase = safeFrontendBase(req.query.return_url);
  return res.redirect(`${frontendBase}/allorders`);
}

