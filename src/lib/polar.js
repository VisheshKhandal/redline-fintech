import "server-only";
import { createPolarCore } from "@polar-sh/sdk/2026-10";

// Better Auth's Polar plugin calls SDK service functions with a core client.
// createPolar() exposes convenience services but has no buildRequest method.
export const polarClient = createPolarCore({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  environment: "sandbox",
});
