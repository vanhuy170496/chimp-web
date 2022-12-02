import {connect, getStarknet, IStarknetWindowObject} from "get-starknet-wallet";

export const NFT_CONTRACT_ADDRESS = "0x028cfe0c6b27abcad8957262cdf0ea92ca1261f10682968af1a82a8b5fb73a3d";
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
