import { Article } from "@/app/[lang]/page";
import Link from "next/link";
import { forwardRef } from "react";

type Props = {
  articles: Article[];
  lang: string;
};

export const Features = forwardRef<HTMLDivElement, Props>(({ articles, lang }, ref) => {
  return (
    <div ref={ref} className="features pb-20 pt-10 sm:pt-1">
      <div className="mt-0 sm:-mt-20">
        <div className="flex gap-5 justify-center flex-col items-center mb-16 h-auto w-full sm:h-96 sm:flex-row sm:items-stretch">
          {articles.map((item) => (
            <div
              key={item.title}
              className="features-card flex flex-col items-start shrink-0 border border-solid border-white px-8 pt-8 pb-14 gap-6 w-80"
            >
              <h2 className="title">{item.title}</h2>
              <p className="content">{item.content}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/floors/countryside">
            <button className="enter-button">{lang === "ja" ? "入力" : "Enter"}</button>
          </Link>
        </div>
      </div>
    </div>
  );
});
