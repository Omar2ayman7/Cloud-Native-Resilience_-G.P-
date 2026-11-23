import { supabase } from '../config/supabase.js';
import { productDto } from '../services/mappers.js';
import { HttpError } from '../utils/httpError.js';

const productSelect = '*, categories(*), brands(*), product_images(*)';

export async function getProducts(_req, res) {
  const { data, error } = await supabase.from('products').select(productSelect).order('created_at', { ascending: false });
  if (error) throw error;
  res.json({ results: data.length, data: data.map(productDto) });
}

export async function getProductById(req, res) {
  const { data, error } = await supabase.from('products').select(productSelect).eq('id', req.params.id).maybeSingle();
  if (error) throw error;
  if (!data) throw new HttpError(404, 'Product not found');
  res.json({ data: productDto(data) });
}
