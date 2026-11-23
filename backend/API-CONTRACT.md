# Frontend-compatible API contract

Base path: `/api/v1`

| Method | Endpoint | Auth header | Existing frontend use |
|---|---|---|---|
| POST | `/auth/signup` | No | Register |
| POST | `/auth/signin` | No | Login; response contains `token` |
| GET | `/products` | No | Product lists/home |
| GET | `/products/:id` | No | Product details |
| GET | `/categories` | No | Categories/home |
| GET | `/cart` | `token` | Logged user's cart |
| POST | `/cart` | `token` | Body: `{ "productId": "..." }` |
| PUT | `/cart/:productId` | `token` | Body: `{ "count": 2 }` |
| DELETE | `/cart/:productId` | `token` | Remove item |
| POST | `/orders/checkout-session/:cartId?url=...` | `token` | Create Stripe Checkout URL |
| GET | `/orders/user/:userId` | `token` | Paid My Orders array |
| GET | `/orders/checkout-success` | Stripe redirect | Verify paid Checkout Session then redirect to Angular `/allorders` |
| POST | `/webhooks/stripe` | Stripe signature | Server-to-server payment confirmation |

## Compatibility details

- JWT payload contains `{ "id": "USER_UUID" }` because the existing Angular frontend decodes `id`.
- Protected frontend requests authenticate using the HTTP header `token`, not `Authorization: Bearer ...`.
- Product responses expose frontend names such as `_id`, `imageCover`, `ratingsAverage`, `createdAt`.
- Cart responses expose `products`, `count`, `price`, and `totalCartPrice`.
- Checkout response exposes `session.url` because the current Angular page navigates directly to that value.
- Orders expose `totalOrderPrice`, `isPaid`, `createdAt`, and `cartItems`.

## Local mock payment (development default)

`POST /api/v1/orders/checkout-session/:cartId` keeps the same frontend contract and returns `session.url`.
With `PAYMENT_PROVIDER=mock`, that URL points to the backend-hosted test checkout page.

Test cards:
- `4242 4242 4242 4242` -> successful payment and redirect to `/allorders`.
- `4000 0000 0000 0002` -> declined payment.

No card number, expiry, or CVV is stored in the database.
