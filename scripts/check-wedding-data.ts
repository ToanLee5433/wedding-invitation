/**
 * Script kiểm tra chi tiết dữ liệu wedding trong Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhnarfrkgnotuifqnvzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobmFyZnJrZ25vdHVpZnFudnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNjgxMjgsImV4cCI6MjA4Mjg0NDEyOH0.v28zuHRzMgTjjFaCuIBmpRRzpowk6y4lvbJERX8v3CE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkWeddingData() {
    console.log('🔍 KIỂM TRA CHI TIẾT DỮ LIỆU WEDDING\n');
    console.log('='.repeat(60) + '\n');

    const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', 'trang-chien-2026')
        .single();

    if (error) {
        console.log('❌ Lỗi:', error.message);
        return;
    }

    console.log('📋 Thông tin Wedding:\n');
    console.log('ID:', data.id);
    console.log('Slug:', data.slug);
    console.log('Hero Image:', data.hero_image ? '✅ Có' : '❌ Thiếu');
    console.log('Music URL:', data.music_url ? '✅ Có' : '❌ Thiếu');
    console.log('Album URLs:', data.album_urls?.length || 0, 'ảnh');
    console.log('QR Groom:', data.qr_groom ? '✅ Có' : '❌ Thiếu');
    console.log('QR Bride:', data.qr_bride ? '✅ Có' : '❌ Thiếu');

    console.log('\n📋 Chi tiết (details):\n');
    const details = data.details || {};
    console.log('Groom Name:', details.groom_name || '❌ Thiếu');
    console.log('Bride Name:', details.bride_name || '❌ Thiếu');
    console.log('Event Date:', details.event_date || '❌ Thiếu');
    console.log('Milestones:', details.milestones?.length || 0, 'mốc');

    if (details.milestones && details.milestones.length > 0) {
        console.log('\n   Các mốc:');
        details.milestones.forEach((m: any, i: number) => {
            console.log(`   ${i + 1}. ${m.title} (${m.date})`);
        });
    }

    console.log('\nVu Quy:', details.vuQuy ? JSON.stringify(details.vuQuy, null, 2) : '❌ Thiếu');
    console.log('\nThanh Hon:', details.thanhHon ? JSON.stringify(details.thanhHon, null, 2) : '❌ Thiếu');

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 RAW DATA:\n');
    console.log(JSON.stringify(data, null, 2));
}

checkWeddingData().catch(console.error);
