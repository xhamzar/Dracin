"use client";

import { create } from "zustand";

export type Platform = "dramabox" | "reelshort" | "netshort" | "melolo" | "flickreels" | "freereels";

export interface PlatformInfo {
  id: Platform;
  name: string;
  description: string;
  logo: string;
  ogImage: string;
  apiBase: string;
}

export const PLATFORMS: PlatformInfo[] = [
  {
    id: "dramabox",
    name: "DramaBox",
    description: "Nonton drama pendek terbaik dari DramaBox.",
    logo: "/dramabox.webp",
    ogImage: "/dramabox.webp",
    apiBase: "/api/dramabox",
  },
  {
    id: "reelshort",
    name: "ReelShort",
    description: "Nonton drama pendek eksklusif dari ReelShort.",
    logo: "/reelshort.webp",
    ogImage: "/reelshort.webp",
    apiBase: "/api/reelshort",
  },
  {
    id: "netshort",
    name: "NetShort",
    description: "Nikmati koleksi drama vertical dari NetShort.",
    logo: "/netshort.webp",
    ogImage: "/netshort.webp",
    apiBase: "/api/netshort",
  },
  {
    id: "melolo",
    name: "Melolo",
    description: "Streaming drama pendek populer dari Melolo.",
    logo: "/melolo.webp",
    ogImage: "/melolo.webp",
    apiBase: "/api/melolo",
  },
  {
    id: "flickreels",
    name: "FlickReels",
    description: "Tonton video pendek berkualitas di FlickReels.",
    logo: "/flickreels.png",
    ogImage: "/flickreels.png",
    apiBase: "/api/flickreels",
  },
  {
    id: "freereels",
    name: "FreeReels",
    description: "Streaming drama pendek gratis di FreeReels.",
    logo: "/freereels.webp",
    ogImage: "/freereels.webp",
    apiBase: "/api/freereels",
  },
];

interface PlatformState {
  currentPlatform: Platform;
  setPlatform: (platform: Platform) => void;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  currentPlatform: "dramabox",
  setPlatform: (platform) => set({ currentPlatform: platform }),
}));

export function usePlatform() {
  const { currentPlatform, setPlatform } = usePlatformStore();
  const platformInfo = PLATFORMS.find((p) => p.id === currentPlatform)!;

  const getPlatformInfo = (platformId: Platform) => {
    return PLATFORMS.find((p) => p.id === platformId) || PLATFORMS[0];
  };

  return {
    currentPlatform,
    platformInfo,
    setPlatform,
    platforms: PLATFORMS,
    getPlatformInfo,
    isDramaBox: currentPlatform === "dramabox",
    isReelShort: currentPlatform === "reelshort",
    isNetShort: currentPlatform === "netshort",
    isMelolo: currentPlatform === "melolo",
    isFlickReels: currentPlatform === "flickreels",
    isFreeReels: currentPlatform === "freereels",
  };
}
