/**
 * Script kiem tra du lieu Supabase (ASCII only output)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhnarfrkgnotuifqnvzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobmFyZnJrZ25vdHVpZnFudnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNjgxMjgsImV4cCI6MjA4Mjg0NDEyOH0.v28zuHRzMgTjjFaCuIBmpRRzpowk6y4lvbJERX8v3CE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkFields() {
    console.log('=== SUPABASE FIELD CHECK ===\n');

    const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', 'trang-chien-2026')
        .single();

    if (error) {
        console.log('ERROR:', error.message);
        return;
    }

    if (!data) {
        console.log('NO DATA FOUND');
        return;
    }

    console.log('RECORD FOUND: ' + data.slug);
    console.log('\n--- TOP LEVEL FIELDS ---');
    console.log('id:', data.id ? 'OK' : 'MISSING');
    console.log('slug:', data.slug ? 'OK' : 'MISSING');
    console.log('hero_image:', data.hero_image ? 'OK' : 'MISSING/EMPTY');
    console.log('music_url:', data.music_url ? 'OK' : 'MISSING/EMPTY');
    console.log('album_urls:', Array.isArray(data.album_urls) && data.album_urls.length > 0 ? `OK (${data.album_urls.length} items)` : 'EMPTY');
    console.log('qr_groom:', data.qr_groom ? 'OK' : 'MISSING/EMPTY');
    console.log('qr_bride:', data.qr_bride ? 'OK' : 'MISSING/EMPTY');
    console.log('details:', data.details ? 'OK' : 'MISSING');

    const d = data.details || {};
    console.log('\n--- DETAILS FIELDS ---');
    console.log('groom_name:', d.groom_name ? 'OK' : 'MISSING (use default)');
    console.log('bride_name:', d.bride_name ? 'OK' : 'MISSING (use default)');
    console.log('event_date:', d.event_date ? 'OK' : 'MISSING (use default)');
    console.log('invitation_text:', d.invitation_text ? 'OK' : 'MISSING (use default)');
    console.log('initials:', d.initials ? 'OK' : 'MISSING (use default)');
    console.log('invitation_quote:', d.invitation_quote ? 'OK' : 'MISSING (use default)');
    console.log('milestones:', Array.isArray(d.milestones) ? `OK (${d.milestones.length} items)` : 'MISSING (use default)');
    console.log('vuQuy:', d.vuQuy ? 'OK' : 'MISSING (use default)');
    console.log('thanhHon:', d.thanhHon ? 'OK' : 'MISSING (use default)');

    console.log('\n--- SUMMARY ---');
    const missing = [];
    if (!d.invitation_text) missing.push('invitation_text');
    if (!d.initials) missing.push('initials');
    if (!d.invitation_quote) missing.push('invitation_quote');

    if (missing.length > 0) {
        console.log('Fields using DEFAULT values:', missing.join(', '));
        console.log('NOTE: These will be saved to Supabase when admin edits and saves.');
    } else {
        console.log('All fields are present in Supabase!');
    }

    console.log('\n=== END CHECK ===');
}

checkFields().catch(e => console.log('Error:', e.message));
