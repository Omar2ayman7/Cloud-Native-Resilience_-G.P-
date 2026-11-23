# FreshCart Microservices Backend

The previous single Express backend has been split into independent services. The Angular frontend API contract remains unchanged and still calls `http://localhost:3000/api/v1/`.

## Services and ports

| Service | Port | Responsibility |
|---|---:|---|
| `api-gateway` | 3000 | Single public entry point used by Angular; routes requests to services |
| `auth-service` | 3001 | Register, login and JWT creation |
| `product-service` | 3002 | Products, product details and categories |
| `cart-service` | 3003 | Get/add/update/remove cart items |
| `order-service` | 3004 | Read completed user orders |
| `payment-service` | 3005 | Checkout session, mock payment page, order creation/payment completion |

Supabase remains the shared managed PostgreSQL database in this phase. This gives service/process isolation now; database ownership can be split into schemas/databases later if required.

## Request routing

```text
Angular (localhost:4200)
        |
        v
API Gateway (localhost:3000)
  |-- /api/v1/auth/* ----------------------> Auth Service :3001
  |-- /api/v1/products/* ------------------> Product Service :3002
  |-- /api/v1/categories/* ----------------> Product Service :3002
  |-- /api/v1/cart/* ----------------------> Cart Service :3003
  |-- /api/v1/orders/user/* ---------------> Order Service :3004
  |-- /api/v1/orders/checkout-session/* ---> Payment Service :3005
  |-- /api/v1/mock-payment/* --------------> Payment Service :3005
```

## Run locally

Open one terminal per service and run `npm install` once, then `npm run dev`.

```bash
cd backend/auth-service && npm install && npm run dev
cd backend/product-service && npm install && npm run dev
cd backend/cart-service && npm install && npm run dev
cd backend/order-service && npm install && npm run dev
cd backend/payment-service && npm install && npm run dev
cd backend/api-gateway && npm install && npm run dev
```

Start the Angular frontend separately from the project root with `npm start`.

## Recommended start order

1. Auth Service
2. Product Service
3. Cart Service
4. Order Service
5. Payment Service
6. API Gateway
7. Angular frontend

## Health checks

- `http://localhost:3000/health` gateway
- `http://localhost:3001/health` auth
- `http://localhost:3002/health` products
- `http://localhost:3003/health` cart
- `http://localhost:3004/health` orders
- `http://localhost:3005/health` payment

## Important

All JWT-protected services use the same `JWT_SECRET` so tokens created by Auth Service can be verified by Cart, Order and Payment services.

No Dockerfiles are included yet. Dockerization is the next step after this multi-process version is tested end-to-end.

## Mock payment files
The mock checkout is intentionally inside `payment-service`:

- `payment-service/src/controllers/paymentController.js` creates the checkout session URL.
- `payment-service/src/routes/mockPaymentRoutes.js` exposes the mock checkout/pay/cancel routes.
- `payment-service/src/controllers/mockPaymentController.js` processes the simulated payment.
- `payment-service/src/views/mockCheckoutPage.js` contains the visible payment and success pages.

The API Gateway forwards `/api/v1/mock-payment/*` and `/api/v1/orders/checkout-session/*` to port 3005.

Test payment card for success: `4242 4242 4242 4242`.

## Extra Clothing + Grocery catalog
If you already ran the original `seed.sql`, you do not need to rebuild the database.
Run only `supabase/seed-extra-catalog.sql` in the Supabase SQL Editor to add the new Clothing and Grocery categories and products. It is idempotent and can be run safely more than once.
