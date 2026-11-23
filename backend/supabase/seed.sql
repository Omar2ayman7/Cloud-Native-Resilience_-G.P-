-- Small demo catalog. Safe to run after schema.sql.
insert into public.categories (id,name,slug,image) values
('11111111-1111-4111-8111-111111111111','Electronics','electronics','https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800'),
('22222222-2222-4222-8222-222222222222','Fashion','fashion','https://images.unsplash.com/photo-1445205170230-053b83016050?w=800'),
('33333333-3333-4333-8333-333333333333','Home','home','https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800'),
('44444444-4444-4444-8444-444444444444','Beauty','beauty','https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800')
on conflict (id) do nothing;

insert into public.brands (id,name,slug,image) values
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Fresh Tech','fresh-tech',''),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','Urban Style','urban-style',''),
('cccccccc-cccc-4ccc-8ccc-cccccccccccc','Daily Home','daily-home','')
on conflict (id) do nothing;

insert into public.products
(id,title,slug,description,quantity,price,image_cover,category_id,brand_id,ratings_average,ratings_quantity,sold)
values
('10000000-0000-4000-8000-000000000001','Wireless Headphones','wireless-headphones','Comfortable wireless headphones for daily use.',25,1499,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900','11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',4.6,128,52),
('10000000-0000-4000-8000-000000000002','Smart Watch','smart-watch','Simple smart watch with activity tracking.',18,2199,'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900','11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',4.4,96,38),
('10000000-0000-4000-8000-000000000003','Classic Sneakers','classic-sneakers','Comfortable everyday sneakers.',40,1299,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900','22222222-2222-4222-8222-222222222222','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',4.5,80,61),
('10000000-0000-4000-8000-000000000004','Casual Backpack','casual-backpack','Lightweight backpack for work and university.',30,899,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900','22222222-2222-4222-8222-222222222222','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',4.3,54,20),
('10000000-0000-4000-8000-000000000005','Table Lamp','table-lamp','Warm desk lamp for home and study.',15,649,'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900','33333333-3333-4333-8333-333333333333','cccccccc-cccc-4ccc-8ccc-cccccccccccc',4.2,43,17),
('10000000-0000-4000-8000-000000000006','Skin Care Set','skin-care-set','Daily skin care essentials.',22,999,'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900','44444444-4444-4444-8444-444444444444','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',4.7,71,33)
on conflict (id) do nothing;

insert into public.product_images (product_id,image_url,sort_order)
select id,image_cover,0 from public.products
where id in (
'10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
'10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
'10000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000006')
and not exists (select 1 from public.product_images pi where pi.product_id = products.id and pi.sort_order = 0);

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
