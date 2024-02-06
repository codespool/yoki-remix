import astarLogo from "../../public/astar-logo.svg";

export type HeaderProps = {
  title?: string;
  isShowConnectButton?: boolean;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="fixed w-full h-18 z-[1]">
      <div className="flex h-full items-center justify-between py-3 px-3 sm:px-5">
        <img className="w-28 sm:w-36" src={astarLogo.src} alt="astar logo" />
        {title && (
          <div className="flex items-center justify-center fixed w-full top-16 left-0 sm:static sm:w-auto">
            <p className="text-xs font-semibold rounded-lg bg-black/50 border border-white/20 py-1 px-3 sm:py-2 sm:text-base">
              {title}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
