import { Link } from "../model/link";
import { Links } from "./core/links";

export const demoLinks = new Links([
  new Link(
    "https://google.com",
    ["search", "google"],
    "Google",
    "/demo/example1.jpg",
    "A search engine"
  ),
  new Link(
    "https://duckduckgo.com",
    ["search", "free"],
    "duckduckgo",
    "/demo/example1.jpg",
    "A search engine"
  ),
  new Link("https://news.ycombinator.com", ["news", "it", "programming"]),
  new Link("https://www.bluesnews.com/", ["news", "gaming"]),
  new Link("https://news.google.com/", ["news", "world"]),
  new Link("https://reddit.com/", ["news", "funny images", "social network"]),
  new Link("https://facebook.com/", ["social network"]),
]);
