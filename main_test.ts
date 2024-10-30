// deno-lint-ignore-file no-explicit-any
import { assertSpyCalls, spy } from "https://deno.land/std@0.203.0/testing/mock.ts";

import { assertEquals } from "jsr:@std/assert";
import { expect } from "jsr:@std/expect";
import { getAllTodos } from "./controllers/todo.controller.ts";

// Mock de l'objet ctx
function createMockContext() {
    return {
        response: {
            body: null,
            status: null,
        },
    };
}

Deno.test("getAllTodos should return all todos", async () => {
    // Mock manuel de la fonction getTodos
    const mockTodos = [
        { id: 1, title: "Todo 1", is_completed: false },
        { id: 2, title: "Todo 2", is_completed: true },
    ];

    const mockGetTodos = () => Promise.resolve(mockTodos);

    const ctx = createMockContext();

    // Appel de la fonction avec le mock passé en paramètre
    await getAllTodos(ctx as any, mockGetTodos);

    // Vérifications
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, mockTodos);
});


Deno.test("getAllTodos should return an empty array when no todos are found", async () => {
    // Mock manuel de la fonction getTodos pour renvoyer un tableau vide
    const mockGetTodos = () => Promise.resolve([]); // Aucun todo trouvé
    const ctx = createMockContext();

    // Appel de la fonction avec le mock passé en paramètre
    await getAllTodos(ctx as any, mockGetTodos);
    spy(getAllTodos)
    // Vérifications
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, []); // Vérifie que la réponse est un tableau vide
});

Deno.test("getAllTodos should return an error if something goes wrong", async () => {
    // Mock manuel de la fonction getTodos pour simuler une erreur
    const mockGetTodos = () => Promise.reject(new Error("Database error")); // Simule une erreur
    const ctx = createMockContext();

    // Appel de la fonction avec le mock passé en paramètre
    await getAllTodos(ctx as any, mockGetTodos);
    spy(getAllTodos)
    // Vérifications
    assertEquals(ctx.response.status, 400); // Vérifie que le statut est une erreur (400)

});