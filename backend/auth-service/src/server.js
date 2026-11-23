import express from 'express';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'auth-service' }));
app.use('/api/v1/auth', authRoutes);
app.use((req,res)=>res.status(404).json({message:`Route not found: ${req.method} ${req.originalUrl}`}));
app.use((err,_req,res,_next)=>{ console.error(err); res.status(err.statusCode||500).json({status:'fail',message:err.message||'Internal server error'}); });
app.listen(env.port, ()=>console.log(`Auth Service listening on http://localhost:${env.port}`));
