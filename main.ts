import "jsr:@std/dotenv/load";

import { todoRouter, userRouter } from "./routes/routes.ts";

import { Application } from "./deps.ts";
import { connectDB } from "./services/db.ts";

const port = Number(Deno.env.get("PORT")) || 8080
const app = new Application();

// Connexion à la base de données
// await createTable();
await connectDB();

// Routes
app.use(userRouter.routes())
app.use(todoRouter.routes());
app.use(userRouter.allowedMethods(), todoRouter.allowedMethods())

console.log(`Server running on http://localhost:${port}`);
await app.listen({ port: port });