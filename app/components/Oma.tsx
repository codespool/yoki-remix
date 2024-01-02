import { useGachaTokenMint } from "../hooks/useGachaTokenMint";
import { useGachaTokenBalance } from "../hooks/useGachaTokenBalance";
import { TokenMetadata } from "../routes/_layout.baths";
import { YokiContractConfig } from "~/contract/config";

const {
  tokens: { omaToken },
} = YokiContractConfig;

export const Oma = ({
  showButton = true,
  imageSize,
  tokenMetadata,
  imageUrlPrefix,
}: {
  showButton: boolean;
  imageSize: string | null;
  tokenMetadata: TokenMetadata;
  imageUrlPrefix: string;
}) => {
  const { tokenBalance, refetchBalance, isBalanceLoading } = useGachaTokenBalance(omaToken.id);
  const { mintWithSignature, isMintLoading, isMintDisabled } = useGachaTokenMint(omaToken.id, [
    refetchBalance,
  ]);

  const tokenImage = tokenMetadata?.data?.images.find(
    (image) => image.token_id === omaToken.id,
  )?.token_image;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {showButton && (
        <button
          className="bg-blue-700 hover:bg-blue-500 opacity-100 bg-opacity-100 text-white font-bold py-5 px-8 rounded transition-colors duration-300"
          disabled={isMintDisabled}
          onClick={mintWithSignature}
        >
          {isMintLoading ? "Minting OMA..." : "Mint OMA"}
        </button>
      )}

      <div className="flex flex-col items-center align-middle">
        <p className="">
          Oma tokens: {isBalanceLoading ? "Loading..." : tokenBalance?.toString() || "?"}
        </p>
        <div className={`${imageSize ?? ""} bg-white rounded-full border border-slate-500`}>
          <img src={`${imageUrlPrefix}${tokenImage?.url}`} alt={`${tokenImage?.name}`} />
        </div>
      </div>
    </div>
  );
};
