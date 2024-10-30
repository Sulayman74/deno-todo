import { User } from "./interfaces/user.model.ts";
import { client } from "./db.ts"; // Connexion à la BDD

export async function getUsers(): Promise<User[]> {
    const result = await client.queryObject<User>("SELECT * FROM users;");
    return result.rows
}

export const addUser = async (user: Partial<User>) => {
    const result = await client.queryObject<User>(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [user.username, user.email, user.password]
    );
    return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const result = await client.queryObject<User>("SELECT username, email, password FROM users WHERE email=$1", [email]);
    return result.rows.length ? result.rows[0] : null;
};

export const findAllUsers = async (): Promise<User[]> => {
    const result = await client.queryObject<User[]>("SELECT username, email, password FROM users");
    return result.rows[0];
}