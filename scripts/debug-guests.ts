/**
 * Script kiểm tra chi tiết bảng guests
 * Chạy: npx -y tsx scripts/debug-guests.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhnarfrkgnotuifqnvzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobmFyZnJrZ25vdHVpZnFudnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNjgxMjgsImV4cCI6MjA4Mjg0NDEyOH0.v28zuHRzMgTjjFaCuIBmpRRzpowk6y4lvbJERX8v3CE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugGuests() {
    console.log('🔍 DEBUG: Kiểm tra bảng guests\n');
    console.log('='.repeat(60) + '\n');

    // 1. Kiểm tra wedding
    console.log('📋 1. Lấy thông tin wedding...');
    const { data: wedding, error: weddingError } = await supabase
        .from('weddings')
        .select('id, slug')
        .single();

    if (weddingError) {
        console.log('❌ Lỗi lấy wedding:', weddingError.message);
        console.log('   Chi tiết:', JSON.stringify(weddingError, null, 2));
    } else {
        console.log('✅ Wedding ID:', wedding?.id);
        console.log('   Slug:', wedding?.slug);
    }

    console.log('\n' + '-'.repeat(60) + '\n');

    // 2. Lấy tất cả guests
    console.log('📋 2. Lấy tất cả guests...');
    const { data: guests, error: guestsError } = await supabase
        .from('guests')
        .select('*');

    if (guestsError) {
        console.log('❌ Lỗi lấy guests:', guestsError.message);
        console.log('   Chi tiết:', JSON.stringify(guestsError, null, 2));
        console.log('\n⚠️  Có thể do RLS Policy chưa được cấu hình!');
        console.log('   Hãy chạy SQL sau trong Supabase Dashboard > SQL Editor:\n');
        console.log(`
CREATE POLICY "Public Read Guests" ON guests FOR SELECT USING (true);
CREATE POLICY "Public Insert Guests" ON guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Guests" ON guests FOR DELETE USING (true);
    `);
    } else {
        console.log('✅ Số lượng guests:', guests?.length || 0);
        if (guests && guests.length > 0) {
            console.log('\n   Danh sách:');
            guests.forEach((g, i) => {
                console.log(`   ${i + 1}. ${g.guest_name} (Group: ${g.guest_group || 'N/A'})`);
                console.log(`      - wedding_id: ${g.wedding_id}`);
                console.log(`      - attendance_status: ${g.attendance_status}`);
                console.log(`      - invite_link: ${g.invite_link || 'N/A'}`);
            });
        } else {
            console.log('\n   (Chưa có guest nào trong bảng)');
        }
    }

    console.log('\n' + '-'.repeat(60) + '\n');

    // 3. Test insert
    console.log('📋 3. Test tạo guest mới...');
    const testGuest = {
        wedding_id: wedding?.id,
        guest_name: 'Test_Guest_' + Date.now(),
        guest_group: 'Test Group',
        status: 'invited',
        attendance_status: null
    };

    const { data: insertedGuest, error: insertError } = await supabase
        .from('guests')
        .insert(testGuest)
        .select()
        .single();

    if (insertError) {
        console.log('❌ Lỗi tạo guest:', insertError.message);
        console.log('   Chi tiết:', JSON.stringify(insertError, null, 2));
    } else {
        console.log('✅ Đã tạo guest test:', insertedGuest?.guest_name);
        console.log('   ID:', insertedGuest?.id);

        // Xóa guest test
        console.log('\n📋 4. Xóa guest test...');
        const { error: deleteError } = await supabase
            .from('guests')
            .delete()
            .eq('id', insertedGuest?.id);

        if (deleteError) {
            console.log('❌ Lỗi xóa guest:', deleteError.message);
        } else {
            console.log('✅ Đã xóa guest test');
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ DEBUG HOÀN TẤT\n');
}

debugGuests().catch(console.error);
