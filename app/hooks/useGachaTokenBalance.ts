import { abi } from "../contract/abi";
import { YokiContractConfig } from "~/contract/config";
import { useAccount, useContractRead } from "wagmi";

const { contractAddress } = YokiContractConfig;

export function useGachaTokenBalance(tokenId: number) {
  const { address } = useAccount();

  const {
    data: tokenBalance,
    refetch: refetchBalance,
    isLoading: isBalanceLoading,
  } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`, BigInt(tokenId)],
  });

  return {
    tokenBalance,
    refetchBalance,
    isBalanceLoading,
  };
}
