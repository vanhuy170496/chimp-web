import {connect, getStarknet, IStarknetWindowObject} from "get-starknet-wallet";

export const NFT_CONTRACT_ADDRESS = "0x03c0e27983f453c2925ad6fd0d88f128ed9a627843e351ebab13fe880c3a3ec1";
export const EHT_CONTRACT_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const CONNECTED_KEY = "CONNECTED_KEY";

export const connectWallet = async (showList = true, showModal = true): Promise<IStarknetWindowObject> => {
	let starknet = getStarknet();
	if (!starknet?.isConnected) {
		starknet = await connect({showList});
		if (!starknet) return;
		await starknet.enable({showModal});
	}

	return starknet;
};
