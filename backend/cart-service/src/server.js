import express from 'express'; import { env } from './config/env.js'; import cartRoutes from './routes/cartRoutes.js';
const app=express(); app.use(express.json()); app.get('/health',(_q,r)=>r.json({status:'ok',service:'cart-service'})); app.use('/api/v1/cart',cartRoutes);
app.use((req,res)=>res.status(404).json({message:`Route not found: ${req.method} ${req.originalUrl}`})); app.use((err,_req,res,_next)=>{console.error(err);res.status(err.statusCode||500).json({status:'fail',message:err.message||'Internal server error'});});
app.listen(env.port,()=>console.log(`Cart Service listening on http://localhost:${env.port}`));
