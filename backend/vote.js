const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Cast vote
router.post('/cast', async (req, res) => {
    try {
        const { electionId, candidateId, userId, transactionHash } = req.body;
        
        // Check if already voted
        const { data: existingVote } = await supabase
            .from('votes')
            .select('*')
            .eq('election_id', electionId)
            .eq('user_id', userId)
            .single();
        
        if (existingVote) {
            return res.status(400).json({ error: 'Already voted' });
        }
        
        // Generate blockchain-style hash (for future integration)
        const voteHash = require('crypto')
            .createHash('sha256')
            .update(`${userId}-${electionId}-${candidateId}-${Date.now()}`)
            .digest('hex');
        
        // Record vote
        const { data: vote, error } = await supabase
            .from('votes')
            .insert([{
                election_id: electionId,
                candidate_id: candidateId,
                user_id: userId,
                transaction_hash: transactionHash || voteHash,
                vote_hash: voteHash
            }])
            .select();
        
        if (error) throw error;
        
        // Update candidate vote count
        await supabase.rpc('increment_vote_count', { 
            candidate_id: candidateId 
        });
        
        // Log activity
        await supabase
            .from('activity_logs')
            .insert([{
                user_id: userId,
                action: 'Voted',
                details: { electionId, candidateId }
            }]);
        
        res.json({ 
            success: true, 
            vote: vote[0],
            verificationHash: voteHash
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get results
router.get('/results/:electionId', async (req, res) => {
    try {
        const { electionId } = req.params;
        
        const { data: candidates, error } = await supabase
            .from('candidates')
            .select('*')
            .eq('election_id', electionId)
            .order('votes', { ascending: false });
        
        if (error) throw error;
        
        const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
        
        res.json({
            candidates,
            totalVotes,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check if user has voted
router.get('/has-voted/:electionId/:userId', async (req, res) => {
    try {
        const { electionId, userId } = req.params;
        
        const { data, error } = await supabase
            .from('votes')
            .select('*')
            .eq('election_id', electionId)
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        res.json({ hasVoted: !!data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;