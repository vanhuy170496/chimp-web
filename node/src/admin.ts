import {compileCalldata} from "starknet/dist/utils/stark";
import {connectWallet, NFT_CONTRACT_ADDRESS, EHT_CONTRACT_ADDRESS} from "./helper";
import {uint256} from "starknet";
import {IStarknetWindowObject} from "get-starknet-wallet";

// Admin - OG MINT
document.getElementById("open-og-mint")?.addEventListener("click", async () => {
	const starknet = await connectWallet();

	await starknet.account.execute([
		{
			contractAddress: NFT_CONTRACT_ADDRESS,
			entrypoint: "setOpenOgMint",
			calldata: ["1", "0"],
		},
	]);
});
// Admin - Set OG Wallets
document.getElementById("set-og-wallet")?.addEventListener("click", async () => {
	const starknet = await connectWallet();

	// @ts-ignore
	const wallets = ((document.getElementById("set-og-wallet-values")?.value as string) || "")
		.split("\n")
		.map((wallet) => wallet.trim())
		.filter((wallet) => !!wallet);

	await starknet.account.execute(
		wallets.map((wallet) => ({
			contractAddress: NFT_CONTRACT_ADDRESS,
			entrypoint: "setOgWhitelistWallets",
			calldata: [wallet, "1", "0"],
		}))
	);
});

// Admin - Whitelist MINT
document.getElementById("open-whitelist-mint")?.addEventListener("click", async () => {
	const starknet = await connectWallet();

	await starknet.account.execute([
		{
			contractAddress: NFT_CONTRACT_ADDRESS,
			entrypoint: "setOpenWhitelistMint",
			calldata: ["1", "0"],
		},
	]);
});
// Admin - Set Whitelist Wallets
document.getElementById("set-whitelist-wallet")?.addEventListener("click", async () => {
	const starknet = await connectWallet();

	// @ts-ignore
	const wallets = ((document.getElementById("set-whitelist-wallet-values")?.value as string) || "")
		.split("\n")
		.map((wallet) => wallet.trim())
		.filter((wallet) => !!wallet);

	await starknet.account.execute(
		wallets.map((wallet) => ({
			contractAddress: NFT_CONTRACT_ADDRESS,
			entrypoint: "setWhitelistWhitelistWallets",
			calldata: [wallet, "1", "0"],
		}))
	);
});
// Admin Public mint
document.getElementById("open-public-mint")?.addEventListener("click", async () => {
	const starknet = await connectWallet();

	await starknet.account.execute([
		{
			contractAddress: NFT_CONTRACT_ADDRESS,
			entrypoint: "setOpenPublicMint",
			calldata: ["1", "0"],
		},
	]);
});
// Admin Withdraws
document.getElementById("withdraws")?.addEventListener("click", async () => {
	const starknet = await connectWallet();

	const data = await starknet.account.callContract({
		contractAddress: EHT_CONTRACT_ADDRESS,
		entrypoint: "balanceOf",
		calldata: compileCalldata({account: NFT_CONTRACT_ADDRESS}),
	});
	const balance = data.result[0];

	await starknet.account.execute([
		{
			contractAddress: NFT_CONTRACT_ADDRESS,
			entrypoint: "approveEth",
			calldata: [NFT_CONTRACT_ADDRESS, balance, 0],
		},
		{
			contractAddress: NFT_CONTRACT_ADDRESS,
			entrypoint: "withdrawFees",
			calldata: [starknet.account.address, balance, 0],
		},
	]);
});

// Get balances
document.getElementById("get-balance")?.addEventListener("click", async () => {
	const starknet = await connectWallet();

	// @ts-ignore
	const wallets = ((document.getElementById("get-balances-values")?.value as string) || "")
		.split("\n")
		.map((wallet) => wallet.trim())
		.filter((wallet) => !!wallet);

	const infos = await Promise.all(wallets.map((wallet) => getWalletBalance(starknet, wallet)));
	const valueElement = document.getElementById("balances-values");
	if (!valueElement) return;
	valueElement.outerHTML = infos.map((info) => `${info.account} ---- ${info.balance}`).join("<br />");
});

const getWalletBalance = async (starknet: IStarknetWindowObject, account: string) => {
	try {
		const {result} = await starknet.account.callContract({
			contractAddress: EHT_CONTRACT_ADDRESS,
			entrypoint: "balanceOf",
			calldata: compileCalldata({account}),
		});
		let [_balance] = compileCalldata({ok: result[0]});
		_balance = _balance.slice(0, Math.max(_balance.length - 14, 0));
		const balance = parseInt(_balance || "0") / 10000;
		return {account, balance};
	} catch (error) {
		return {account, balance: -1};
	}
};
