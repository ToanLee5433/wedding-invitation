/**
 * Script kiểm tra đầy đủ các trường dữ liệu trong Supabase
 * Chạy: npx tsx scripts/check-all-fields.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhnarfrkgnotuifqnvzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobmFyZnJrZ25vdHVpZnFudnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNjgxMjgsImV4cCI6MjA4Mjg0NDEyOH0.v28zuHRzMgTjjFaCuIBmpRRzpowk6y4lvbJERX8v3CE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Danh sách tất cả các trường cần có (theo DEFAULT_WEDDING_DATA trong App.tsx)
const REQUIRED_FIELDS = {
    // Top-level fields
    topLevel: ['id', 'slug', 'hero_image', 'music_url', 'album_urls', 'qr_groom', 'qr_bride', 'details'],

    // Details fields
    details: [
        'groom_name',
        'bride_name',
        'event_date',
        'invitation_text',
        'initials',
        'invitation_quote',
        'milestones',
        'vuQuy',
        'thanhHon'
    ],

    // vuQuy fields
    vuQuy: ['title', 'date', 'time', 'location', 'address', 'mapLink'],

    // thanhHon fields
    thanhHon: ['title', 'date', 'time', 'location', 'address', 'mapLink'],

    // Milestone fields (each item)
    milestone: ['date', 'title', 'desc', 'img']
};

async function checkAllFields() {
    console.log('🔍 KIỂM TRA ĐẦY ĐỦ CÁC TRƯỜNG DỮ LIỆU TRONG SUPABASE\n');
    console.log('='.repeat(70) + '\n');

    try {
        const { data, error } = await supabase
            .from('weddings')
            .select('*')
            .eq('slug', 'trang-chien-2026')
            .single();

        if (error) {
            console.log('❌ Lỗi truy vấn:', error.message);
            return;
        }

        if (!data) {
            console.log('❌ Không tìm thấy dữ liệu wedding');
            return;
        }

        console.log('✅ Tìm thấy bản ghi wedding: ' + data.slug);
        console.log('\n' + '─'.repeat(70));

        // === 1. CHECK TOP-LEVEL FIELDS ===
        console.log('\n📦 1. TRƯỜNG CẤP CAO (weddings table):\n');
        let missingTop: string[] = [];
        for (const field of REQUIRED_FIELDS.topLevel) {
            const hasField = data[field] !== undefined;
            const value = data[field];
            const isEmpty = value === null || value === '' || (Array.isArray(value) && value.length === 0);

            if (hasField && !isEmpty) {
                const displayValue = typeof value === 'object' ? JSON.stringify(value).substring(0, 50) + '...' : String(value).substring(0, 50);
                console.log(`   ✅ ${field}: ${displayValue}`);
            } else if (hasField && isEmpty) {
                console.log(`   ⚠️  ${field}: (trống hoặc mảng rỗng)`);
            } else {
                console.log(`   ❌ ${field}: KHÔNG CÓ`);
                missingTop.push(field);
            }
        }

        // === 2. CHECK DETAILS FIELDS ===
        console.log('\n📋 2. TRƯỜNG TRONG "details" (JSONB):\n');
        const details = data.details || {};
        let missingDetails: string[] = [];

        for (const field of REQUIRED_FIELDS.details) {
            const hasField = details[field] !== undefined;
            const value = details[field];
            const isEmpty = value === null || value === '';

            if (hasField && !isEmpty) {
                const displayValue = typeof value === 'object' ?
                    (Array.isArray(value) ? `[Array: ${value.length} items]` : JSON.stringify(value).substring(0, 40) + '...')
                    : String(value).substring(0, 40);
                console.log(`   ✅ ${field}: ${displayValue}`);
            } else {
                console.log(`   ❌ ${field}: KHÔNG CÓ (dùng mặc định từ App.tsx)`);
                missingDetails.push(field);
            }
        }

        // === 3. CHECK vuQuy FIELDS ===
        console.log('\n🎀 3. TRƯỜNG TRONG "details.vuQuy":\n');
        const vuQuy = details.vuQuy || {};
        for (const field of REQUIRED_FIELDS.vuQuy) {
            const hasField = vuQuy[field] !== undefined && vuQuy[field] !== '';
            if (hasField) {
                console.log(`   ✅ ${field}: ${vuQuy[field]}`);
            } else {
                console.log(`   ❌ ${field}: KHÔNG CÓ`);
            }
        }

        // === 4. CHECK thanhHon FIELDS ===
        console.log('\n💍 4. TRƯỜNG TRONG "details.thanhHon":\n');
        const thanhHon = details.thanhHon || {};
        for (const field of REQUIRED_FIELDS.thanhHon) {
            const hasField = thanhHon[field] !== undefined && thanhHon[field] !== '';
            if (hasField) {
                console.log(`   ✅ ${field}: ${thanhHon[field]}`);
            } else {
                console.log(`   ❌ ${field}: KHÔNG CÓ`);
            }
        }

        // === 5. CHECK MILESTONES ===
        console.log('\n📅 5. MILESTONES (Câu chuyện tình yêu):\n');
        const milestones = details.milestones || [];
        if (milestones.length === 0) {
            console.log('   ⚠️  Không có milestone nào (sẽ dùng mặc định)');
        } else {
            console.log(`   📌 Có ${milestones.length} milestone(s):`);
            milestones.forEach((m: any, i: number) => {
                const hasAll = REQUIRED_FIELDS.milestone.every(f => m[f] !== undefined && m[f] !== '');
                const missing = REQUIRED_FIELDS.milestone.filter(f => !m[f]);
                if (hasAll) {
                    console.log(`      ${i + 1}. ✅ "${m.title}" (${m.date})`);
                } else {
                    console.log(`      ${i + 1}. ⚠️  "${m.title || 'Không tên'}" - thiếu: ${missing.join(', ')}`);
                }
            });
        }

        // === SUMMARY ===
        console.log('\n' + '='.repeat(70));
        console.log('\n📊 TÓM TẮT:\n');

        if (missingDetails.length > 0) {
            console.log(`   ⚠️  Các trường trong "details" chưa có trên Supabase:`);
            missingDetails.forEach(f => console.log(`      - ${f}`));
            console.log('\n   📌 Các trường này sẽ dùng GIÁ TRỊ MẶC ĐỊNH từ App.tsx');
            console.log('   📌 Khi admin chỉnh sửa & lưu, chúng sẽ được tạo trên Supabase');
        } else {
            console.log('   🎉 Tất cả các trường đều đã có trên Supabase!');
        }

        console.log('\n' + '='.repeat(70) + '\n');

    } catch (err: any) {
        console.log('❌ Lỗi:', err.message);
    }
}

checkAllFields().catch(console.error);
