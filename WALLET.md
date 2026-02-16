---
name: smart-wallet
description: Manage a Coinbase Smart Wallet (CDP) for gas-sponsored trades.
metadata: { "zeptoclaw": { "emoji": "�️", "requires": { "bins": ["node", "npm"] } } }
---

# Smart Wallet Skill (Coinbase CDP)

Uses the official Coinbase AgentKit to provide a Smart Wallet with gas sponsorship and passkey support.

## Setup
1.  Navigate to skill directory: `cd ~/.zeptoclaw/skills/smart-wallet/cdp-wrapper`
2.  Install deps: `npm install`
3.  Set Env Vars: `CDP_API_KEY_ID` and `CDP_API_KEY_SECRET`.

## Wallet Config

### Check Address
```bash
node cdp-wrapper/index.ts address
```

### Check Balance
```bash
node cdp-wrapper/index.ts balance
```

## Trading (Base Mainnet)

### Swap ETH for USDC
```bash
# Swaps 0.0001 ETH to USDC
node cdp-wrapper/index.ts trade 0.0001 eth usdc
```

### Send ETH
```bash
node cdp-wrapper/index.ts transfer $RECIPIENT 0.001 eth
```
