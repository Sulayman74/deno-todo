import { RouterContext, getNumericDate } from "../deps.ts";
import {
    addUser,
    findAllUsers,
    findUserByEmail
} from "../services/users.ts";
import { create, hash } from "../deps.ts";

import type { User } from "../services/interfaces/user.model.ts";

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


export const signup = async (ctx: RouterContext<string>) => {
    try {
        const { username, email, password } = await ctx.request.body().value;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            ctx.response.status = 409;
            ctx.response.body = { message: "L'utilisateur existe déjà." };
            return;
        }

        // Validation : vérifier que tous les champs sont présents
        if (!username || !email || !password) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Tous les champs sont requis (username, email, password)." };
            return;
        }

        // Hacher le mot de passe
        const hashedPassword = await hash(password);

        // Ajouter l'utilisateur à la base de données
        const newUser = await addUser({ username, email, password: hashedPassword });
        console.log("nouvel utilisateur", newUser);
        // Après avoir validé les informations de connexion ou d'inscription
        const jwt = await create(
            { alg: "HS256", typ: "JWT" },
            { id: newUser.id, email: newUser.email, exp: getNumericDate(60 * 60) },  // JWT avec expiration de 1h
            secretKey
        );
        console.log("jwt token", jwt);
        console.log("Payload JWT :", { id: newUser.id, email: newUser.email, exp: getNumericDate(60 * 60) });
        ctx.response.status = 201;
        ctx.response.body = { message: "Utilisateur créé avec succès", user: newUser, token: jwt };
    } catch (error) {
        if (error instanceof Error) {
            ctx.response.body = {
                error: error.message
            }
        } else {
            ctx.response.body = { message: "Erreur lors de la création de l'utilisateur", error };
        }
        ctx.response.status = 500;
    }
};

export const getAllUsers = async (ctx: RouterContext<string, Record<string, string>, Record<string, null>>) => {
    try {
        const users: User[] = await findAllUsers()
        ctx.response.body = { message: "Liste de tous les utilisateurs", users }
        ctx.response.status = 200;

    } catch (error) {


        if (error instanceof Error) {
            ctx.response.body = {
                error: error.message
            }
        } else {
            ctx.response.body = { message: "Erreur lors de la récupération des utilisateurs", error };
        }
        ctx.response.status = 400;
    }

}