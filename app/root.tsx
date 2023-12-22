import { type LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import tailwindStyles from "./tailwind.css";
import customStyles from "./custom.css";
import questStyles from "@bandit-network/quest-widget/dist/styles.css";
import rainbowStyles from "@rainbow-me/rainbowkit/styles.css";
import RainbowProvider from "~/providers/RainbowProvider";
import BanditProvider from "./providers/BanditProvider";
import { BanditSignModal } from "./components/BanditSignModal";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  {
    rel: "stylesheet",
    href: questStyles,
  },
  { rel: "stylesheet", href: rainbowStyles },
  { rel: "stylesheet", href: customStyles },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Yomi Origins</title>
        <Meta />
        <Links />
      </head>
      <body>
        <RainbowProvider>
          <BanditProvider>
            <BanditSignModal />
            <Outlet />
          </BanditProvider>
        </RainbowProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
