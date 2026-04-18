// backend/test-env.js - Fixed version
require('dotenv').config();

console.log('\n📋 Environment Variable Check:\n');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL || '❌ MISSING');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Present' : '❌ MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Present' : '⚠️ Optional');
console.log('PORT:', process.env.PORT || '3000 (default)');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Present' : '⚠️ Optional');
console.log('BLOCKCHAIN_ENABLED:', process.env.BLOCKCHAIN_ENABLED || 'false (default)');

// Test Supabase connection with error handling
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    try {
        const { createClient } = require('@supabase/supabase-js');
        
        // Clean the URL - remove any invisible characters
        const supabaseUrl = process.env.SUPABASE_URL.trim();
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY.trim();
        
        console.log('\n🔌 Testing Supabase connection...');
        console.log('Cleaned URL:', supabaseUrl);
        
        // Validate URL format
        if (!supabaseUrl.startsWith('https://')) {
            console.log('❌ Invalid URL: Must start with https://');
            process.exit(1);
        }
        
        // Create client with explicit options
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        });
        
        // Test connection with a simple query
        supabase.from('profiles').select('*', { count: 'exact', head: true })
            .then(({ error, count }) => {
                if (error) {
                    console.log('❌ Supabase connection failed:', error.message);
                    if (error.message.includes('relation') && error.message.includes('does not exist')) {
                        console.log('   ⚠️ The "profiles" table does not exist yet.');
                        console.log('   📝 Run the SQL schema in Supabase SQL editor first.');
                    } else if (error.message.includes('Invalid API key')) {
                        console.log('   ⚠️ Invalid API key. Check your SUPABASE_ANON_KEY.');
                    } else if (error.message.includes('JWT')) {
                        console.log('   ⚠️ Authentication issue. Check your keys.');
                    }
                } else {
                    console.log('✅ Supabase connection successful!');
                }
            })
            .catch(err => {
                console.log('❌ Connection error:', err.message);
            });
            
    } catch (error) {
        console.log('❌ Error creating Supabase client:', error.message);
        console.log('   Make sure @supabase/supabase-js is installed');
    }
} else {
    console.log('\n❌ Cannot test Supabase: Missing credentials');
    console.log('   Make sure your .env file has:');
    console.log('   SUPABASE_URL=your_url');
    console.log('   SUPABASE_ANON_KEY=your_key');
}

console.log('\n💡 Next steps:');
console.log('1. If tables are missing, run the SQL schema in Supabase');
console.log('2. Then run: npm run dev\n');