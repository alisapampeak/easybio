import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = 'https://wkyahwiwmmldmbfqguns.supabase.co'
   const supabaseKey = 'sb_publishable__PQH5n2gnzxt1LX0pgvwBQ_I8Qwyg6p'

   export const supabase = createClient(supabaseUrl, supabaseKey)