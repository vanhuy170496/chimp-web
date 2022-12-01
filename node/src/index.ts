import {getStarknet, connect, IStarknetWindowObject} from "get-starknet-wallet";
import {uint256, Account} from "starknet";

const NFT_CONTRACT_ADDRESS = "0x028cfe0c6b27abcad8957262cdf0ea92ca1261f10682968af1a82a8b5fb73a3d";
const EHT_CONTRACT_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

const CONNECTED_KEY = "CONNECTED_KEY";

const connectWallet = async (showList = true, showModal = true): Promise<IStarknetWindowObject> => {
	let starknet = getStarknet();
	if (!starknet?.isConnected) {
		starknet = await connect({showList});
		if (!starknet) return;
		await starknet.enable({showModal});
	}

	if (starknet.isConnected) {
		localStorage.setItem(CONNECTED_KEY, "1");
		const address = starknet.account.address;
		const shortAddress = address.substring(0, 4) + "..." + address.substring(address.length - 4);
		document.getElementById("connect-value").innerHTML = shortAddress;
		document.getElementById("connect").classList.add("connected");
	} else {
		localStorage.setItem(CONNECTED_KEY, "0");
		document.getElementById("connect").classList.remove("connected");
		document.getElementById("connect-value").innerHTML = "CONNECT";
	}

	return starknet;
};

try {
	if (localStorage.getItem(CONNECTED_KEY) === "1") {
		connectWallet(false, false);
	}
} catch (error) {}

document.getElementById("connect").addEventListener("click", async (event) => {
	event.preventDefault();
	let starknet = getStarknet();
	if (!starknet.isConnected) {
		starknet = await connectWallet();
	} else {
		localStorage.setItem(CONNECTED_KEY, "0");
		document.getElementById("connect").classList.remove("connected");
		document.getElementById("connect-value").innerHTML = "CONNECT";
		starknet.isConnected = false;
	}
	return false;
});

document.getElementById("buy-now").addEventListener("click", async (event) => {
	event.preventDefault();
	const starknet = await connectWallet();
	if (!starknet?.isConnected) return false;
	document.getElementById("buy-popup").classList.add("open");
	return false;
});

const mint = (type: string, priceUnit: number, entrypoint: string) => {
	document.getElementById(`buy-popup-${type}-submit`).addEventListener("click", async (event) => {
		event.preventDefault();
		const starknet = await connectWallet();
		if (!starknet) return false;

		//@ts-ignore
		const amount = parseInt(document.getElementById(`buy-popup-${type}-amount`).value);
		const approvePrice = uint256.bnToUint256(amount * priceUnit + "0000000000000000").low;

		await starknet.account.execute([
			{
				contractAddress: EHT_CONTRACT_ADDRESS,
				entrypoint: "approve",
				calldata: [NFT_CONTRACT_ADDRESS, approvePrice, 0],
			},
			...Array(amount).fill({
				contractAddress: NFT_CONTRACT_ADDRESS,
				entrypoint: entrypoint,
				calldata: [starknet.account.address],
			}),
		]);

		alert("Transaction sending....");
		return false;
	});
};

mint("og", 1, "mintOG");
mint("whitelist", 2, "mintWhitelist");
mint("publish", 2, "mintPublish");
