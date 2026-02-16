import { AgentKit, CdpSmartWalletProvider, walletActionProvider, erc20ActionProvider, cdpApiActionProvider, cdpSmartWalletActionProvider } from "@coinbase/agentkit";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const WALLET_FILE = "wallet_data.json";

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command) {
        console.log("Usage: node index.ts <command> [args...]");
        console.log("Commands: address, balance, transfer, trade");
        return;
    }

    // 1. Initialize Wallet
    let walletData: any = null;
    if (fs.existsSync(WALLET_FILE)) {
        walletData = JSON.parse(fs.readFileSync(WALLET_FILE, "utf8"));
    }

    const walletProvider = await CdpSmartWalletProvider.configureWithWallet({
        apiKeyId: process.env.CDP_API_KEY_ID,
        apiKeySecret: process.env.CDP_API_KEY_SECRET?.replace(/\\n/g, "\n"),
        networkId: process.env.NETWORK_ID || "base-mainnet",
        address: walletData?.address,
        owner: walletData?.ownerAddress,
    });

    // Save wallet if new
    if (!walletData) {
        const exported = await walletProvider.exportWallet();
        fs.writeFileSync(WALLET_FILE, JSON.stringify(exported));
        console.error("Created new wallet: " + exported.address);
    }

    const agent = await AgentKit.from({
        walletProvider,
        actionProviders: [
            walletActionProvider(),
            erc20ActionProvider(),
            cdpApiActionProvider(), // Faucet
            cdpSmartWalletActionProvider(), // Swaps
        ],
    });

    try {
        switch (command) {
            case "address":
                console.log(await walletProvider.getAddress());
                break;

            case "balance":
                const bal = await walletProvider.getBalance();
                console.log(bal.toString());
                break;

            case "transfer":
                // node index.ts transfer 0x123... 0.01 eth
                const [_, to, amount, assetId] = args;
                if (!to || !amount) throw new Error("Missing args");
                const tx = await walletProvider.transfer(to, amount, assetId || "eth");
                console.log(tx);
                break;

            case "trade":
                // node index.ts trade 0.001 eth usdc
                const [_t, tradeAmount, fromAsset, toAsset] = args;
                console.error(`Swapping ${tradeAmount} ${fromAsset} -> ${toAsset}...`);
                const swap = await walletProvider.createTrade({
                    amount: Number(tradeAmount),
                    fromAssetId: fromAsset,
                    toAssetId: toAsset
                });
                await swap.wait();
                console.log(swap.getTransactionHash());
                break;

            case "faucet":
                const faucetTx = await walletProvider.requestFaucet(args[1] || "eth");
                console.log(faucetTx);
                break;

            default:
                console.error("Unknown command");
        }
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

main();
