import {getStarknet, IStarknetWindowObject} from "get-starknet-wallet";
import {uint256} from "starknet";
import {connectWallet as _connectWallet, EHT_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS, CONNECTED_KEY, toast} from "./helper";

const connectWallet = async (showList = true, showModal = true): Promise<IStarknetWindowObject> => {
	const starknet = await _connectWallet(showList, showModal);

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

document.getElementById("connect")?.addEventListener("click", async (event) => {
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

document.getElementById("buy-now")?.addEventListener("click", async (event) => {
	event.preventDefault();
	if (new Date().getTime() <= 1674396000000) {
		alert("Waiting until 2022-12-22 14:00 UTC");
		return;
	}
	const starknet = await connectWallet();
	if (!starknet?.isConnected) return false;
	document.getElementById("buy-popup").classList.add("open");
	return false;
});

const mint = (type: string, priceUnit: number, entrypoint: string) => {
	document.getElementById(`buy-popup-${type}-submit`)?.addEventListener("click", async (event) => {
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

		alert("Request success.");
		return false;
	});
};

mint("og", 1, "mintOG");
mint("whitelist", 1.5, "mintWhitelist");
mint("public", 2, "mint");
