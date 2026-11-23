import { stripe } from '../config/stripe.js';
import { env } from '../config/env.js';
import { supabase } from '../config/supabase.js';
import { finalizePaidCheckout } from '../services/paymentService.js';

export async function stripeWebhook(req, res) {
  if (!stripe || !env.stripeWebhookSecret) {
    return res.status(500).send('Stripe webhook is not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      env.stripeWebhookSecret
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  const { data: already, error: lookupError } = await supabase
    .from('stripe_webhook_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (already) return res.json({ received: true, duplicate: true });

  const { error: eventInsertError } = await supabase.from('stripe_webhook_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
    processed: false
  });
  if (eventInsertError) throw eventInsertError;

  try {
    if (event.type === 'checkout.session.completed') {
      await finalizePaidCheckout(event.data.object);
    }

    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object;
      if (intent.metadata?.orderId) {
        const { error } = await supabase
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('id', intent.metadata.orderId);
        if (error) throw error;
      }
    }

    const { error: processedError } = await supabase
      .from('stripe_webhook_events')
      .update({ processed: true })
      .eq('stripe_event_id', event.id);
    if (processedError) throw processedError;

    return res.json({ received: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ received: false });
  }
}
