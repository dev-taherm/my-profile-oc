"use client";

import Image from "next/image";
import { useState } from "react";

interface ProfileImageProps {
  className?: string;
  priority?: boolean;
}

export function ProfileImage({ className, priority }: ProfileImageProps) {
  const [imgSrc, setImgSrc] = useState("/images/profile.jpg");

  return (
    <Image
      src={imgSrc}
      alt="Taher Mahram"
      fill
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 256px, 320px"
      onError={() => setImgSrc("/images/profile.svg")}
    />
  );
}
