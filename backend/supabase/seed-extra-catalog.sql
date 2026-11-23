-- Extra demo categories and products for a richer FreshCart catalog.
insert into public.categories (id,name,slug,image) values
('55555555-5555-4555-8555-555555555555','Clothing','clothing','https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800'),
('66666666-6666-4666-8666-666666666666','Grocery','grocery','https://images.unsplash.com/photo-1542838132-92c53300491e?w=800')
on conflict (id) do nothing;

insert into public.brands (id,name,slug,image) values
('dddddddd-dddd-4ddd-8ddd-dddddddddddd','Fresh Wear','fresh-wear',''),
('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','Fresh Market','fresh-market','')
on conflict (id) do nothing;

insert into public.products
(id,title,slug,description,quantity,price,image_cover,category_id,brand_id,ratings_average,ratings_quantity,sold)
values
('10000000-0000-4000-8000-000000000007','Classic Cotton T-Shirt','classic-cotton-t-shirt','Soft cotton T-shirt for everyday wear.',60,399,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900','55555555-5555-4555-8555-555555555555','dddddddd-dddd-4ddd-8ddd-dddddddddddd',4.5,83,44),
('10000000-0000-4000-8000-000000000008','Casual Hoodie','casual-hoodie','Comfortable hoodie for cool weather.',35,899,'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900','55555555-5555-4555-8555-555555555555','dddddddd-dddd-4ddd-8ddd-dddddddddddd',4.7,102,57),
('10000000-0000-4000-8000-000000000009','Slim Fit Jeans','slim-fit-jeans','Everyday slim fit denim jeans.',42,1099,'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900','55555555-5555-4555-8555-555555555555','dddddddd-dddd-4ddd-8ddd-dddddddddddd',4.4,69,31),
('10000000-0000-4000-8000-000000000010','Fresh Milk 1L','fresh-milk-1l','Fresh full-cream milk, one litre.',100,55,'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=900','66666666-6666-4666-8666-666666666666','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',4.6,51,88),
('10000000-0000-4000-8000-000000000011','Premium Rice 1kg','premium-rice-1kg','Premium long-grain rice for everyday meals.',80,79,'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900','66666666-6666-4666-8666-666666666666','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',4.5,47,72),
('10000000-0000-4000-8000-000000000012','Italian Pasta 500g','italian-pasta-500g','Durum wheat pasta, 500 grams.',90,48,'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=900','66666666-6666-4666-8666-666666666666','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',4.4,39,64),
('10000000-0000-4000-8000-000000000013','Ground Coffee 250g','ground-coffee-250g','Medium-roast ground coffee.',55,165,'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900','66666666-6666-4666-8666-666666666666','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',4.8,91,76)
on conflict (id) do nothing;

insert into public.product_images (product_id,image_url,sort_order)
select id,image_cover,0 from public.products
where id in (
'10000000-0000-4000-8000-000000000007','10000000-0000-4000-8000-000000000008',
'10000000-0000-4000-8000-000000000009','10000000-0000-4000-8000-000000000010',
'10000000-0000-4000-8000-000000000011','10000000-0000-4000-8000-000000000012',
'10000000-0000-4000-8000-000000000013')
and not exists (
  select 1 from public.product_images pi
  where pi.product_id = products.id and pi.sort_order = 0
);
