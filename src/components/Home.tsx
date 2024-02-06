"use client";

import { useOffsetTop } from "@/lib/hooks/useOffsetTop";
import { Features } from "@/components/Features";
import Image from "next/image";
import "./Home.css";
import boy from "../../public/boy.png";
import capsules from "../../public/capsules.png";
import fox from "../../public/fox.png";
import girl from "../../public/girl.png";
import leaves from "../../public/leaves.png";
import logo from "../../public/logo_with_leaves.png";
import background from "../../public/main_background.png";
import small_capsules from "../../public/small-capsules.png";
import { useMemo, useRef } from "react";
import { Article } from "@/app/[lang]/page";

export default function Home({ articles, lang }: { articles: Article[]; lang: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { viewportTop, pageOffsetTop } = useOffsetTop(ref);

  const blurSize = useMemo(() => {
    if (viewportTop === undefined || pageOffsetTop === undefined) return 0;
    const size = (pageOffsetTop - viewportTop) / 200;
    return size;
  }, [viewportTop, pageOffsetTop]);

  return (
    <section>
      <div className="h-svh w-full fixed top-0 left-0 z-0">
        <Image
          priority={true}
          src={background}
          alt="background"
          fill={true}
          style={{
            filter: `blur(${blurSize}px)`,
          }}
        />
      </div>
      <div className="pt-20 h-auto">
        <div className="flex items-center justify-center relative">
          <Image
            id="logo"
            priority={true}
            className="h-72 sm:h-[450px] aspect-square object-contain"
            src={logo}
            alt="yoki logo"
            style={{
              filter: `blur(${blurSize}px)`,
            }}
          />
        </div>
      </div>
      <div
        className="flex items-center justify-center -mt-5 sticky top-0 sm:-mt-20"
        style={{
          filter: `blur(${blurSize}px)`,
        }}
      >
        <Image
          id="bg"
          className="absolute z-10 h-[570px] object-cover sm:h-auto"
          src={capsules}
          alt="capsules"
        />
        <Image
          id="bg"
          className="absolute h-[570px] object-cover sm:h-auto"
          src={small_capsules}
          alt="capsules"
        />
        <Image
          id="bg"
          className="absolute h-[570px] object-cover sm:h-auto"
          src={leaves}
          alt="capsules"
        />
        <div className="relative z-10 flex">
          <Image
            id="boy"
            className="absolute h-[570px] object-cover sm:h-auto"
            src={boy}
            alt="boy"
          />
          <Image id="girl" className="h-[570px] object-cover sm:h-auto" src={girl} alt="girl" />
          <Image
            id="fox"
            className="absolute h-[570px] object-cover sm:h-auto"
            src={fox}
            alt="fox"
          />
        </div>
      </div>
      <Features ref={ref} articles={articles} lang={lang} />
    </section>
  );
}
