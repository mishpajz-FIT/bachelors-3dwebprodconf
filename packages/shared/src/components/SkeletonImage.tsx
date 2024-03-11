import { useState } from "react";

interface SkeletonImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const SkeletonImage = ({ src, alt, className }: SkeletonImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  throw new Error("Demo error!");

  if (imageError) {
    return (
      <div className={`${className} shrink-0 bg-gray-300 dark:bg-gray-600`} />
    );
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} transition-all duration-300 ease-in-out ${imageLoaded ? "opacity-100" : "opacity-0"} object-cover`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{
          display: imageLoaded ? "block" : "none",
        }}
      />
      {!imageLoaded && (
        <div
          className={`${className} shrink-0 animate-pulse rounded bg-gray-300 dark:bg-gray-600`}
        />
      )}
    </>
  );
};
