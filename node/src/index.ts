import {getStarknet, IStarknetWindowObject} from "get-starknet-wallet";
import {uint256} from "starknet";
import {compileCalldata} from "starknet/dist/utils/stark";
import {connectWallet as _connectWallet, EHT_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS, CONNECTED_KEY, WHITELISTS} from "./helper";

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

	await checkWalletOGMint(starknet);

	return starknet;
};

const checkWalletOGMint = async (starknet: IStarknetWindowObject) => {
	const address = starknet.account.address;
	const ogMintAlertElement = document.getElementById("og-mint-alert");
	const ogMintFormElement = document.getElementById("og-mint-form");
	if (!ogMintAlertElement || !ogMintFormElement) {
		ogMintAlertElement.classList.remove("hidden");
		ogMintFormElement.classList.add("hidden");
		return;
	}
	if (localStorage.getItem(`minted_${starknet.account.address}`) == "1") {
		ogMintAlertElement.classList.remove("hidden");
		ogMintFormElement.classList.add("hidden");
		return;
	}
	if (WHITELISTS.indexOf(uint256.bnToUint256(address).low) < 0) {
		ogMintAlertElement.classList.remove("hidden");
		ogMintFormElement.classList.add("hidden");
		return;
	}

	const {result} = await starknet.account.callContract({
		contractAddress: NFT_CONTRACT_ADDRESS,
		entrypoint: "balanceOf",
		calldata: compileCalldata({owner: address}),
	});

	const amount = parseInt(compileCalldata({ok: result[0]})[0]);
	if (amount >= 1) {
		ogMintAlertElement.classList.remove("hidden");
		ogMintFormElement.classList.add("hidden");
		return;
	}

	ogMintAlertElement.classList.add("hidden");
	ogMintFormElement.classList.remove("hidden");
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
	if (starknet.isConnected) await checkWalletOGMint(starknet);
	return false;
});

document.getElementById("buy-now")?.addEventListener("click", async (event) => {
	event.preventDefault();
	const starknet = await connectWallet();
	if (!starknet?.isConnected) return false;
	document.getElementById("buy-popup").classList.add("open");
	return false;
});

const setOpenPublicMint = () => {
	const publicDate = document.getElementById("public-date");
	const publicForm = document.getElementById("public-form");
	const whitelistMintGroup = document.getElementById("whitelist-mint-group");
	if (!publicDate || !publicForm || !whitelistMintGroup) return;
	const date = new Date(Date.UTC(2022, 11, 24, 13, 0, 0));
	if (new Date().getTime() < date.getTime()) {
		whitelistMintGroup.classList.remove("hidden");
		publicDate.classList.remove("hidden");
		publicForm.classList.add("hidden");
	} else {
		whitelistMintGroup.classList.add("hidden");
		publicDate.classList.add("hidden");
		publicForm.classList.remove("hidden");
	}
};

setOpenPublicMint();

const mint = (type: string, priceUnit: number, entrypoint: string) => {
	document.getElementById(`buy-popup-${type}-submit`)?.addEventListener("click", async (event) => {
		event.preventDefault();
		const starknet = await connectWallet();
		if (!starknet) return false;

		//@ts-ignore
		const amount = parseInt(document.getElementById(`buy-popup-${type}-amount`).value);
		const approvePrice = uint256.bnToUint256(amount * priceUnit * 100 + "00000000000000").low;

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

		document.getElementById("buy-popup").classList.remove("open");
		connectWallet(false, false);
		if (type === "og") {
			localStorage.setItem(`minted_${starknet.account.address}`, "1");
		}
		alert("Successfully Minted. Congratulations.");
		return false;
	});
};

mint("og", 1, "mintOG");
mint("whitelist", 1.5, "mintWhitelist");
mint("public", 2, "mint");
