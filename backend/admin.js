const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware to verify admin
async function verifyAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: 'Unauthorized' });
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    
    if (profile?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.user = user;
    next();
}

// Get dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
    try {
        const { data: voters } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' });
        
        const { data: votes } = await supabase
            .from('votes')
            .select('*', { count: 'exact' });
        
        const { data: candidates } = await supabase
            .from('candidates')
            .select('*')
            .order('votes', { ascending: false });
        
        const { data: elections } = await supabase
            .from('elections')
            .select('*')
            .single();
        
        res.json({
            totalVoters: voters?.length || 0,
            votesCast: votes?.length || 0,
            turnout: voters?.length ? ((votes?.length / voters.length) * 100).toFixed(1) : 0,
            leadingCandidate: candidates?.[0],
            electionStatus: elections?.status
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add candidate
router.post('/candidates', verifyAdmin, async (req, res) => {
    try {
        const { electionId, name, party, description, icon } = req.body;
        
        const { data, error } = await supabase
            .from('candidates')
            .insert([{
                election_id: electionId,
                name,
                party,
                description,
                icon: icon || 'fas fa-user',
                votes: 0
            }])
            .select();
        
        if (error) throw error;
        
        // Log activity
        await supabase
            .from('activity_logs')
            .insert([{
                user_id: req.user.id,
                action: 'Added candidate',
                details: { name, party }
            }]);
        
        res.json({ success: true, candidate: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update election status
router.put('/election/:electionId/status', verifyAdmin, async (req, res) => {
    try {
        const { electionId } = req.params;
        const { status } = req.body;
        
        const { data, error } = await supabase
            .from('elections')
            .update({ status })
            .eq('id', electionId)
            .select();
        
        if (error) throw error;
        
        await supabase
            .from('activity_logs')
            .insert([{
                user_id: req.user.id,
                action: `Changed election status to ${status}`,
                details: { electionId }
            }]);
        
        res.json({ success: true, election: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get activity logs
router.get('/activity-logs', verifyAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('activity_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (error) throw error;
        res.json({ logs: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;