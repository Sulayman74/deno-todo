import { Todo } from "./interfaces/todo.model.ts";
import { client } from "./db.ts";

export async function getTodos(): Promise<Todo[]> {
    const result = await client.queryObject<Todo>("SELECT id, title, is_completed, userId FROM todos;");
    return result.rows
}

export const getTodosByUserId = async (userid: number): Promise<Todo[]> => {
    const result = await client.queryObject<Todo>(
        "SELECT * FROM todos WHERE userid = $1 ORDER BY id ASC",
        [userid]
    );
    console.log(userid);
    return result.rows; // Retourne les todos trouvés
};
export const createTodo = async (title: string, userid: number): Promise<Todo> => {
    const result = await client.queryObject<Todo>(
        "INSERT INTO todos (title, userid) VALUES ($1, $2) RETURNING *",
        [title, userid]
    );
    return result.rows[0];
};

export async function getTodosById(id: number): Promise<Todo> {
    const result = await client.queryObject<Todo>("SELECT id, title, is_completed, userId FROM todos WHERE id = $1;", [id]);
    return result.rows[0];
}

export async function deleteTodo(id: number): Promise<void> {
    await client.queryObject("DELETE FROM todos WHERE id = $1;", [id]);
}

export async function updateTodoStatusById(id: number, is_completed: boolean): Promise<Todo | null> {
    const result = await client.queryObject<Todo>(
        "UPDATE todos SET is_completed = $1 WHERE id = $2 RETURNING *;",
        [is_completed, id]
    );

    return result.rows[0] || null; // Retourner l'élément mis à jour ou null si non trouvé
}

export async function updateTodoTitleById(id: number, title: string): Promise<Todo | null> {
    const result = await client.queryObject<Todo>(
        "UPDATE todos SET title = $1 WHERE id = $2 RETURNING *;",
        [title, id]
    );

    return result.rows[0] || null; // Retourner l'élément mis à jour ou null si non trouvé
}