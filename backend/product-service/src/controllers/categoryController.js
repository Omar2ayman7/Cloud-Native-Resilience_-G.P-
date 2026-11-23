import { supabase } from '../config/supabase.js';
import { categoryDto } from '../services/mappers.js';

export async function getCategories(_req, res) {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  res.json({ results: data.length, data: data.map(categoryDto) });
}
