"use client";

import Image from "next/image";
import { useState } from "react";
import { type SiteProfileData } from "@/lib/profile";

interface ProfileImageProps {
  className?: string;
  priority?: boolean;
  profile?: SiteProfileData;
}

export function ProfileImage({ className, priority, profile }: ProfileImageProps) {
  const [imgSrc, setImgSrc] = useState("/images/profile.jpg");

  return (
    <Image
      src={imgSrc}
      alt={profile?.name || "Taher Mahram"}
      fill
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 256px, 320px"
      onError={() => setImgSrc("/images/profile.svg")}
    />
  );
}
