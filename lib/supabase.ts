
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ccnialybatzefrtulruy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbmlhbHliYXR6ZWZydHVscnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTY1MjQsImV4cCI6MjA4NTg5MjUyNH0.VQmHOCoSn9MvJpo48d8yxGVrj1hGHul95pko5i3J-Rc';

export const supabase = createClient(supabaseUrl, supabaseKey);
