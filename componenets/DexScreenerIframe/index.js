import React from "react";

const DexScreenerIframe = ({ contractAddress }) => {
  const iframeUrl = `https://dexscreener.com/solana/${contractAddress}`;

  return (
    <iframe
      src={iframeUrl}
      title="DexScreener"
      width="100%"
      height="600px"
      style={{ border: "none" }}
    />
  );
};

export default DexScreenerIframe;
