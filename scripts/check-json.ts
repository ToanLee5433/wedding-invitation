import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://dhnarfrkgnotuifqnvzo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobmFyZnJrZ25vdHVpZnFudnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNjgxMjgsImV4cCI6MjA4Mjg0NDEyOH0.v28zuHRzMgTjjFaCuIBmpRRzpowk6y4lvbJERX8v3CE'
);

async function main() {
    const { data, error } = await supabase
        .from('weddings')
        .select('details')
        .eq('slug', 'trang-chien-2026')
        .single();

    if (error) {
        console.log(JSON.stringify({ error: error.message }));
        return;
    }

    const d = data?.details || {};
    const result = {
        groom_name: d.groom_name ? 'HAS_VALUE' : 'MISSING',
        bride_name: d.bride_name ? 'HAS_VALUE' : 'MISSING',
        event_date: d.event_date ? 'HAS_VALUE' : 'MISSING',
        invitation_text: d.invitation_text ? 'HAS_VALUE' : 'MISSING',
        initials: d.initials ? 'HAS_VALUE' : 'MISSING',
        invitation_quote: d.invitation_quote ? 'HAS_VALUE' : 'MISSING',
        milestones_count: Array.isArray(d.milestones) ? d.milestones.length : 0,
        vuQuy: d.vuQuy ? 'HAS_VALUE' : 'MISSING',
        thanhHon: d.thanhHon ? 'HAS_VALUE' : 'MISSING'
    };

    console.log(JSON.stringify(result, null, 2));
}

main();
