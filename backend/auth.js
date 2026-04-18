// backend/auth.js - Fixed with better error handling
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Check if environment variables are loaded
let supabaseUrl = process.env.SUPABASE_URL;
let supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Clean the values (remove any whitespace or invisible characters)
if (supabaseUrl) {
    supabaseUrl = supabaseUrl.trim();
}
if (supabaseAnonKey) {
    supabaseAnonKey = supabaseAnonKey.trim();
}

console.log('\n🔧 Initializing Supabase Client...');
console.log('SUPABASE_URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ MISSING');
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Present' : '❌ MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ ERROR: Missing Supabase credentials in .env file');
    console.error('Please check your backend/.env file');
    throw new Error('Supabase credentials are required. Check your .env file.');
}

// Validate URL format
if (!supabaseUrl.startsWith('https://')) {
    console.error('❌ ERROR: SUPABASE_URL must start with https://');
    console.error('Current value:', supabaseUrl);
    throw new Error('Invalid SUPABASE_URL format');
}

// Create Supabase client with explicit options
let supabase;
try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        },
        db: {
            schema: 'public'
        }
    });
    console.log('✅ Supabase client initialized successfully\n');
} catch (error) {
    console.error('❌ Failed to create Supabase client:', error.message);
    throw error;
}

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        
        console.log('📝 Signup attempt for:', email);
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    role: 'voter'
                }
            }
        });
        
        if (error) throw error;
        
        // Create profile
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: data.user.id,
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    role: 'voter'
                }]);
            
            if (profileError) {
                console.error('Profile creation error:', profileError.message);
                // Don't throw, user still created
            }
        }
        
        console.log('✅ Signup successful for:', email);
        res.json({ success: true, user: data.user });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Sign In
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('🔐 Signin attempt for:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError.message);
        }
        
        console.log('✅ Signin successful for:', email);
        res.json({ 
            success: true, 
            user: { ...data.user, profile: profile || null },
            session: data.session 
        });
    } catch (error) {
        console.error('Signin error:', error.message);
        res.status(401).json({ error: error.message });
    }
});

// Sign Out
router.post('/signout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Signout error:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Get Current User
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) throw error;
        
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        res.json({ user: { ...user, profile } });
    } catch (error) {
        console.error('Get user error:', error.message);
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;