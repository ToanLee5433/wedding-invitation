
import { createClient } from '@supabase/supabase-js';

// URL và Key được lấy từ .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Kiểm tra lỗi nếu thiếu config
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables! Check your .env file.');
}

// Khởi tạo Supabase client (fallback to empty string to prevent crash)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Log để debug
console.log('✅ Supabase client initialized with URL:', supabaseUrl);

