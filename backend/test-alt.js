// backend/test-alt.js - Alternative test without creating client directly
require('dotenv').config();

console.log('\n📋 Environment Variable Check:\n');

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_ANON_KEY?.trim();

console.log('URL:', supabaseUrl);
console.log('URL length:', supabaseUrl?.length);
console.log('Key exists:', !!supabaseKey);

// Test 1: Check if we can create a URL object
try {
    const url = new URL(supabaseUrl);
    console.log('✅ URL object created successfully');
    console.log('   Hostname:', url.hostname);
} catch (e) {
    console.log('❌ Invalid URL:', e.message);
}

// Test 2: Try requiring Supabase differently
try {
    console.log('\n📦 Attempting to load Supabase...');
    const { createClient } = require('@supabase/supabase-js');
    console.log('✅ Supabase module loaded');
    
    // Create client with explicit string conversion
    const client = createClient(String(supabaseUrl), String(supabaseKey));
    console.log('✅ Supabase client created successfully!');
    
    // Test connection
    client.from('profiles').select('*', { count: 'exact', head: true })
        .then(({ error }) => {
            if (error) {
                console.log('⚠️ Connection test failed:', error.message);
            } else {
                console.log('✅ Connection test successful!');
            }
        })
        .catch(err => {
            console.log('⚠️ Connection test error:', err.message);
        });
        
} catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Stack:', error.stack);
}

console.log('\n');