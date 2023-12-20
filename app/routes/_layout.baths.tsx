import React from "react";
import { LoaderFunction, json } from "@remix-run/node";
import { stringify } from "qs";
import { strapiLoader } from "~/helpers/strapiLoader";
import { useLoaderData } from "@remix-run/react";
import Capsule from "~/components/Capsule";
import Oma from "~/components/Oma";
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
      className="bg-cover bg-center h-screen w-full flex items-center justify-center flex-col"
      style={{ backgroundImage: `url(${fullImageUrl})` }}
    >
      <div className="flex justify-between h-screen p-4">
        <div className="w-1/5">
          <Capsule />
          <hr />
          <Oma />
        </div>
        <div className="w-1/5">
          <BaseYoki />
        </div>
        <div className="w-1/5">
          <EvolvedYoki />
        </div>
      </div>
    </div>
  );
}
