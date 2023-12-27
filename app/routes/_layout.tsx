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
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
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
          to="/notebook"
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
        <div
          className="rounded-full bg-black bg-opacity-60 border border-white border-opacity-60 flex items-center justify-center w-14 h-14 p-1 cursor-pointer hover:border-opacity-100 hover:bg-opacity-100"
          onClick={() => setIsLeaderboardOpen(true)}
        >
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
      {/* LEADERBOARD */}
      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={() => {
          setIsLeaderboardOpen(false);
        }}
        data={sampleDataSet}
      />
      {/* CONTENT */}
      <Outlet />
    </>
  );
}

function Leaderboard({
  isOpen,
  onClose,
  data,
}: { isOpen: boolean; onClose: () => void; data: typeof sampleDataSet }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div className="bg-gradient-to-br from-blue-600 to-purple-500 rounded-lg shadow-xl overflow-hidden max-w-2xl w-full">
        <div className="flex justify-between items-center text-white p-4">
          <h2 className="text-2xl font-bold">Leaderboard</h2>
          <button onClick={onClose}>✖</button>
        </div>
        <div className="p-4">
          {/* Map through your data here to display content */}
          {data.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span>{item.rank}</span>
              <span>{item.adventurer}</span>
              <span>{item.yokiDiscovered}</span>
              <span>{item.knowledgeLevel}</span>
              <span>{item.loreCollected}</span>
            </div>
          ))}
        </div>
        {/* Add additional content as needed */}
      </div>
    </div>
  );
}

const sampleDataSet = [
  {
    id: 1,
    rank: 1,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 12037,
    knowledgeLevel: "Sage",
    loreCollected: 31123,
  },
  {
    id: 1,
    rank: 2,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 12037,
    knowledgeLevel: "Sage",
    loreCollected: 31123,
  },
  {
    id: 1,
    rank: 3,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 12037,
    knowledgeLevel: "Sage",
    loreCollected: 31123,
  },
  {
    id: 1,
    rank: 4,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 12037,
    knowledgeLevel: "Sage",
    loreCollected: 31123,
  },
  {
    id: 2,
    rank: 5,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Sage",
    loreCollected: 2934,
  },
  {
    id: 2,
    rank: 6,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Sage",
    loreCollected: 2934,
  },
  {
    id: 2,
    rank: 7,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Sage",
    loreCollected: 2934,
  },
  {
    id: 2,
    rank: 8,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Sage",
    loreCollected: 2934,
  },
  {
    id: 2,
    rank: 9,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Sage",
    loreCollected: 2934,
  },
  {
    id: 2,
    rank: 10,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Sage",
    loreCollected: 2934,
  },
  {
    id: 2,
    rank: 11,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Sage",
    loreCollected: 2934,
  },
  {
    id: 30,
    rank: 12,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 30,
    rank: 13,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 30,
    rank: 14,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 30,
    rank: 15,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 30,
    rank: 16,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 30,
    rank: 17,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 30,
    rank: 18,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 30,
    rank: 19,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 30,
    rank: 20,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 30,
    rank: 21,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
];
