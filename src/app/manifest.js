export default function manifest() {
  return {
    id: "/", name: "Redline — Financial Intelligence, In Focus.", short_name: "Redline",
    description: "Financial analytics and portfolio exploration with clearly labeled illustrative market data.",
    lang: "en", start_url: "/login", scope: "/", display: "standalone",
    background_color: "#08090C", theme_color: "#08090C", categories: ["finance", "business"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
