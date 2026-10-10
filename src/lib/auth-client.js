import { createAuthClient } from "better-auth/react"
import { polarClient } from "@polar-sh/better-auth/client";
// Use the current origin so OAuth and sessions also work outside localhost.
export const authClient = createAuthClient({
    plugins: [
        polarClient(),
    ],
    
})

