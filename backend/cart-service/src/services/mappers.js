const iso = (value) => (value ? new Date(value).toISOString() : null);

export function categoryDto(row) {
  if (!row) return null;
  return {
    _id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.image || '',
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at)
  };
}

export function brandDto(row) {
  if (!row) return { _id: '', name: '', slug: '', image: '' };
  return {
    _id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.image || ''
  };
}

export function productDto(row) {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  const brand = Array.isArray(row.brands) ? row.brands[0] : row.brands;
  const imageRows = row.product_images || [];
  return {
    sold: row.sold || 0,
    images: imageRows.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map((x) => x.image_url),
    subcategory: [],
    ratingsQuantity: row.ratings_quantity || 0,
    _id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || '',
    quantity: row.quantity || 0,
    price: Number(row.price || 0),
    imageCover: row.image_cover || '',
    category: categoryDto(category),
    brand: brandDto(brand),
    ratingsAverage: Number(row.ratings_average || 0),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    id: row.id
  };
}

export function cartDto(cart, items) {
  const products = (items || []).map((item) => ({
    count: item.quantity,
    _id: item.id,
    product: productDto(item.products),
    price: Number(item.unit_price)
  }));

  return {
    _id: cart.id,
    cartOwner: cart.user_id,
    products,
    createdAt: iso(cart.created_at),
    updatedAt: iso(cart.updated_at),
    __v: 0,
    totalCartPrice: products.reduce((sum, item) => sum + item.price * item.count, 0)
  };
}

export function orderDto(order, items) {
  return {
    _id: order.id,
    id: order.id,
    user: order.user_id,
    totalOrderPrice: Number(order.total_order_price || 0),
    paymentMethodType: order.payment_method || 'card',
    isPaid: Boolean(order.is_paid),
    paidAt: iso(order.paid_at),
    createdAt: iso(order.created_at),
    updatedAt: iso(order.updated_at),
    cartItems: (items || []).map((item) => ({
      _id: item.id,
      count: item.quantity,
      price: Number(item.unit_price),
      product: {
        _id: item.product_id,
        id: item.product_id,
        title: item.product_title,
        imageCover: item.product_image || ''
      }
    }))
  };
}
