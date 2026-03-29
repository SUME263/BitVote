Anonymous, blockchain-inspired voting. No accounts. No tracking. Every vote is a cryptographically chained block.

## How it works

1. Admin creates a poll and shares the voting link
2. Voter opens the link — a one-time token is issued to their browser
3. Voter selects a choice — the token hash + choice is committed as a block on the chain
4. The chain is publicly auditable; no identity is ever stored

## Anti-fraud layers

| Layer | What it stops |
|---|---|
| SHA-256 token hashing | Token reuse — the same token can never vote twice |
| Rate limit: 1 token per IP per poll / 24h | Script loops — a bot gets one token from one IP |
| Rate limit: 5 vote attempts per IP per poll / 24h | Retry flooding |
| Rate limit: 10 admin logins per IP / 15min | Passphrase brute-forcing |
| Rate limit: 200 global API calls per IP / 15min | General hammering |
