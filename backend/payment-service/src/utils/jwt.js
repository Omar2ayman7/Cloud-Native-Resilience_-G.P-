import jwt from 'jsonwebtoken';import{env}from'../config/env.js';export const verifyToken=(token)=>jwt.verify(token,env.jwtSecret);
