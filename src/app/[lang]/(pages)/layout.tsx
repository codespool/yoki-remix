export default async function PageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <div className="flex flex-col w-full">
      {/* TOP NAV*/}
      <div className="h-24 flex justify-end z-50">
        <div>
          <p>Top Nav</p>
        </div>
      </div>
      <div className="flex">
        {/* LEFT NAV */}
        <div className="w-24">left nav</div>
        {/* MAIN CONTENT */}
        <div>{children}</div>
      </div>
    </div>
  );
}
