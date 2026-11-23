import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const envPath = fileURLToPath(new URL('../.env', import.meta.url));
dotenv.config({ path: envPath });

const app = express();
const port = Number(process.env.PORT || 3000);
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';

const allowedOrigins = [
  ...frontendOrigin.split(',').map(origin => origin.trim()),
  'http://freshcart.local',
  'http://freshcart.local:8080',
  'http://localhost:4200',
  'http://localhost:3000'
];
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without Origin (e.g. internal services)
    if (!origin || origin === 'null' || allowedOrigins.includes(origin)) {
  return callback(null, true);
}

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
};
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(morgan('dev'));

function makeProxy(name, target, prefixes) {
  return createProxyMiddleware({
    pathFilter: (pathname) => prefixes.some((prefix) => pathname.startsWith(prefix)),
    target,
    changeOrigin: true,
    xfwd: true,
    proxyTimeout: 15000,
    timeout: 15000,
    on: {
      proxyReq(proxyReq, req) {
        console.log(`[gateway] ${req.method} ${req.originalUrl} -> ${name} (${target})`);
      },
      error(err, req, res) {
        console.error(`[gateway] ${name} failed for ${req.method} ${req.url}:`, err.message);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
        }
        res.end(JSON.stringify({
          status: 'fail',
          message: `${name} is temporarily unavailable`
        }));
      }
    }
  });
}

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

app.use(makeProxy(
  'auth-service',
  process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  ['/api/v1/auth']
));

app.use(makeProxy(
  'product-service',
  process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  ['/api/v1/products', '/api/v1/categories']
));

app.use(makeProxy(
  'cart-service',
  process.env.CART_SERVICE_URL || 'http://localhost:3003',
  ['/api/v1/cart']
));

app.use(makeProxy(
  'order-service',
  process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
  ['/api/v1/orders/user']
));

app.use(makeProxy(
  'payment-service',
  process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
  [
    '/api/v1/orders/checkout-session',
    '/api/v1/orders/checkout-success',
    '/api/v1/mock-payment',
    '/api/v1/webhooks/stripe'
  ]
));

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.listen(port, () => {
  console.log(`API Gateway listening on http://localhost:${port}`);
});
