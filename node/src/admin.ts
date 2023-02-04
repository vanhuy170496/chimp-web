import {compileCalldata} from "starknet/dist/utils/stark";
import {connectWallet, NFT_CONTRACT_ADDRESS, EHT_CONTRACT_ADDRESS} from "./helper";
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

// (async () => {
// 	const starknet = await connectWallet();

// 	const items = [
// 		// {address: "0x023b8A741E170A575fB6F0FF35D17C042f94cDCd5fd6Fd3E1CF9AF6700A47F45", count: 4},
// 		// {address: "0x03AC09EcF9F56639Aa8ccaDC937aF6eC6361f34cFfdf90097b4132F0A903Ae54", count: 10},
// 		// {address: "0x06f26915DD17A45025B57c34bFd25960d4138639056252E5528b9294B3c397C4", count: 2},
// 		// {address: "0x0194dC322aa505b03710972bD49473e36Eef6D778b4a4E4F948f194b18e57E71", count: 2},
// 		// {address: "0x05b404479793130bFbEcBCE679f66331424E55ff4290Cf2dbd717751d9979BDC", count: 2},
// 		// {address: "0x045D75C234dE6b188DECC1347cdfe52937ecB7894010294D49b746df7920F92E", count: 5},
// 		// {address: "0x05e8b0Ec8628A44897Eaa4efa33Ef887D5b712499D22D48B86ED7eE25B5c6Dc5", count: 10},
// 		{address: "0x013eC0643f0A1FEAe272C37A593E7c75e3834A0BEDC8bE7F133e462eaaB135cF", count: 10},
// 		{address: "0x03A48a4c1320Ce8b9EFd9b600ab6c61180717f08660f5609B105F7636CCdE215", count: 2},
// 		{address: "0x03aBEe80Bd14b329871E3D8deea7fDd4D3D9A84FaFFa19B7af22f5cf4cb46F63", count: 5},
// 		{address: "0x06BF090a929097BAE26Baf48C418A68718A78a66F40Aa9D419a2c49fEa1Ec44c", count: 5},
// 		{address: "0x023d798F965561413821c0B6E4B9C31dDd45fDEa0CCB25E80A4dA3dF7CE4C527", count: 5},
// 		{address: "0x026e7AEd5DB96A85Ec00000c6B59a09d343D5bc831f46c7f742e8370E28507E8", count: 5},
// 		{address: "0x00194fcaDee77F41331B2375e30522CB56D1dC03C7f533A534BcA603d4cE3eBA", count: 10},
// 	];
// 	const addresses: string[] = [];
// 	items.forEach((item) => {
// 		addresses.push(...new Array(item.count).fill(item.address));
// 	});

// 	// 20000000000000000
// 	await starknet.account.execute([
// 		// {
// 		// 	contractAddress: NFT_CONTRACT_ADDRESS,
// 		// 	entrypoint: "setPublicMintFee",
// 		// 	calldata: ["0", "0"],
// 		// },
// 		{
// 			contractAddress: NFT_CONTRACT_ADDRESS,
// 			entrypoint: "setOpenPublicMint",
// 			calldata: ["1", "0"],
// 		},
// 		...addresses.map((address) => ({
// 			contractAddress: NFT_CONTRACT_ADDRESS,
// 			entrypoint: "mint",
// 			calldata: [address],
// 		})),
// 		{
// 			contractAddress: NFT_CONTRACT_ADDRESS,
// 			entrypoint: "setOpenPublicMint",
// 			calldata: ["0", "0"],
// 		},
// 	]);
// })();

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

// Get balances
document.getElementById("holders")?.addEventListener("click", async () => {
	//@ts-ignore
	document.getElementById("holders").innerHTML = "Get Holders (Loading...)";
	try {
		const starknet = await connectWallet();

		const _holders: string[] = [];

		const max = 220;

		for (let step = 0; step < Math.floor((max - 1) / 10) + 1; step++) {
			const size = Math.min(10, max - step * 10);
			_holders.push(
				...(await Promise.all(
					new Array(size).fill(1).map(async (_, index) => {
						const tokenId = step * 10 + index + 1 + "";
						const {result} = await starknet.account.callContract({
							contractAddress: NFT_CONTRACT_ADDRESS,
							entrypoint: "ownerOf",
							calldata: compileCalldata({tokenId, x: "0"}),
						});
						return result[0];
					})
				))
			);
			if (step % 10 === 9) await new Promise((resolve) => setTimeout(resolve, 60000));
			else await new Promise((resolve) => setTimeout(resolve, 300));
		}

		const mapHolders: Record<string, number> = {};
		_holders.map((holder) => {
			mapHolders[holder] = mapHolders[holder] || 0;
			mapHolders[holder]++;
		});

		const holders = Object.keys(mapHolders).map((holder) => {
			return {holder, count: mapHolders[holder]};
		});
		holders.sort((a, b) => b.count - a.count);

		const outHolders = document.getElementById("out-holders");
		if (outHolders) outHolders.innerHTML = holders.map((holder) => `${holder.holder} -- ${holder.count}`).join("<br />");
	} catch (error) {
		alert("Fail");
	}
	//@ts-ignore
	document.getElementById("holders").innerHTML = "Get Holders";
});
