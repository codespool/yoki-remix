import { YokiContractConfig } from "../contract/config";
import { TokenMetadata } from "~/routes/_layout.baths";
import { useGachaTokenBalances } from "~/providers/GachaTokenProvider";
import { useGachaTokenMint } from "~/hooks/useGachaTokenMint";

const {
  tokens: { baseYokiToken },
} = YokiContractConfig;

const BaseYoki = ({
  tokenMetadata,
  imageUrlPrefix,
}: { tokenMetadata: TokenMetadata; imageUrlPrefix: string }) => {
  const { baseYokiBalance, omaBalance, capsuleBalance } = useGachaTokenBalances();
  const { mintWithSignature, isMintLoading, isMintDisabled, isMintWriteError, mintWriteError } =
    useGachaTokenMint(baseYokiToken.id, [
      baseYokiBalance.refetch,
      omaBalance.refetch,
      capsuleBalance.refetch,
    ]);
  const tokenImage = tokenMetadata?.data?.images.find(
    (image) => image.token_id === baseYokiToken.id,
  )?.token_image;

  return (
    <div className="flex flex-col justify-start items-center w-full">
      <div className="flex flex-col items-center align-middle">
        <p className="">{`Base Yoki tokens: ${
          baseYokiBalance.isLoading ? "Loading..." : baseYokiBalance.data?.toString() || "?"
        }`}</p>
        <div className="w-1/2">
          <img src={`${imageUrlPrefix}${tokenImage?.url}`} alt={`${tokenImage?.name}`} />
        </div>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={isMintDisabled}
        onClick={mintWithSignature}
      >
        {isMintLoading ? "Minting YOKI..." : "Open Capsule"}
      </button>
      <div className="text-red-500 text-s italic">{isMintWriteError && mintWriteError}</div>
    </div>
  );
};

export default BaseYoki;
