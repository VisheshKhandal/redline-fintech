import { SITE_URL } from "@/lib/seo";
export default function sitemap() {
  return ["/login", "/signup"].map((path) => ({ url: `${SITE_URL}${path}` }));
}
