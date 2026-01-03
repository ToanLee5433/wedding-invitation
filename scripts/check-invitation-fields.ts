/**
 * Script kiểm tra dữ liệu invitation fields trong Supabase
 * Chạy: npx tsx scripts/check-invitation-fields.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhnarfrkgnotuifqnvzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobmFyZnJrZ25vdHVpZnFudnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNjgxMjgsImV4cCI6MjA4Mjg0NDEyOH0.v28zuHRzMgTjjFaCuIBmpRRzpowk6y4lvbJERX8v3CE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkInvitationFields() {
    console.log('🔍 Kiểm tra 3 trường mới trong Supabase...\n');
    console.log('='.repeat(60) + '\n');

    try {
        const { data, error } = await supabase
            .from('weddings')
            .select('slug, details')
            .eq('slug', 'trang-chien-2026')
            .single();

        if (error) {
            console.log('❌ Lỗi truy vấn:', error.message);
            return;
        }

        if (!data) {
            console.log('❌ Không tìm thấy dữ liệu wedding với slug "trang-chien-2026"');
            return;
        }

        console.log('✅ Tìm thấy bản ghi wedding:', data.slug);
        console.log('\n📋 Nội dung trường "details":\n');
        console.log(JSON.stringify(data.details, null, 2));

        console.log('\n' + '='.repeat(60));
        console.log('\n🔎 KIỂM TRA 3 TRƯỜNG MỚI:\n');

        const details = data.details || {};

        // Check invitation_text
        if (details.invitation_text) {
            console.log('✅ invitation_text: CÓ');
            console.log(`   Giá trị: "${details.invitation_text.substring(0, 50)}..."`);
        } else {
            console.log('❌ invitation_text: KHÔNG CÓ (sẽ dùng giá trị mặc định từ App.tsx)');
        }

        // Check initials
        if (details.initials) {
            console.log('✅ initials: CÓ');
            console.log(`   Giá trị: "${details.initials}"`);
        } else {
            console.log('❌ initials: KHÔNG CÓ (sẽ dùng giá trị mặc định từ App.tsx)');
        }

        // Check invitation_quote
        if (details.invitation_quote) {
            console.log('✅ invitation_quote: CÓ');
            console.log(`   Giá trị: "${details.invitation_quote.substring(0, 50)}..."`);
        } else {
            console.log('❌ invitation_quote: KHÔNG CÓ (sẽ dùng giá trị mặc định từ App.tsx)');
        }

        console.log('\n' + '='.repeat(60));
        console.log('\n📌 GHI CHÚ:');
        console.log('   - Các trường KHÔNG CÓ trong Supabase sẽ sử dụng giá trị mặc định từ App.tsx.');
        console.log('   - Khi admin chỉnh sửa và lưu, các trường sẽ được tạo mới trong Supabase.');
        console.log('   - Vì cột "details" là JSONB, không cần migration database.');

    } catch (err: any) {
        console.log('❌ Lỗi:', err.message);
    }
}

checkInvitationFields().catch(console.error);
