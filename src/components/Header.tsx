"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X, Play } from "lucide-react";
import { useSearchDramas } from "@/hooks/useDramas";
import { useReelShortSearch } from "@/hooks/useReelShort";
import { useNetShortSearch } from "@/hooks/useNetShort";
import { useMeloloSearch } from "@/hooks/useMelolo";
import { useFlickReelsSearch } from "@/hooks/useFlickReels";
import { useFreeReelsSearch } from "@/hooks/useFreeReels";
import { usePlatform } from "@/hooks/usePlatform";
import { useDebounce } from "@/hooks/useDebounce";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const normalizedQuery = debouncedQuery.trim();

  const {
    isDramaBox,
    isReelShort,
    isNetShort,
    isMelolo,
    isFlickReels,
    isFreeReels,
    platformInfo,
  } = usePlatform();

  const { data: dramaBoxResults, isLoading: isSearchingDramaBox } =
    useSearchDramas(isDramaBox ? normalizedQuery : "");

  const { data: reelShortResults, isLoading: isSearchingReelShort } =
    useReelShortSearch(isReelShort ? normalizedQuery : "");

  const { data: netShortResults, isLoading: isSearchingNetShort } =
    useNetShortSearch(isNetShort ? normalizedQuery : "");

  const { data: meloloResults, isLoading: isSearchingMelolo } =
    useMeloloSearch(isMelolo ? normalizedQuery : "");

  const { data: flickReelsResults, isLoading: isSearchingFlickReels } =
    useFlickReelsSearch(isFlickReels ? normalizedQuery : "");

  const { data: freeReelsResults, isLoading: isSearchingFreeReels } =
    useFreeReelsSearch(isFreeReels ? normalizedQuery : "");

  const isSearching = isDramaBox
    ? isSearchingDramaBox
    : isReelShort
    ? isSearchingReelShort
    : isNetShort
    ? isSearchingNetShort
    : isMelolo
    ? isSearchingMelolo
    : isFlickReels
    ? isSearchingFlickReels
    : isSearchingFreeReels;

  const searchResults = isDramaBox
    ? dramaBoxResults
    : isReelShort
    ? reelShortResults?.data
    : isNetShort
    ? netShortResults?.data
    : isMelolo
    ? meloloResults?.data?.search_data
        ?.flatMap((item: any) => item.books || [])
        .filter((book: any) => book.thumb_url && book.thumb_url !== "") || []
    : isFlickReels
    ? flickReelsResults?.data
    : freeReelsResults;

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Sembunyikan header di halaman /watch
  if (pathname?.startsWith("/watch")) {
    return null;
  }

  // === TITLE HEADER DINAMIS (UI) ===
  const headerTitle = normalizedQuery
    ? `${normalizedQuery} — ${platformInfo?.name || "Dracin-Luc"}`
    : platformInfo?.name
    ? `Dracin-Luc — ${platformInfo.name}`
    : "Dracin-Luc";

  // === SEO META (tetap seperti punyamu, hanya dirapikan) ===
  useEffect(() => {
    const siteTitle = "Dracin-Luc";

    const title = normalizedQuery
      ? `${normalizedQuery} — ${platformInfo?.name || siteTitle}`
      : platformInfo?.name
      ? `${siteTitle} — ${platformInfo.name}`
      : siteTitle;

    document.title = title;

    const description =
      platformInfo?.description ||
      `Temukan drama dan short videos di ${
        platformInfo?.name || "Dracin"
      }.`;

    const image =
      platformInfo?.ogImage || platformInfo?.logo || "/og-default.png";

    const setTag = (
      attrName: string,
      attrValue: string,
      content: string
    ) => {
      let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setTag("name", "description", description);
    setTag("property", "og:title", title);
    setTag("property", "og:description", description);
    setTag("property", "og:image", image);
    setTag("property", "og:type", "website");
    setTag("property", "og:url", window.location.href);

    setTag("name", "twitter:card", "summary_large_image");
    setTag("name", "twitter:title", title);
    setTag("name", "twitter:description", description);
    setTag("name", "twitter:image", image);

    let linkCanonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.rel = "canonical";
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = window.location.href;

    const ldId = "dracin-jsonld";
    let ld = document.getElementById(ldId) as HTMLScriptElement | null;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Dracin-Luc",
      url: window.location.origin,
      description,
      publisher: {
        "@type": "Organization",
        name: siteTitle,
        logo: {
          "@type": "ImageObject",
          url: image,
        },
      },
    };

    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = ldId;
      document.head.appendChild(ld);
    }

    ld.text = JSON.stringify(jsonLd);
  }, [platformInfo, normalizedQuery]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* === LOGO + TITLE + DESKRIPSI DINAMIS === */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-xl gradient-text">
                {headerTitle}
              </span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {platformInfo?.description ||
                  `Temukan drama dan short videos di ${
                    platformInfo?.name || "Dracin"
                  }`}
              </span>
            </div>
          </Link>

          {/* Search Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* === SEARCH OVERLAY (tetap sama seperti punyamu) === */}
      {searchOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-background z-[9999] overflow-hidden">
            <div className="container mx-auto px-4 py-6 h-[100dvh] flex flex-col">
              <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                <div className="flex-1 relative min-w-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Cari drama di ${platformInfo.name}...`}
                    className="search-input pl-12"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleSearchClose}
                  className="p-3 rounded-xl hover:bg-muted/50 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Mencari di:</span>
                <span className="px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                  {platformInfo.name}
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                {isSearching && normalizedQuery && (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {searchResults &&
                  searchResults.length === 0 &&
                  normalizedQuery && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Tidak ada hasil untuk "{normalizedQuery}" di{" "}
                        {platformInfo.name}
                      </p>
                    </div>
                  )}

                {!normalizedQuery && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Ketik untuk mencari drama di {platformInfo.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}