/**
 * Script xác nhận dữ liệu đã được thiết lập
 * Chạy: npx -y tsx scripts/verify-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);


async function verifyDatabase() {
    console.log('🔍 XÁC NHẬN DỮ LIỆU DATABASE\n');
    console.log('='.repeat(60) + '\n');

    // 1. Kiểm tra bảng weddings
    console.log('📋 BẢNG WEDDINGS:');
    const { data: weddings, error: weddingsError } = await supabase
        .from('weddings')
        .select('*');

    if (weddingsError) {
        console.log(`❌ Lỗi: ${weddingsError.message}`);
    } else {
        console.log(`✅ Số bản ghi: ${weddings?.length || 0}`);
        if (weddings && weddings.length > 0) {
            weddings.forEach((w, i) => {
                console.log(`\n   [${i + 1}] ID: ${w.id}`);
                console.log(`       Slug: ${w.slug}`);
                console.log(`       Groom: ${w.details?.groom_name || 'N/A'}`);
                console.log(`       Bride: ${w.details?.bride_name || 'N/A'}`);
                console.log(`       Event Date: ${w.details?.event_date || 'N/A'}`);
                console.log(`       Hero Image: ${w.hero_image ? 'Có' : 'Không'}`);
                console.log(`       Music URL: ${w.music_url ? 'Có' : 'Không'}`);
            });
        }
    }

    console.log('\n' + '-'.repeat(60) + '\n');

    // 2. Kiểm tra bảng guests
    console.log('📋 BẢNG GUESTS:');
    const { data: guests, error: guestsError } = await supabase
        .from('guests')
        .select('*');

    if (guestsError) {
        console.log(`❌ Lỗi: ${guestsError.message}`);
    } else {
        console.log(`✅ Số khách mời: ${guests?.length || 0}`);
        if (guests && guests.length > 0) {
            guests.forEach((g, i) => {
                console.log(`\n   [${i + 1}] ${g.guest_name}`);
                console.log(`       Nhóm: ${g.guest_group || 'N/A'}`);
                console.log(`       Trạng thái: ${g.attendance_status === null ? 'Chưa trả lời' : g.attendance_status ? 'Tham dự' : 'Không tham dự'}`);
            });
        } else {
            console.log('   (Chưa có khách mời nào)');
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ XÁC NHẬN HOÀN TẤT!');
    console.log('\n💡 Các bước tiếp theo:');
    console.log('   1. Mở ứng dụng: npm run dev');
    console.log('   2. Truy cập: http://localhost:5173');
    console.log('   3. Kiểm tra thiệp cưới với slug: trang-chien-2026\n');
}

verifyDatabase().catch(console.error);
