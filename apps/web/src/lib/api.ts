import {
  Article,
  Video,
  Opinion,
  TeamMember,
  Stock,
  mockArticles,
  mockVideos,
  mockOpinions,
  mockTeam,
  mockStocks
} from "./mock-data";

export type { Article, Video, Opinion, TeamMember, Stock };

/**
 * Fetches all articles or articles filtered by category.
 */
export async function getArticles(category?: string): Promise<Article[]> {
  return new Promise((resolve) => {
    if (!category) {
      resolve(mockArticles);
    } else {
      resolve(mockArticles.filter((art) => art.category === category));
    }
  });
}

/**
 * Fetches a single article by its unique slug.
 */
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return new Promise((resolve) => {
    resolve(mockArticles.find((art) => art.slug === slug));
  });
}

/**
 * Fetches related articles excluding the active article.
 */
export async function getRelatedArticles(
  slug: string,
  category: string,
  limit = 4
): Promise<Article[]> {
  return new Promise((resolve) => {
    resolve(
      mockArticles
        .filter((art) => art.slug !== slug && art.category === category)
        .slice(0, limit)
    );
  });
}

/**
 * Fetches videos, optionally filtered by category.
 */
export async function getVideos(category?: string): Promise<Video[]> {
  return new Promise((resolve) => {
    if (!category || category === "all") {
      resolve(mockVideos);
    } else {
      resolve(mockVideos.filter((vid) => vid.category === category));
    }
  });
}

/**
 * Fetches opinion columns.
 */
export async function getOpinions(): Promise<Opinion[]> {
  return new Promise((resolve) => {
    resolve(mockOpinions);
  });
}

/**
 * Fetches publisher and editorial team listings.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  return new Promise((resolve) => {
    resolve(mockTeam);
  });
}

/**
 * Fetches live stock ticker details.
 */
export async function getStocks(): Promise<Stock[]> {
  return new Promise((resolve) => {
    resolve(mockStocks);
  });
}
