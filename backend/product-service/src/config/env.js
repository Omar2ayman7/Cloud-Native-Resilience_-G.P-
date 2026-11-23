import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
const envPath=fileURLToPath(new URL('../../.env', import.meta.url)); dotenv.config({path:envPath});
for(const key of ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY']) if(!process.env[key]) throw new Error(`[product-service] Missing ${key}`);
export const env={port:Number(process.env.PORT||3002),supabaseUrl:process.env.SUPABASE_URL,supabaseServiceRoleKey:process.env.SUPABASE_SERVICE_ROLE_KEY};
