import { fetchAPI } from "@/lib/fetch-api";

import Home from "@/components/Home";
import NoSsr from "@/components/NoSsr";

type HomeData = {
  data: {
    articles: Article[];
  };
};

export type Article = {
  title: string;
  content: string;
};

async function getHome(lang: string): Promise<HomeData> {
  const path = "/landing-page";
  const urlParams = {
    populate: ["articles"],
    locale: lang,
  };
  return await fetchAPI(path, urlParams);
}

export default async function App({
  params,
}: {
  params: { lang: string };
}) {
  const { data } = await getHome(params.lang);
  return (
    <section>
      <Home articles={data.articles} lang={params.lang} />
    </section>
  );
}
