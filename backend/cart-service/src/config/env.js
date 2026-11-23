import dotenv from 'dotenv'; import { fileURLToPath } from 'node:url'; const p=fileURLToPath(new URL('../../.env',import.meta.url)); dotenv.config({path:p});
for(const k of ['JWT_SECRET','SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY']) if(!process.env[k]) throw new Error(`[cart-service] Missing ${k}`);
export const env={port:Number(process.env.PORT||3003),jwtSecret:process.env.JWT_SECRET,supabaseUrl:process.env.SUPABASE_URL,supabaseServiceRoleKey:process.env.SUPABASE_SERVICE_ROLE_KEY};
