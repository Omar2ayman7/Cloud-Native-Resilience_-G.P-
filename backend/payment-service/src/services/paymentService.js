import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';

export async function finalizePaidCheckout(session) {
  const orderId = session.metadata?.orderId;
  const cartId = session.metadata?.cartId;
  const userId = session.metadata?.userId;
  if (!orderId) return null;

  const { data: order, error: orderLookupError } = await supabase
    .from('orders').select('*').eq('id', orderId).maybeSingle();
  if (orderLookupError) throw orderLookupError;
  if (!order) return null;
  if (order.is_paid) return order;

  const paymentIntentId = typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id;
  const paidAt = new Date().toISOString();

  const { error: orderUpdateError } = await supabase.from('orders').update({
    is_paid: true,
    payment_status: 'paid',
    paid_at: paidAt,
    stripe_payment_intent_id: paymentIntentId || null,
    stripe_session_id: session.id
  }).eq('id', orderId);
  if (orderUpdateError) throw orderUpdateError;

  const { data: existingPayment, error: paymentLookupError } = await supabase
    .from('payments').select('id').eq('stripe_session_id', session.id).maybeSingle();
  if (paymentLookupError) throw paymentLookupError;

  if (!existingPayment) {
    const { error: paymentInsertError } = await supabase.from('payments').insert({
      order_id: orderId,
      user_id: userId || order.user_id,
      provider: 'stripe',
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId || null,
      amount: Number(session.amount_total || 0) / 100,
      currency: session.currency || env.stripeCurrency,
      status: 'paid'
    });
    if (paymentInsertError) throw paymentInsertError;
  }

  if (cartId) {
    const { error: cartUpdateError } = await supabase.from('carts').update({ status: 'converted' }).eq('id', cartId);
    if (cartUpdateError) throw cartUpdateError;
  }

  return { ...order, is_paid: true, payment_status: 'paid', paid_at: paidAt };
}

export async function finalizeMockCheckout({ order, sessionId }) {
  if (!order) return null;
  if (order.is_paid) return order;

  const paidAt = new Date().toISOString();
  const { error: orderUpdateError } = await supabase.from('orders').update({
    is_paid: true,
    payment_status: 'paid',
    paid_at: paidAt
  }).eq('id', order.id);
  if (orderUpdateError) throw orderUpdateError;

  const { data: existingPayment, error: paymentLookupError } = await supabase
    .from('payments').select('id').eq('stripe_session_id', sessionId).maybeSingle();
  if (paymentLookupError) throw paymentLookupError;

  if (!existingPayment) {
    const { error: paymentInsertError } = await supabase.from('payments').insert({
      order_id: order.id,
      user_id: order.user_id,
      provider: 'mock',
      stripe_session_id: sessionId,
      stripe_payment_intent_id: null,
      amount: Number(order.total_order_price || 0),
      currency: env.stripeCurrency,
      status: 'paid'
    });
    if (paymentInsertError) throw paymentInsertError;
  }

  if (order.cart_id) {
    const { error: cartUpdateError } = await supabase
      .from('carts').update({ status: 'converted' }).eq('id', order.cart_id);
    if (cartUpdateError) throw cartUpdateError;
  }

  return { ...order, is_paid: true, payment_status: 'paid', paid_at: paidAt };
}
