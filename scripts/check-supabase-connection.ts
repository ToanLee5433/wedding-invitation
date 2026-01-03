/**
 * Script kiểm tra kết nối Supabase
 * Chạy: npx tsx scripts/check-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';

// Lấy cấu hình từ supabaseClient.ts
const supabaseUrl = 'https://dhnarfrkgnotuifqnvzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobmFyZnJrZ25vdHVpZnFudnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNjgxMjgsImV4cCI6MjA4Mjg0NDEyOH0.v28zuHRzMgTjjFaCuIBmpRRzpowk6y4lvbJERX8v3CE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
    console.log('🔍 Đang kiểm tra kết nối Supabase...\n');
    console.log(`📌 URL: ${supabaseUrl}`);
    console.log(`📌 Anon Key: ${supabaseAnonKey.substring(0, 20)}...`);
    console.log('\n' + '='.repeat(50) + '\n');

    const results: { test: string; status: 'OK' | 'FAIL'; message: string }[] = [];

    // Test 1: Kiểm tra kết nối cơ bản
    try {
        const { error } = await supabase.from('weddings').select('count').limit(0);
        if (error) {
            results.push({
                test: 'Kết nối cơ bản',
                status: 'FAIL',
                message: error.message
            });
        } else {
            results.push({
                test: 'Kết nối cơ bản',
                status: 'OK',
                message: 'Đã kết nối thành công với Supabase'
            });
        }
    } catch (err: any) {
        results.push({
            test: 'Kết nối cơ bản',
            status: 'FAIL',
            message: err.message
        });
    }

    // Test 2: Kiểm tra bảng weddings
    try {
        const { data, error } = await supabase.from('weddings').select('*').limit(1);
        if (error) {
            results.push({
                test: 'Bảng weddings',
                status: 'FAIL',
                message: error.message
            });
        } else {
            results.push({
                test: 'Bảng weddings',
                status: 'OK',
                message: `Tìm thấy ${data?.length || 0} bản ghi`
            });
        }
    } catch (err: any) {
        results.push({
            test: 'Bảng weddings',
            status: 'FAIL',
            message: err.message
        });
    }

    // Test 3: Kiểm tra bảng guests
    try {
        const { data, error } = await supabase.from('guests').select('*').limit(1);
        if (error) {
            results.push({
                test: 'Bảng guests',
                status: 'FAIL',
                message: error.message
            });
        } else {
            results.push({
                test: 'Bảng guests',
                status: 'OK',
                message: `Tìm thấy ${data?.length || 0} bản ghi`
            });
        }
    } catch (err: any) {
        results.push({
            test: 'Bảng guests',
            status: 'FAIL',
            message: err.message
        });
    }

    // In kết quả
    console.log('📊 KẾT QUẢ KIỂM TRA:\n');
    results.forEach((r, i) => {
        const icon = r.status === 'OK' ? '✅' : '❌';
        console.log(`${i + 1}. ${icon} ${r.test}`);
        console.log(`   ${r.message}\n`);
    });

    const allPassed = results.every(r => r.status === 'OK');
    console.log('='.repeat(50));
    if (allPassed) {
        console.log('\n🎉 TẤT CẢ KIỂM TRA ĐỀU THÀNH CÔNG!');
        console.log('✅ Hệ thống đã kết nối thành công với Supabase.');
    } else {
        console.log('\n⚠️  MỘT SỐ KIỂM TRA KHÔNG THÀNH CÔNG');
        console.log('❌ Vui lòng kiểm tra lại cấu hình Supabase.');
    }
}

checkConnection().catch(console.error);
