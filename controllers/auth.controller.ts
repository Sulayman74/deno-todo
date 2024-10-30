import { RouterContext, compare, create, getNumericDate } from "../deps.ts";

import { findUserByEmail } from "../services/users.ts";

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

// Maintenant tu peux utiliser secretKey pour signer ou vérifier les JWT

export const login = async (ctx: RouterContext<string, Record<string, string>, Record<string, null>>) => {
    try {
        // Extraire email et password du body
        const { email, password } = await ctx.request.body().value;

        // Trouver l'utilisateur par email
        const user = await findUserByEmail(email);
        if (!user) {
            ctx.response.status = 401;
            ctx.response.body = { message: "Credentials incorrect" };
            return;
        }

        // Comparer le mot de passe avec celui stocké dans la BDD
        const passwordMatches = await compare(password, user.password);
        if (!passwordMatches) {
            ctx.response.status = 401;
            ctx.response.body = { message: "Credentials incorrect" };
            return;
        }

        // Créer un token JWT
        const jwt = await create(
            { alg: "HS256", typ: "JWT" },
            {
                id: user.id,
                email: user.email,
                exp: getNumericDate(60 * 60) // Expire dans 1 heure
            },
            secretKey
        );

        // Envoyer la réponse avec le token JWT
        ctx.response.status = 200;
        ctx.response.body = { message: "Login réussi", token: jwt };
    } catch (error) {
        ctx.response.status = 500;
        if (error instanceof Error) {

            ctx.response.body = { error: error.message };
        } else {
            ctx.response.status = 400;
            ctx.response.body = { message: "Erreur inconnue" };

        }
    }
};