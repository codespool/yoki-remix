import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
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

  const floorsQuery = stringify(
    {
      populate: {
        menu_icon: {
          fields: ["url"],
        },
      },
    },
    { encodeValuesOnly: true },
  );
  console.log(floorsQuery);
  const navbarData = await strapiLoader("/navbar", navbarQuery);
  const floorData = await strapiLoader("/floors", floorsQuery);
  console.log(floorData);
  return json({
    navbar: navbarData.apiData,
    floors: floorData.apiData,
    imgUrlPrefix: navbarData.imageUrlPrefix,
  });
};

export default function Layout() {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);
  const { navbar, floors, imgUrlPrefix } = useLoaderData<LoaderFunction>();

  const icons = navbar.data.icons.reduce((acc, current) => {
    acc[current.tooltip.toLowerCase()] = current;
    return acc;
  }, {});

  return (
    <>
      {/* TOP BAR */}
      <div className="absolute top-0 right-0 p-4 z-50">
        <ConnectButton />
      </div>
      {/* LEFT NAVBAR */}
      <div className="absolute left-[1rem] top-[3rem] flex flex-col justify-start space-y-10 items-center p-4 bg-opacity-50 z-50 mt-20">
        {/* TRAVEL ICON */}
        <div
          className="rounded-full bg-black bg-opacity-60 border border-white border-opacity-60 flex items-center justify-center w-14 h-14 p-1 cursor-pointer hover:border-opacity-100 hover:bg-opacity-100"
          onClick={() => {
            setIsSubmenuOpen(!isSubmenuOpen);
          }}
        >
          <img
            alt={`${icons.travel.tooltip} icon`}
            src={`${imgUrlPrefix}${icons.travel.image.url}`}
          />
        </div>
        {/* NOTEBOOK ICON */}
        <Link
          to="/baths"
          className="rounded-full bg-black bg-opacity-60 border border-white border-opacity-60 flex items-center justify-center w-14 h-14 p-1 hover:border-opacity-100 hover:bg-opacity-100"
        >
          <img
            alt={`${icons.notebook.tooltip} icon`}
            src={`${imgUrlPrefix}${icons.notebook.image.url}`}
          />
        </Link>
        {/* BATHS ICON */}
        <Link
          to="/baths"
          className="rounded-full bg-black bg-opacity-60 border border-white border-opacity-60 flex items-center justify-center w-14 h-14 p-1 hover:border-opacity-100 hover:bg-opacity-100"
        >
          <img
            alt={`${icons.baths.tooltip} icon`}
            src={`${imgUrlPrefix}${icons.baths.image.url}`}
          />
        </Link>
        {/* LEADERBOARD ICON */}
        <div className="rounded-full bg-black bg-opacity-60 border border-white border-opacity-60 flex items-center justify-center w-14 h-14 p-1 cursor-pointer hover:border-opacity-100 hover:bg-opacity-100">
          <img
            alt={`${icons.leaderboard.tooltip} icon`}
            src={`${imgUrlPrefix}${icons.leaderboard.image.url}`}
          />
        </div>
        {/* FLOORS MENU */}
        {isSubmenuOpen && (
          <div
            className="absolute left-full top-0 flex flex-col space-y-2"
            onMouseLeave={() => {
              setIsSubmenuOpen(false);
            }}
          >
            {floors.data.map((floor) => (
              <Link
                key={floor.id}
                onClick={() => {
                  setIsSubmenuOpen(false);
                }}
                to={`floors/${floor.floorName}`}
                className="bg-black bg-opacity-60 border-white border-opacity-60 border-[1px] min-w-[15rem] rounded-full text-l flex items-center justify-between h-12 px-4 hover:border-opacity-100 hover:bg-opacity-100"
              >
                <span className="text-white font-inter font-semibold text-xl">
                  {floor.menu_name}
                </span>
                <div>
                  <img
                    alt={`${floor.displayName} icon`}
                    src={`${imgUrlPrefix}${floor.menu_icon.url}`}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <Outlet />
    </>
  );
}
