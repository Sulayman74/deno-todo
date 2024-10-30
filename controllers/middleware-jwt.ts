import { RouterContext, verify } from "../deps.ts";

// Charger la clé depuis le fichier .env
const base64Key = Deno.env.get("SECRET_KEY");

// Décoder la clé base64 en tableau d'octets
const rawKey = Uint8Array.from(atob(base64Key!), (c) => c.charCodeAt(0));

// Importer la clé en tant que CryptoKey
const secretKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    {
        name: "HMAC",
        hash: { name: "SHA-256" },
    },
    true,
    ["sign", "verify"]
);

// Middleware pour vérifier le JWT
export const authMiddleware = async (ctx: RouterContext<string, Record<string, string>>, next: () => Promise<unknown>) => {
    const authorization = ctx.request.headers.get("Authorization");
    if (!authorization) {
        ctx.response.status = 401;
        ctx.response.body = { message: "Accès non autorisé" };
        return;
    }

    const jwt = authorization.split(" ")[1]; // Récupérer le token sans "Bearer"

    try {
        const payload = await verify(jwt, secretKey); // Vérifier la validité
        ctx.state.user = payload;
        console.log(payload);// Enregistrer les infos de l'utilisateur dans le contexte
        await next();  // Passer à la route suivante
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = { message: "Token invalide ou expiré", error };
    }
};