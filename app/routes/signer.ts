import { json, type ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { createWalletClient, encodePacked, http, keccak256, publicActions, toBytes } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { astarZkatana } from "viem/chains";

const RPC = process.env.RPC;
const WALLET_KEY = process.env.WALLET_KEY;

export const action = async ({ request }: ActionFunctionArgs) => {
  switch (request.method) {
    case "POST": {
      const body = await request.json();
      const signature = await signMessage(body);
      return json(signature);
    }
  }
};

async function signMessage({ to, tokenId, quantity, contractAddress }: ContractDetails) {
  const transport = http(RPC);

  if (!WALLET_KEY) throw new Error("WALLET_KEY is not set");
  const account = privateKeyToAccount(`0x${WALLET_KEY}`);

  const client = createWalletClient({
    account,
    chain: astarZkatana,
    transport,
  }).extend(publicActions);

  const nonce = await client.getTransactionCount({ address: account.address });

  const encodedMessage = encodePacked(
    ["address", "uint256", "uint256", "uint256", "address"],
    [to, BigInt(tokenId), BigInt(quantity), BigInt(nonce), contractAddress],
  );
  const hash = keccak256(encodedMessage);

  const signedMessage = await client.signMessage({ account, message: hash });

  return { signedMessage, nonce, hash };
}

type ContractDetails = {
  to: `0x${string}`;
  tokenId: number;
  quantity: number;
  contractAddress: `0x${string}`;
};
