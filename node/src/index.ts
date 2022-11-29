import {getStarknet, connect, IStarknetWindowObject} from "get-starknet-wallet";
import {StarknetChainId} from "starknet/dist/constants";
import {compileCalldata} from "starknet/dist/utils/stark";

const NFT_CONTRACT_ADDRESS = "0x02d65f093bb27010affdab3a051951b11119bdf9b45ba6927c5e7ddec27c130c";

const connectWallet = async (): Promise<IStarknetWindowObject> => {
	const starknet = await connect({showList: true});
	if (!starknet) return;
	await starknet.enable({showModal: true});
	return starknet;
};

document.getElementById("buy-now").addEventListener("click", async (event) => {
	event.preventDefault();
	const starknet = await connectWallet();
	if (!starknet?.isConnected) return false;
	document.getElementById("buy-popup").classList.add("open");
	return false;
});

document.getElementById("buy-popup-og-submit").addEventListener("click", async (event) => {
	event.preventDefault();
	const starknet = getStarknet();
	if (!starknet.isConnected) return false;
	//@ts-ignore
	const amount = parseInt(document.getElementById("buy-popup-og-amount").value);
	const res = await starknet.account.execute([
		{
			contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
			entrypoint: "approve",
			calldata: compileCalldata({
				recipient: "0x007d6b73c3e83a368b44d432f0e6c732798e1191fbd04546fd5cff748ae8375a",
				amount: "10000000000000000",
			}),
		},
		{
			contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
			entrypoint: "transferFrom",
			calldata: compileCalldata({
				sender: starknet.account.address,
				recipient: "0x007d6b73c3e83a368b44d432f0e6c732798e1191fbd04546fd5cff748ae8375a",
				amount: "10000000000000000",
			}),
		},
	]);
	console.log(res);
	alert("Transaction sending....");
	return false;
});
