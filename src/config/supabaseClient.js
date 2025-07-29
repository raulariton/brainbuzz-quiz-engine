import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';

dotenv.config({ quiet: true })

export const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);