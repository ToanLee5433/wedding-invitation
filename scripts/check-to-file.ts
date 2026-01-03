import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabase = createClient(
    'https://dhnarfrkgnotuifqnvzo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobmFyZnJrZ25vdHVpZnFudnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNjgxMjgsImV4cCI6MjA4Mjg0NDEyOH0.v28zuHRzMgTjjFaCuIBmpRRzpowk6y4lvbJERX8v3CE'
);

async function main() {
    const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', 'trang-chien-2026')
        .single();

    if (error) {
        fs.writeFileSync('supabase-check-result.json', JSON.stringify({ error: error.message }, null, 2));
        console.log('Error - check supabase-check-result.json');
        return;
    }

    const d = data?.details || {};
    const result = {
        top_level: {
            id: data.id ? 'OK' : 'MISSING',
            slug: data.slug || 'MISSING',
            hero_image: data.hero_image ? 'OK' : 'MISSING',
            music_url: data.music_url ? 'OK' : 'MISSING',
            album_urls: Array.isArray(data.album_urls) ? `${data.album_urls.length} items` : 'MISSING',
            qr_groom: data.qr_groom ? 'OK' : 'MISSING',
            qr_bride: data.qr_bride ? 'OK' : 'MISSING',
        },
        details: {
            groom_name: d.groom_name || 'MISSING (default used)',
            bride_name: d.bride_name || 'MISSING (default used)',
            event_date: d.event_date || 'MISSING (default used)',
            invitation_text: d.invitation_text ? 'OK' : 'MISSING (default used)',
            initials: d.initials || 'MISSING (default used)',
            invitation_quote: d.invitation_quote ? 'OK' : 'MISSING (default used)',
            milestones: Array.isArray(d.milestones) ? `${d.milestones.length} items` : 'MISSING (default used)',
            vuQuy: d.vuQuy ? 'OK' : 'MISSING (default used)',
            thanhHon: d.thanhHon ? 'OK' : 'MISSING (default used)'
        },
        raw_details: d
    };

    fs.writeFileSync('supabase-check-result.json', JSON.stringify(result, null, 2));
    console.log('Done - check supabase-check-result.json');
}

main();
