import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gzxqihihmpyhalxjcebk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eHFpaGlobXB5aGFseGpjZWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNTMxOTUsImV4cCI6MjA4NDYyOTE5NX0.z4w2FNNEjgaF4gd2B6UrckBhiBaiUh5pGFeY7hqOv5s";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
