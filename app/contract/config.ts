export const YokiContractConfig: ContractConfig = {
  contractAddress: "0x8578230BB765A1894E16220B6B150814A31b28b9",
  tokens: {
    omaToken: { id: 0, mintQuantity: 3, name: "Oma" },
    capsuleToken: { id: 1, mintQuantity: 1, name: "Capsule" },
    baseYokiToken: { id: 2, mintQuantity: 1, name: "Base Yoki" },
    mojoYokiToken: { id: 3, mintQuantity: 1, name: "Mojo Yoki" },
    passionYokiToken: { id: 4, mintQuantity: 1, name: "Passion Yoki" },
    wisdomYokiToken: { id: 5, mintQuantity: 1, name: "Wisdom Yoki" },
  },
};

type ContractConfig = {
  contractAddress: `0x${string}`;
  tokens: TokenConfig;
};

type TokenConfig = {
  [key: string]: {
    id: number;
    mintQuantity: number;
    name: string;
  };
};
