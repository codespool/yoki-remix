import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BridgeIcon, CardIcon, FolderIcon, LanguageIcon, PoolIcon } from "../components/Icons";
import { LoaderFunction, json } from "@remix-run/node";
import { strapiLoader } from "~/helpers/strapiLoader";
import { stringify } from "qs";
import { useState } from "react";

export const loader: LoaderFunction = async () => {
  const navbarQuery = stringify(
    {
      populate: {
        default_icon_background: {
          fields: ["url"],
        },
        default_text_background: {
          fields: ["url"],
        },
        icons: {
          populate: {
            image: {
              fields: ["url"],
            },
          },
          sort: "order:asc",
        },
      },
    },
    { encodeValuesOnly: true },
  );
  const navbarData = await strapiLoader("/navbar", navbarQuery);
  const floorData = await strapiLoader("/floors");

  return json({
    navbar: navbarData.apiData,
    floors: floorData.apiData,
    imgUrlPrefix: navbarData.imageUrlPrefix,
  });
};

export default function Layout() {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);
  const { navbar, floors, imgUrlPrefix } = useLoaderData<LoaderFunction>();
  return (
    <>
      {/* TOP BAR */}
      <div className="absolute top-0 right-0 p-4 z-50">
        <ConnectButton />
      </div>
      {/* LEFT NAVBAR */}
      <div className="absolute left-[1rem] top-[3rem] flex flex-col justify-start space-y-5 items-center p-4 bg-opacity-50 z-50">
        {navbar.data.icons?.map((icon) => {
          const fullImageUrl = `${imgUrlPrefix}${icon.image.url}`;
          const iconBackgroundUrl = `${imgUrlPrefix}${navbar.data.default_icon_background.url}`;
          const textBackgroundUrl = `${imgUrlPrefix}${navbar.data.default_text_background.url}`;
          return (
            <Link
              to={icon.children ? "#" : icon.target}
              key={icon.id}
              className="flex flex-col justify-center items-center w-14 h-14 mt-14"
              style={{
                backgroundImage: `url(${iconBackgroundUrl})`,
                backgroundSize: "cover",
                borderRadius: "50%",
              }}
              onClick={
                icon.children
                  ? () => {
                      setIsSubmenuOpen(!isSubmenuOpen);
                    }
                  : () => {}
              }
            >
              <div
                style={{
                  WebkitMask: `url(${fullImageUrl}) no-repeat center / contain`,
                  backgroundColor: navbar.data.foreground_color,
                }}
                className="w-10 h-10"
              />
              {isSubmenuOpen && icon.children && (
                <div className="absolute left-full top-[5rem] flex flex-col">
                  {floors.data.map((floor) => (
                    <Link
                      key={floor.id}
                      to={`${icon.children.endpoint}/${floor[icon.children.field]}`}
                      className="bg-gray-300 bg-repeat-x rounded-full text-xl uppercase flex items-center justify-center h-12 w-40 mb-3 hover:font-bold"
                      style={{
                        color: navbar.data.foreground_color,
                        backgroundSize: "auto 100%",
                      }}
                    >
                      {floor[icon.children.displayField]}
                    </Link>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
      {/* CONTENT */}
      <Outlet />
    </>
  );
}
