import { TokenMetadata } from "~/routes/_layout.baths";
import { YokiContractConfig } from "../contract/config";
import { useGachaTokenMint } from "../hooks/useGachaTokenMint";
import { useGachaTokenBalance } from "../hooks/useGachaTokenBalance";

const {
  tokens: { capsuleToken },
} = YokiContractConfig;

export const Capsule = ({
  showButton = true,
  imageSize = "w-1/2",
  tokenMetadata,
  imageUrlPrefix,
}: {
  showButton: boolean;
  imageSize: string;
  tokenMetadata: TokenMetadata;
  imageUrlPrefix: string;
}) => {
  const { tokenBalance, refetchBalance, isBalanceLoading } = useGachaTokenBalance(capsuleToken.id);
  const { mintWithSignature, isMintLoading, isMintDisabled } = useGachaTokenMint(capsuleToken.id, [
    refetchBalance,
  ]);

  const tokenImage = tokenMetadata?.data?.images.find(
    (image) => image.token_id === capsuleToken.id,
  )?.token_image;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {showButton && (
        <button
          className="bg-blue-700 hover:bg-blue-500 opacity-100 bg-opacity-100 text-white font-bold py-5 px-8 rounded transition-colors duration-300"
          disabled={isMintDisabled}
          onClick={mintWithSignature}
        >
          {isMintLoading ? "Minting CAPSULE..." : "Mint Capsule"}
        </button>
      )}
      <div className="flex flex-col items-center align-middle">
        <p className="">
          Capsule tokens: {isBalanceLoading ? "Loading..." : tokenBalance?.toString() || "?"}
        </p>
        <div className={`${imageSize ?? ""}`}>
          <img src={`${imageUrlPrefix}${tokenImage?.url}`} alt={`${tokenImage?.name}`} />
        </div>
      </div>
    </div>
  );
};
