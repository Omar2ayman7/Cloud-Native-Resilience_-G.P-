import { supabase } from '../config/supabase.js';
import { getOrCreateActiveCart, getProduct, loadCartDto } from '../services/cartService.js';
import { HttpError } from '../utils/httpError.js';

export async function getCart(req, res) {
  res.json({ status: 'success', data: await loadCartDto(req.user.id) });
}

export async function addToCart(req, res) {
  const { productId } = req.body || {};
  if (!productId) throw new HttpError(400, 'productId is required');
  const [cart, product] = await Promise.all([getOrCreateActiveCart(req.user.id), getProduct(productId)]);
  if (product.quantity < 1) throw new HttpError(400, 'Product is out of stock');

  const { data: existing, error: findError } = await supabase.from('cart_items').select('*')
    .eq('cart_id', cart.id).eq('product_id', productId).maybeSingle();
  if (findError) throw findError;

  if (existing) {
    const nextQty = existing.quantity + 1;
    if (nextQty > product.quantity) throw new HttpError(400, 'Requested quantity exceeds stock');
    const { error } = await supabase.from('cart_items').update({ quantity: nextQty, unit_price: product.price }).eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('cart_items').insert({ cart_id: cart.id, product_id: productId, quantity: 1, unit_price: product.price });
    if (error) throw error;
  }

  res.json({ status: 'success', message: 'Product added successfully to your cart', data: await loadCartDto(req.user.id) });
}

export async function updateCartItem(req, res) {
  const count = Number(req.body?.count);
  if (!Number.isInteger(count) || count < 1) throw new HttpError(400, 'count must be an integer greater than 0');
  const [cart, product] = await Promise.all([getOrCreateActiveCart(req.user.id), getProduct(req.params.productId)]);
  if (count > product.quantity) throw new HttpError(400, 'Requested quantity exceeds stock');

  const { data: item, error: findError } = await supabase.from('cart_items').select('id').eq('cart_id', cart.id)
    .eq('product_id', req.params.productId).maybeSingle();
  if (findError) throw findError;
  if (!item) throw new HttpError(404, 'Product is not in cart');

  const { error } = await supabase.from('cart_items').update({ quantity: count, unit_price: product.price }).eq('id', item.id);
  if (error) throw error;
  res.json({ status: 'success', data: await loadCartDto(req.user.id) });
}

export async function removeCartItem(req, res) {
  const cart = await getOrCreateActiveCart(req.user.id);
  const { error } = await supabase.from('cart_items').delete().eq('cart_id', cart.id).eq('product_id', req.params.productId);
  if (error) throw error;
  res.json({ status: 'success', data: await loadCartDto(req.user.id) });
}
