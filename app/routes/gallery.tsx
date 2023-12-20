import React, { useState } from "react";
import ImageCard from "../components/ImageCard";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useBalance,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Erc1155Mintable } from "@thirdweb-dev/sdk";
import IpfsImage from "~/components/IpfsImage";
import Capsule from "~/components/Capsule";
import Oma from "~/components/Oma";
import BaseYoki from "~/components/BaseYoki";
import EvolvedYoki from "~/components/EvolvedYoki";

const abi = [
  {
    name: "mint",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "", type: "bytes" },
    ],
    stateMutability: "nonpayable",
    type: "function",
    outputs: [],
  },
  {
    name: "balanceOf",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    name: "uri",
    inputs: [{ name: "_tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

const YOKI_CONTRACT_ADDRESS = "0x4e14510c4DCEB04567CA5752C953c49D13254fe7";
const OMA_TOKEN_ID = 0;
const CAPSULE_TOKEN_ID = 1;

const cards = [
  {
    url: "https://imageio.forbes.com/specials-images/imageserve/6170e01f8d7639b95a7f2eeb/Sotheby-s-NFT-Natively-Digital-1-2-sale-Bored-Ape-Yacht-Club--8817-by-Yuga-Labs/0x0.png",
    name: "Ape #2345",
    collectionId: "Bored Apes Yacht Club",
  },
  {
    url: "https://media.tatler.com/photos/627258d0bc4f55bd13591609/master/w_1600,c_limit/Creepz_04052022_Instagram%20@coldbloodedcreepz_nft.jpg",
    name: "Creepz#9",
    collectionId: "CREEPZ",
  },
  {
    url: "https://imageio.forbes.com/specials-images/imageserve/6170e01f8d7639b95a7f2eeb/Sotheby-s-NFT-Natively-Digital-1-2-sale-Bored-Ape-Yacht-Club--8817-by-Yuga-Labs/0x0.png",
    name: "Ape #2346",
    collectionId: "Bored Apes Yacht Club",
  },
  {
    url: "https://media.tatler.com/photos/627258d0bc4f55bd13591609/master/w_1600,c_limit/Creepz_04052022_Instagram%20@coldbloodedcreepz_nft.jpg",
    name: "Creepz#1",
    collectionId: "CREEPZ",
  },
  {
    url: "https://imageio.forbes.com/specials-images/imageserve/6170e01f8d7639b95a7f2eeb/Sotheby-s-NFT-Natively-Digital-1-2-sale-Bored-Ape-Yacht-Club--8817-by-Yuga-Labs/0x0.png",
    name: "Ape #2347",
    collectionId: "Bored Apes Yacht Club",
  },
  {
    url: "https://media.tatler.com/photos/627258d0bc4f55bd13591609/master/w_1600,c_limit/Creepz_04052022_Instagram%20@coldbloodedcreepz_nft.jpg",
    name: "Creepz#2",
    collectionId: "CREEPZ",
  },
  {
    url: "https://imageio.forbes.com/specials-images/imageserve/6170e01f8d7639b95a7f2eeb/Sotheby-s-NFT-Natively-Digital-1-2-sale-Bored-Ape-Yacht-Club--8817-by-Yuga-Labs/0x0.png",
    name: "Ape #2348",
    collectionId: "Bored Apes Yacht Club",
  },
  {
    url: "https://media.tatler.com/photos/627258d0bc4f55bd13591609/master/w_1600,c_limit/Creepz_04052022_Instagram%20@coldbloodedcreepz_nft.jpg",
    name: "Creepz#3",
    collectionId: "CREEPZ",
  },
];

const Gallery: React.FC = () => {
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: YOKI_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "mint",
    args: [address, OMA_TOKEN_ID, 1, "0x"],
  });
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { data: omaBalance } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "balanceOf",
    args: [address, OMA_TOKEN_ID],
  });

  const { data: tokenUri } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "uri",
    args: [CAPSULE_TOKEN_ID],
  });

  const { data: capsuleBalance } = useContractRead({
    address: YOKI_CONTRACT_ADDRESS,
    chainId: 1261120,
    abi,
    functionName: "balanceOf",
    args: [address, CAPSULE_TOKEN_ID],
  });

  return (
    <>
      <div>
        <ConnectButton />
      </div>
      <div className="flex justify-between h-screen p-4">
        <div className="w-1/5">
          <Capsule />
          <hr />
          <Oma />
        </div>
        <div className="w-1/5">
          <BaseYoki />
        </div>
        {/* <div className="w-1/5 flex items-center justify-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Open
          </button>
        </div>
        <div className="w-1/5 flex flex-col space-y-4">
          {cards.slice(0, 3).map((card) => (
            <ImageCard key={card.name} image={card} />
          ))}
        </div> */}
        {/* <div className="w-1/5 flex items-center justify-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Evolve
          </button>
        </div> */}
        {/* <div className="w-1/5 flex flex-col space-y-4">
          {cards.slice(0, 3).map((card) => (
            <ImageCard key={card.name} image={card} />
          ))}
        </div> */}
        <div className="w-1/5">
          <EvolvedYoki />
        </div>
      </div>
    </>
  );
};

export default Gallery;
