import express from 'express'; import { env } from './config/env.js'; import productRoutes from './routes/productRoutes.js'; import categoryRoutes from './routes/categoryRoutes.js';
const app=express(); app.use(express.json()); app.get('/health',(_q,r)=>r.json({status:'ok',service:'product-service'}));
app.use('/api/v1/products',productRoutes); app.use('/api/v1/categories',categoryRoutes);
app.use((req,res)=>res.status(404).json({message:`Route not found: ${req.method} ${req.originalUrl}`}));
app.use((err,_req,res,_next)=>{console.error(err);res.status(err.statusCode||500).json({status:'fail',message:err.message||'Internal server error'});});
app.listen(env.port,()=>console.log(`Product Service listening on http://localhost:${env.port}`));
