import React, { createContext, useContext, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { abi } from "../contract/abi";
import { YokiContractConfig } from "../contract/config";

const {
  contractAddress,
  tokens: { baseYokiToken, capsuleToken, omaToken },
} = YokiContractConfig;

type ReadResult = ReturnType<typeof useContractRead>;
interface GachaTokenContextType {
  omaBalance: ReadResult;
  capsuleBalance: ReadResult;
  baseYokiBalance: ReadResult;
}

const GachaTokenContext = createContext<GachaTokenContextType | null>(null);

export const GachaTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();

  const omaBalance = useContractRead({
    address: contractAddress,
    abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`, BigInt(omaToken.id)],
  });

  const capsuleBalance = useContractRead({
    address: contractAddress,
    abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`, BigInt(capsuleToken.id)],
  });

  const baseYokiBalance = useContractRead({
    address: contractAddress,
    abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`, BigInt(baseYokiToken.id)],
  });

  return (
    <GachaTokenContext.Provider
      value={{
        omaBalance,
        capsuleBalance,
        baseYokiBalance,
      }}
    >
      {children}
    </GachaTokenContext.Provider>
  );
};

export const useGachaTokenBalances = () => {
  const context = useContext(GachaTokenContext);
  if (!context) {
    throw new Error("useGachaTokens must be used within a GachaTokenProvider");
  }
  return context;
};
