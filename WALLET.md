---
name: smart-wallet
description: Manage a crypto wallet and execute trades using Foundry 'cast'.
metadata: { "zeptoclaw": { "emoji": "💰", "requires": { "bins": ["cast", "jq"] } } }
---

# Smart Wallet Skill

Allows ZeptoClaw to manage a crypto wallet on Base.

## Prerequisites
- `foundry` installed (for `cast` binary).
- `ETH_RPC_URL` environment variable set (e.g., Alchemy/Infura for Base).
- `PRIVATE_KEY` environment variable set (for signing).

## Wallet Config

### Check Balance (ETH)
```bash
cast balance --ether $ETH_FROM
```

### Check Token Balance (USDC)
```bash
cast call 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 "balanceOf(address)(uint256)" $ETH_FROM --rpc-url $ETH_RPC_URL | cast to-dec 6
```

## Trading (Base Mainnet)

### Swap ETH for USDC (via Uniswap V3 Router)
Target: `0x2626664c2603336E57B271c5C0b26F421741e481` (Uniswap V3 Router)

```bash
# SWAP_EXACT_INPUT_SINGLE
# params: (tokenIn, tokenOut, fee, recipient, deadline, amountIn, amountOutMinimum, sqrtPriceLimitX96)
# tokenIn: WETH (0x4200000000000000000000000000000000000006)
# tokenOut: USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
# fee: 500 (0.05%)

cast send 0x2626664c2603336E57B271c5C0b26F421741e481 \
  "exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))" \
  "(0x4200000000000000000000000000000000000006, 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, 500, $ETH_FROM, $DEADLINE, $AMOUNT_IN_WEI, 0, 0)" \
  --value $AMOUNT_ETH \
  --private-key $PRIVATE_KEY \
  --rpc-url $ETH_RPC_URL
```

### Send ETH
```bash
cast send --private-key $PRIVATE_KEY $RECIPIENT_ADDRESS --value $AMOUNT_ETH --rpc-url $ETH_RPC_URL
```
