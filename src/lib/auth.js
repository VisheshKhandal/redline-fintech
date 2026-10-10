import { betterAuth } from "better-auth";
import { db } from "./db.js";
import {
  polar,
  checkout,
  portal,
  webhooks,
} from "@polar-sh/better-auth";
import { polarClient } from "@/lib/polar";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { reconcileBillingEvent } from "./billing";
import { REDLINE_PRO_PRODUCT_ID } from "./billing-core.mjs";
export const auth = betterAuth({

  // ... your configuration options here
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
      polar({
        client: polarClient,

        createCustomerOnSignUp: true,

        use: [
          checkout({
            products: [
              {
                productId:
                  REDLINE_PRO_PRODUCT_ID,
                slug: "redline-pro",
              },
            ],

            successUrl: "/dashboard?checkout=success",
            returnUrl: "/dashboard",
            authenticatedUsersOnly: true,
            theme: "dark",
          }),

          portal(),
          webhooks({
            secret: process.env.POLAR_WEBHOOK_SECRET,
            onSubscriptionActive: reconcileBillingEvent,
            onSubscriptionUpdated: reconcileBillingEvent,
            onSubscriptionCanceled: reconcileBillingEvent,
            onSubscriptionRevoked: reconcileBillingEvent,
            onSubscriptionPastDue: reconcileBillingEvent,
            onSubscriptionUncanceled: reconcileBillingEvent,
            onCustomerStateChanged: reconcileBillingEvent,
          }),
        ],
      }),
    ],
});



