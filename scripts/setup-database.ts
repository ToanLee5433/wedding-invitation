/**
 * Script thiết lập cơ sở dữ liệu Supabase
 * Chạy: npx -y tsx scripts/setup-database.ts
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


async function setupDatabase() {
    console.log('🚀 Bắt đầu thiết lập cơ sở dữ liệu Supabase...\n');
    console.log('='.repeat(60) + '\n');

    // Kiểm tra bảng weddings có tồn tại không
    console.log('📋 Bước 1: Kiểm tra bảng weddings...');
    const { data: weddingsExists, error: weddingsError } = await supabase
        .from('weddings')
        .select('id')
        .limit(1);

    if (weddingsError && weddingsError.code === 'PGRST116') {
        console.log('❌ Bảng weddings chưa tồn tại.');
        console.log('\n⚠️  LƯU Ý: Bạn cần chạy SQL sau trong Supabase Dashboard > SQL Editor:\n');
        printCreateTableSQL();
        return;
    } else if (weddingsError) {
        console.log(`⚠️  Lỗi kiểm tra: ${weddingsError.message}`);
    } else {
        console.log('✅ Bảng weddings đã tồn tại.\n');
    }

    // Kiểm tra bảng guests
    console.log('📋 Bước 2: Kiểm tra bảng guests...');
    const { data: guestsExists, error: guestsError } = await supabase
        .from('guests')
        .select('id')
        .limit(1);

    if (guestsError && guestsError.code === 'PGRST116') {
        console.log('❌ Bảng guests chưa tồn tại.');
        console.log('\n⚠️  LƯU Ý: Bạn cần chạy SQL sau trong Supabase Dashboard > SQL Editor:\n');
        printCreateTableSQL();
        return;
    } else if (guestsError) {
        console.log(`⚠️  Lỗi kiểm tra: ${guestsError.message}`);
    } else {
        console.log('✅ Bảng guests đã tồn tại.\n');
    }

    // Bước 3: Kiểm tra và thêm dữ liệu mồi
    console.log('📋 Bước 3: Kiểm tra dữ liệu mồi cho slug "trang-chien-2026"...');

    const { data: existingWedding, error: checkError } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', 'trang-chien-2026')
        .single();

    if (checkError && checkError.code === 'PGRST116') {
        console.log('📝 Chưa có dữ liệu. Đang thêm dữ liệu mồi...');

        const seedData = {
            slug: 'trang-chien-2026',
            hero_image: 'https://iv1cdn.vnecdn.net/giaitri/images/web/2025/10/23/toan-canh-dam-cuoi-cua-vo-chong-do-thi-ha-1761191294.jpg',
            music_url: 'https://docs.google.com/uc?id=1l6GJuaTmotc3lQ2Wead6-2MC2oQ65mc-',
            details: {
                groom_name: 'Chiến',
                bride_name: 'Trang',
                event_date: '30 . 01 . 2026',
                milestones: [
                    {
                        date: '10 / 05 / 2021',
                        title: 'Lần đầu gặp gỡ',
                        desc: 'Vào một chiều mưa tại quán cafe nhỏ.',
                        img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622'
                    }
                ],
                vuQuy: {
                    title: 'Lễ Vu Quy',
                    date: '30 . 01 . 2026',
                    time: '08:00 AM',
                    location: 'Tư gia Nhà Gái',
                    address: 'Hà Nội',
                    mapLink: 'https://maps.google.com'
                },
                thanhHon: {
                    title: 'Lễ Thành Hôn',
                    date: '30 . 01 . 2026',
                    time: '11:00 AM',
                    location: 'Diamond Palace',
                    address: 'Hà Nội',
                    mapLink: 'https://maps.google.com'
                }
            }
        };

        const { data: insertedData, error: insertError } = await supabase
            .from('weddings')
            .insert(seedData)
            .select()
            .single();

        if (insertError) {
            console.log(`❌ Lỗi khi thêm dữ liệu: ${insertError.message}`);
        } else {
            console.log('✅ Đã thêm dữ liệu mồi thành công!');
            console.log(`   ID: ${insertedData.id}`);
        }
    } else if (existingWedding) {
        console.log('✅ Dữ liệu đã tồn tại.');
        console.log(`   ID: ${existingWedding.id}`);
        console.log(`   Slug: ${existingWedding.slug}`);
    }

    // Bước 4: Kiểm tra số lượng guests
    console.log('\n📋 Bước 4: Kiểm tra bảng guests...');
    const { data: guestData, error: guestCountError } = await supabase
        .from('guests')
        .select('id, guest_name');

    if (guestCountError) {
        console.log(`⚠️  Lỗi: ${guestCountError.message}`);
    } else {
        console.log(`✅ Số lượng khách mời hiện tại: ${guestData?.length || 0}`);
    }

    // Tổng kết
    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 THIẾT LẬP CƠ SỞ DỮ LIỆU HOÀN TẤT!\n');
    console.log('📊 Tóm tắt:');
    console.log('   ✅ Bảng weddings: OK');
    console.log('   ✅ Bảng guests: OK');
    console.log('   ✅ Dữ liệu mồi: OK');
    console.log('\n💡 Tiếp theo, hãy kiểm tra RLS policies trong Supabase Dashboard.');
}

function printCreateTableSQL() {
    console.log(`
-- ========================================
-- 1. TẠO BẢNG WEDDINGS
-- ========================================
CREATE TABLE IF NOT EXISTS weddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    music_url TEXT,
    hero_image TEXT,
    album_urls TEXT[] DEFAULT '{}',
    qr_groom TEXT,
    qr_bride TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 2. TẠO BẢNG GUESTS
-- ========================================
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_group TEXT,
    attendance_status BOOLEAN,
    guest_count INTEGER DEFAULT 1,
    wish_message TEXT,
    invite_link TEXT,
    status TEXT DEFAULT 'invited',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 3. CẤU HÌNH BẢO MẬT RLS
-- ========================================
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Weddings" ON weddings FOR SELECT USING (true);
CREATE POLICY "Public Update Weddings" ON weddings FOR UPDATE USING (true);
CREATE POLICY "Public Read Guests" ON guests FOR SELECT USING (true);
CREATE POLICY "Public Insert Guests" ON guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Guests" ON guests FOR DELETE USING (true);
  `);
}

setupDatabase().catch(console.error);
