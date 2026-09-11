import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "Agoston Fung",
  DESCRIPTION: "Notes on engineering, AI, and the people writing it.",
  EMAIL: "agoston.fung@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 6,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Notes on engineering, AI, and the people writing it.",
};

export const ARTICLES: Metadata = {
  TITLE: "Articles",
  DESCRIPTION: "Long-form writing on engineering, AI, and the craft.",
};

export const POSTS: Metadata = {
  TITLE: "Posts",
  DESCRIPTION: "Short notes and observations.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "Things I've built, shipped, or published.",
};

export const SOCIALS: Socials = [
  { NAME: "GitHub", HREF: "https://github.com/eshton" },
  { NAME: "LinkedIn", HREF: "https://www.linkedin.com/in/agostonfung" },
];
