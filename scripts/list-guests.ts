/**
 * Script liệt kê tất cả guests hiện có 
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhnarfrkgnotuifqnvzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobmFyZnJrZ25vdHVpZnFudnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNjgxMjgsImV4cCI6MjA4Mjg0NDEyOH0.v28zuHRzMgTjjFaCuIBmpRRzpowk6y4lvbJERX8v3CE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAllGuests() {
    console.log('📋 DANH SÁCH TẤT CẢ GUESTS:\n');

    const { data, error, count } = await supabase
        .from('guests')
        .select('*', { count: 'exact' });

    if (error) {
        console.log('❌ Lỗi:', error.message);
        return;
    }

    console.log(`Tổng số: ${data?.length || 0} guests\n`);

    if (data && data.length > 0) {
        data.forEach((g, i) => {
            console.log(`${i + 1}. ${g.guest_name}`);
            console.log(`   ID: ${g.id}`);
            console.log(`   Group: ${g.guest_group || 'N/A'}`);
            console.log(`   Wedding ID: ${g.wedding_id}`);
            console.log(`   Status: ${g.attendance_status === true ? 'Xác nhận' : g.attendance_status === false ? 'Từ chối' : 'Chưa trả lời'}`);
            console.log(`   Link: ${g.invite_link || 'N/A'}`);
            console.log('');
        });
    } else {
        console.log('(Không có guests nào)\n');
        console.log('💡 Hãy tạo thêm guests bằng cách:');
        console.log('   1. Vào Admin Console');
        console.log('   2. Nhập tên khách và nhấn "Tạo lời mời"');
    }
}

listAllGuests().catch(console.error);
