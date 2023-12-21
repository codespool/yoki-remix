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
  const apiData = await strapiLoader("/baths-page", query);
  return json(apiData);
};

export default function Evolve() {
  const { apiData, imageUrlPrefix } = useLoaderData<LoaderFunction>();

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
          <Capsule showButton={false} imageSize="w-1/4" />
          <Oma showButton={false} />
        </div>
        <div
          className="p-4 w-[25vw] rounded-md"
          style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        >
          <BaseYoki />
        </div>
        <div
          className="p-4 w-[25vw] rounded-md"
          style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        >
          <EvolvedYoki />
        </div>
      </div>
    </div>
  );
}
