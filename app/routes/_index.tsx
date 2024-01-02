import { type MetaFunction, type LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { strapiLoader } from "~/helpers/strapiLoader";
import { stringify } from "qs";

export const meta: MetaFunction = () => {
  return [{ name: "description", content: "Welcome to the Gacha Party!" }];
};

export const loader: LoaderFunction = async () => {
  const query = stringify({
    populate: {
      background: {
        fields: ["url", "name", "formats"],
      },
      logo: {
        fields: ["url", "name", "formats"],
      },
    },
  });
  const apiData = await strapiLoader("/landing-page", query);
  return json(apiData);
};

export default function Index() {
  const { apiData, imageUrlPrefix } = useLoaderData<LoaderFunction>();

  const backgroundImage = apiData.data.background.url;
  const logoImage = apiData.data.logo.url;
  const fullImageUrl = `${imageUrlPrefix}${backgroundImage}`;
  const fullLogoUrl = `${imageUrlPrefix}${logoImage}`;

  return (
    <div
      className="bg-cover bg-center h-screen w-full flex items-center justify-center flex-col"
      style={{ backgroundImage: `url(${fullImageUrl})` }}
    >
      <div>
        <img src={fullLogoUrl} alt="Logo" />
      </div>
      <Link
        to="/floors/countryside"
        className="bg-blue-700 bg-opacity-100 text-white text-4xl font-bold uppercase px-28 py-4 rounded-md mt-12 hover:bg-blue-500 transition-colors duration-300"
      >
        Enter
      </Link>
    </div>
  );
}
