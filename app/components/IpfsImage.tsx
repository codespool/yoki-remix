import React, { useEffect, useState } from 'react';

const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
type IpfsLink = string;

const IpfsImage = ({ ipfsLink }: { ipfsLink: string }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      const ipfsJsonUrl = `${IPFS_GATEWAY}${ipfsLink}`;
      const response = await fetch(ipfsJsonUrl);
      const data = await response.json();
      const imageLink = data.image.slice(7);
      setImageUrl(`${IPFS_GATEWAY}${imageLink}`);
    };

    fetchImage();
  }, []);

  return (
    <div>
      {imageUrl && <img src={imageUrl} alt="From IPFS" />}
    </div>
  );
};

export default IpfsImage;