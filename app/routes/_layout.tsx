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
  const navbarData = await strapiLoader("/navbar", navbarQuery);
  const floorData = await strapiLoader("/floors", floorsQuery);
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
        iconUrl={`${imgUrlPrefix}${icons.leaderboard.image.url}`}
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
  iconUrl,
  data,
}: { isOpen: boolean; onClose: () => void; iconUrl: string; data: typeof sampleDataSet }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="
        bg-astar-gradient
        backdrop-blur
        border border-[#BAF7FF] border-opacity-40
        rounded-lg
        max-w-[60vw]
        w-full
        max-h-[40vh]
        px-12 
        py-8
        overflow-y-scroll"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-center text-white p-4 space-x-8">
          <h1 className="text-3xl font-inter font-bold">Leaderboard</h1>
          <div className="mt-[-10px]">
            <img alt="leaderboard icon" src={iconUrl} />
          </div>
        </div>
        <TableRow>
          <TableCell data="Rank" size="s" isHeader />
          <TableCell data="Adventurer" size="m" isHeader />
          <TableCell data="Yoki Discovered" size="m" isHeader />
          <TableCell data="Knowledge Level" size="m" isHeader />
          <TableCell data="Lore Collected" size="m" isHeader />
        </TableRow>

        {/* Map through your data here to display content */}
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell data={item.rank} size="s" isMe={item.id === 10} />
            <TableCell data={item.adventurer} size="m" isMe={item.id === 10} />
            <TableCell data={item.yokiDiscovered} size="m" isMe={item.id === 10} />
            <TableCell data={item.knowledgeLevel} size="m" isMe={item.id === 10} />
            <TableCell data={item.loreCollected} size="m" isMe={item.id === 10} />
            {item.id === 10 && <div className="absolute left-10">ME</div>}
          </TableRow>
        ))}
      </div>
    </div>
  );
}

function TableRow({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex justify-evenly items-center text-white m-1 font-inter space-x-2">
      {children}
    </div>
  );
}

function TableCell({
  data,
  size,
  isHeader,
  isMe,
}: { data: string | number; size: "s" | "m"; isHeader?: boolean; isMe?: boolean }) {
  const getBg = () => {
    if (isHeader) return "";

    const rankColors: Record<string, string> = {
      sage: `bg-[#E9A500] bg-opacity-60 border ${
        isMe ? "border border-white" : "border-[#E9A500]"
      } border-opacity-100`,
      virtuoso: `bg-[#E96200] bg-opacity-60 border ${
        isMe ? "border border-white" : "border-[#E96200]"
      } border-opacity-100`,
      authority: `bg-[#EA0D0D] bg-opacity-60 border ${
        isMe ? "border border-white" : "border-[#D61D1D]"
      } border-opacity-100`,
      scholar: `bg-[#1737DE] bg-opacity-60 border ${
        isMe ? "border border-white" : "border-[#1D69FD]"
      } border-opacity-100`,
      aspirant: `bg-[#049034] bg-opacity-60 border ${
        isMe ? "border border-white" : "border-[#11A845]"
      } border-opacity-100`,
    };
    if (typeof data === "string" && rankColors[data.toLowerCase()]) {
      const rankColor = rankColors[data.toLowerCase()];
      console.log(data, rankColor);
      return rankColor;
    }
    return `bg-black bg-opacity-60 ${isMe ? "border border-white" : ""}`;
  };

  return (
    <div
      className={`
      ${getBg()}
      rounded-full 
      ${size === "s" ? "w-16" : "w-48"}
      flex
      justify-center
      items-center
      p-1
      `}
    >
      <span
        className={`
      font-${isHeader ? "semibold" : "normal"}]`}
      >
        {data}
      </span>
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
    id: 2,
    rank: 2,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 12037,
    knowledgeLevel: "Sage",
    loreCollected: 31123,
  },
  {
    id: 3,
    rank: 3,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 12037,
    knowledgeLevel: "Virtuoso",
    loreCollected: 31123,
  },
  {
    id: 4,
    rank: 4,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 12037,
    knowledgeLevel: "Virtuoso",
    loreCollected: 31123,
  },
  {
    id: 5,
    rank: 5,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Authority",
    loreCollected: 2934,
  },
  {
    id: 6,
    rank: 6,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Authority",
    loreCollected: 2934,
  },
  {
    id: 7,
    rank: 7,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Scholar",
    loreCollected: 2934,
  },
  {
    id: 8,
    rank: 8,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Scholar",
    loreCollected: 2934,
  },
  {
    id: 9,
    rank: 9,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 10,
    rank: 10,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 11,
    rank: 11,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 9912,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 12,
    rank: 12,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 13,
    rank: 13,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 14,
    rank: 14,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 15,
    rank: 15,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 16,
    rank: 16,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 17,
    rank: 17,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 18,
    rank: 18,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 19,
    rank: 19,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 20,
    rank: 20,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
  {
    id: 21,
    rank: 21,
    adventurer: "0xeT3...2Hj4",
    yokiDiscovered: 422,
    knowledgeLevel: "Aspirant",
    loreCollected: 2934,
  },
];
