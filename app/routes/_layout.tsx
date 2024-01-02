import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LoaderFunction, json } from "@remix-run/node";
import { strapiLoader } from "~/helpers/strapiLoader";
import { stringify } from "qs";
import { useState } from "react";
import { GachaTokenProvider } from "~/providers/GachaTokenProvider";

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

  const leaderboardQuery = stringify(
    {
      populate: {
        me_icon: {
          fields: ["url"],
        },
        articles: {
          fields: ["title", "summary", "link"],
        },
        title_icon: {
          fields: ["url"],
        },
      },
    },
    { encodeValuesOnly: true },
  );
  const navbarData = await strapiLoader("/navbar", navbarQuery);
  const floorData = await strapiLoader("/floors", floorsQuery);
  const leaderboardData = await strapiLoader("/leaderboard", leaderboardQuery);
  return json({
    navbar: navbarData.apiData,
    floors: floorData.apiData,
    leaderboard: leaderboardData.apiData,
    imgUrlPrefix: navbarData.imageUrlPrefix,
  });
};

export default function Layout() {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const { navbar, floors, leaderboard, imgUrlPrefix } = useLoaderData<LoaderFunction>();

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
        imgUrlPrefix={imgUrlPrefix}
        data={leaderboard.data}
      />
      {/* CONTENT */}
      <GachaTokenProvider>
        <Outlet />
      </GachaTokenProvider>
    </>
  );
}

function Leaderboard({
  isOpen,
  onClose,
  imgUrlPrefix,
  data,
}: { isOpen: boolean; onClose: () => void; imgUrlPrefix: string; data: any }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div>
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
              <img alt="leaderboard icon" src={`${imgUrlPrefix}${data.title_icon.url}`} />
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
          {data.leaderboard_data.map((item) => (
            <TableRow key={item.id}>
              <TableCell data={item.rank} size="s" isMe={item.id === 10} />
              <TableCell data={item.adventurer} size="m" isMe={item.id === 10} />
              <TableCell data={item.yokiDiscovered} size="m" isMe={item.id === 10} />
              <TableCell data={item.knowledgeLevel} size="m" isMe={item.id === 10} />
              <TableCell data={item.loreCollected} size="m" isMe={item.id === 10} />
              {item.id === 10 && (
                <div className="absolute left-2 h-8 w-8 rounded-full border border-white bg-black bg-opacity-60">
                  <img src={`${imgUrlPrefix}${data.me_icon.url}`} alt="" />
                </div>
              )}
            </TableRow>
          ))}
        </div>
        <div className="flex space-x-6 mt-6 max-w-[60vw] max-h-[20vh]">
          {data.articles.map((article) => (
            <Article articleData={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Article({
  articleData,
}: { articleData: { title: string; summary: string; link: string } }) {
  return (
    <div
      className="
      backdrop-blur
      bg-gradient-to-b from-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.2)]
      w-1/3
      p-4
      rounded-lg
      border border-white border-opacity-40
      font-inter
      text-white
      "
    >
      <h2 className="font-bold">{articleData.title}</h2>
      <p className="text-sm my-2">{articleData.summary}</p>
      {articleData.link && (
        <a className="text-sm" href={articleData.link}>
          Learn more here.
        </a>
      )}
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
