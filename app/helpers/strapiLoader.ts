export async function strapiLoader<ResponseType>(endpoint: string, qs?: string) {
  const baseUrl = process.env.STRAPI_BASE_URL;
  if (!baseUrl) throw new Error("STRAPI_API_URL is not defined");

  const url = `${baseUrl}/api${endpoint}?${qs}`;
  const rawResponse = await fetch(url, {
    // headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
  });
  const response = (await rawResponse.json()) as ResponseType;

  return {
    apiData: response,
    imageUrlPrefix: process.env.STRAPI_HOSTED_IMAGES ? baseUrl : "",
  };
}
