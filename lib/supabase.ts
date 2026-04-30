import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side only client using the service role key (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseKey)
