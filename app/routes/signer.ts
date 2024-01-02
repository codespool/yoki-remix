import { json, type ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { v4 as uuidv4 } from "uuid";
import {
  createPublicClient,
  createWalletClient,
  encodePacked,
  http,
  keccak256,
  publicActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { astarZkatana } from "viem/chains";
import { YokiContractConfig } from "../contract/config";

const RPC = process.env.RPC;
const WALLET_KEY = process.env.WALLET_KEY;

export const action = async ({ request }: ActionFunctionArgs) => {
  switch (request.method) {
    case "POST": {
      const body = await request.json();
      const signature = await signMessage(body);
      return json(signature);
    }
    default:
      return json({ error: "Method Not Allowed" }, { status: 405 });
  }
};

async function signMessage({ to, tokenId, contractAddress }: ContractDetails) {
  const transport = http(RPC);

  const quantity = Object.values(YokiContractConfig.tokens).find(
    (token) => token.id === tokenId,
  )?.mintQuantity;

  if (!WALLET_KEY) throw new Error("WALLET_KEY is not set");
  const account = privateKeyToAccount(`0x${WALLET_KEY}`);

  const client = createWalletClient({
    account,
    chain: astarZkatana,
    transport,
  }).extend(publicActions);

  const publicClient = createPublicClient({
    chain: astarZkatana,
    transport,
  });

  const uuid = uuidv4();
  const nonce: `0x${string}` = `0x${uuid.replace(/-/g, "")}`;

  const encodedMessage = encodePacked(
    ["address", "uint256", "uint256", "uint256", "address"],
    [to, BigInt(tokenId), BigInt(quantity || 1), BigInt(nonce), contractAddress],
  );
  const hash = keccak256(encodedMessage);

  const signedMessage = await client.signMessage({ account, message: { raw: hash } });

  const valid = await publicClient.verifyMessage({
    message: hash,
    signature: signedMessage,
    address: account.address,
  });

  return { signedMessage, nonce, hash };
}

type ContractDetails = {
  to: `0x${string}`;
  tokenId: number;
  quantity: number;
  contractAddress: `0x${string}`;
};
