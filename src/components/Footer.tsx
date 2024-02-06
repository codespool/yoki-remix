import { LegalLink, SocialLink } from "@/app/[lang]/layout";
import {
  IconBrandDiscordFilled,
  IconBrandGithub,
  IconBrandMedium,
  IconBrandTelegram,
  IconBrandX,
  IconBrandYoutubeFilled,
} from "@tabler/icons-react";
import React from "react";

const socialIconMapping = {
  twitter: IconBrandX,
  discord: IconBrandDiscordFilled,
  telegram: IconBrandTelegram,
  medium: IconBrandMedium,
  youtube: IconBrandYoutubeFilled,
  github: IconBrandGithub,
};

export function Footer({
  copyright,
  legalLinks,
  socialLinks,
}: { copyright: string; legalLinks: LegalLink[]; socialLinks: SocialLink[] }) {
  return (
    <footer className="z-10 flex flex-col-reverse items-center justify-between gap-1 px-5 py-3 text-sm bg-[#0398FC] text-white sm:flex-row sm:gap-0 sm:py-5 sm:text-base">
      <p>{copyright}</p>
      <div className="flex items-center flex-col gap-3 sm:gap-8 sm:flex-row">
        <div className="flex items-center gap-3">
          {legalLinks.map(({ text, url }, index) => (
            <a key={`legal_${index}_${text}`} className="text-white cursor-pointer" href={url}>
              {text}
            </a>
          ))}
        </div>
        <div className="items-center gap-4 hidden xl:flex">
          {socialLinks.map(({ text, url, type }, index) => (
            <a key={`social_${index}_${text}`} className="text-white cursor-pointer" href={url}>
              {React.createElement(socialIconMapping[type], { size: 20 })}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
