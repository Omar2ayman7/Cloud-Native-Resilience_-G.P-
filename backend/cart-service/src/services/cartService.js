import { supabase } from '../config/supabase.js';
import { cartDto } from './mappers.js';
import { HttpError } from '../utils/httpError.js';

const itemSelect = '*, products(*, categories(*), brands(*), product_images(*))';

export async function getOrCreateActiveCart(userId) {
  let { data: cart, error } = await supabase.from('carts').select('*').eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (error) throw error;
  if (!cart) {
    const created = await supabase.from('carts').insert({ user_id: userId, status: 'active' }).select('*').single();
    if (created.error) throw created.error;
    cart = created.data;
  }
  return cart;
}

export async function loadCartDto(userId) {
  const cart = await getOrCreateActiveCart(userId);
  const { data: items, error } = await supabase.from('cart_items').select(itemSelect).eq('cart_id', cart.id).order('created_at');
  if (error) throw error;
  return cartDto(cart, items || []);
}

export async function getProduct(productId) {
  const { data, error } = await supabase.from('products').select('id,price,quantity,title').eq('id', productId).maybeSingle();
  if (error) throw error;
  if (!data) throw new HttpError(404, 'Product not found');
  return data;
}
