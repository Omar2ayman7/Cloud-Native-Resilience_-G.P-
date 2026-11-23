import { supabase } from '../config/supabase.js';
import { orderDto } from '../services/mappers.js';
import { HttpError } from '../utils/httpError.js';

export async function getUserOrders(req, res) {
  if (req.params.userId !== req.user.id) {
    throw new HttpError(403, 'You can only view your own orders');
  }

  // The video/user flow shows completed purchases in All Orders.
  // Pending/cancelled checkout attempts are intentionally hidden.
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('is_paid', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  if (!orders.length) return res.json([]);

  const ids = orders.map((o) => o.id);
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', ids)
    .order('created_at');
  if (itemsError) throw itemsError;

  const grouped = new Map(ids.map((id) => [id, []]));
  for (const item of items || []) grouped.get(item.order_id)?.push(item);

  res.json(orders.map((order) => orderDto(order, grouped.get(order.id) || [])));
}
