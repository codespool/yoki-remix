import { YokiContractConfig } from "../contract/config";
import { useGachaTokenBalances } from "../providers/GachaTokenProvider";
import { useGachaTokenMint } from "../hooks/useGachaTokenMint";

const {
  tokens: { mojoYokiToken, passionYokiToken, wisdomYokiToken },
} = YokiContractConfig;

import { TokenMetadata } from "../routes/_layout.baths";

const EvolvedYoki = ({
  tokenMetadata,
  imageUrlPrefix,
}: { tokenMetadata: TokenMetadata; imageUrlPrefix: string }) => {
  const {
    baseYokiBalance,
    capsuleBalance,
    mojoYokiBalance,
    omaBalance,
    passionYokiBalance,
    wisdomYokiBalance,
  } = useGachaTokenBalances();

  const {
    mintWithSignature,
    isMintLoading,
    isMintDisabled,
    mintData,
    isMintSuccess,
    isMintWriteError,
    mintWriteError,
  } = useGachaTokenMint(mojoYokiToken.id, [
    baseYokiBalance.refetch,
    omaBalance.refetch,
    capsuleBalance.refetch,
    mojoYokiBalance.refetch,
    passionYokiBalance.refetch,
    wisdomYokiBalance.refetch,
  ]);
  const mojoYokiImage = tokenMetadata?.data?.images.find(
    (image) => image.token_id === mojoYokiToken.id,
  )?.token_image;

  const passionYokiImage = tokenMetadata?.data?.images.find(
    (image) => image.token_id === passionYokiToken.id,
  )?.token_image;

  const wisdomYokiImage = tokenMetadata?.data?.images.find(
    (image) => image.token_id === wisdomYokiToken.id,
  )?.token_image;

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex flex-col items-center align-middle">
        <p className="">
          Mojo Yoki tokens:{" "}
          {mojoYokiBalance.isLoading ? "Loading..." : mojoYokiBalance.data?.toString() || "?"}
        </p>
        <div className="w-1/3">
          <img src={`${imageUrlPrefix}${mojoYokiImage?.url}`} alt={`${mojoYokiImage?.name}`} />
        </div>
      </div>
      <div className="flex flex-col items-center align-middle">
        <p className="">
          Passion Yoki tokens:{" "}
          {passionYokiBalance.isLoading ? "Loading..." : passionYokiBalance.data?.toString() || "?"}
        </p>
        <div className="w-1/3">
          <img
            src={`${imageUrlPrefix}${passionYokiImage?.url}`}
            alt={`${passionYokiImage?.name}`}
          />
        </div>
      </div>
      <div className="flex flex-col items-center align-middle">
        <p className="">
          Wisdom Yoki tokens:{" "}
          {wisdomYokiBalance.isLoading ? "Loading..." : wisdomYokiBalance.data?.toString() || "?"}
        </p>
        <div className="w-1/3">
          <img src={`${imageUrlPrefix}${wisdomYokiImage?.url}`} alt={`${wisdomYokiImage?.name}`} />
        </div>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        disabled={isMintDisabled}
        onClick={mintWithSignature}
      >
        {isMintLoading ? "Evolving YOKI..." : "Evolve"}
      </button>

      <div className="text-red-500 text-s italic">{isMintWriteError && mintWriteError}</div>
      {isMintSuccess && (
        <div>
          Successfully Evolved Yoki!
          <div>
            <a href={`https://zkatana.blockscout.com/tx/${mintData?.hash}`}>BlockExplorer</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvolvedYoki;
