// config.d.ts

declare module 'tiktok-scraper' {
  interface TikTokScraper {
    user(): Promise<any>;
  }
  export const TikTokScraper: TikTokScraper;
}
