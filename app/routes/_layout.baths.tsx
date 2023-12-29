import React from "react";
import { LoaderFunction, json } from "@remix-run/node";
import { stringify } from "qs";
import { strapiLoader } from "~/helpers/strapiLoader";
import { useLoaderData } from "@remix-run/react";
import { Capsule } from "~/components/Capsule";
import { Oma } from "~/components/Oma";
import BaseYoki from "~/components/BaseYoki";
import EvolvedYoki from "~/components/EvolvedYoki";

export const loader: LoaderFunction = async () => {
  const query = stringify({
    populate: {
      background_image: {
        fields: ["url", "name"],
      },
    },
  });
  const tokenMetadataQuery = stringify(
    {
      populate: {
        images: {
          populate: {
            token_image: {
              fields: ["url", "name"],
            },
          },
        },
      },
    },
    { encodeValuesOnly: true },
  );
  console.log("tokenMetadataQuery", tokenMetadataQuery);
  const pageData = await strapiLoader("/baths-page", query);
  const { apiData: tokenMetadata } = await strapiLoader("/token-metadata", tokenMetadataQuery);
  return json({ ...pageData, tokenMetadata });
};

export default function Baths() {
  const { apiData, imageUrlPrefix, tokenMetadata } = useLoaderData<LoaderFunction>();

  const backgroundImage = apiData.data.background_image.url;
  const fullImageUrl = `${imageUrlPrefix}${backgroundImage}`;

  return (
    <div
      className="bg-cover bg-center h-screen w-full relative"
      style={{ backgroundImage: `url(${fullImageUrl})` }}
    >
      <div className="absolute top-0 left-0 right-0 flex justify-between px-[10vw] mt-[100px]">
        <div
          className="p-4 w-[15vw] rounded-md flex flex-col justify-evenly items-center"
          style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        >
          <Capsule
            showButton={false}
            imageSize="w-1/4"
            tokenMetadata={tokenMetadata as TokenMetadata}
          />
          <Oma showButton={false} tokenMetadata={tokenMetadata as TokenMetadata} />
        </div>
        <div
          className="p-4 w-[25vw] rounded-md"
          style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        >
          <BaseYoki tokenMetadata={tokenMetadata as TokenMetadata} />
        </div>
        <div
          className="p-4 w-[25vw] rounded-md"
          style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        >
          <EvolvedYoki tokenMetadata={tokenMetadata as TokenMetadata} />
        </div>
      </div>
    </div>
  );
}

export type TokenMetadata = {
  data: {
    id: number;
    images: TokenImage[];
  };
};

type TokenImage = {
  id: number;
  token_id: number;
  token_name: string;
  contract_address: string;
  ipfs_link: string;
  token_image: {
    id: number;
    url: string;
    name: string;
  };
};
