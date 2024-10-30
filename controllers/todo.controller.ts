import { createTodo, deleteTodo, getTodos, getTodosById, getTodosByUserId, updateTodoStatusById, updateTodoTitleById } from "../services/todos.ts";

import { RouterContext } from "../deps.ts";
import { Todo } from "../services/interfaces/todo.model.ts";
import type { User } from "../services/interfaces/user.model.ts";

export const getAllTodos = async (
    ctx: RouterContext<string, Record<string, string>, Record<string, null>>
) => {
    try {
        const todos: Todo[] = await getTodos();
        ctx.response.body = { message: "Liste de tous les todos", todos }
        ctx.response.status = 200;

    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Erreur lors de la récupération des todos", error };
    }
};

export const getAllTodosByUserId = async (ctx: RouterContext<string, Record<string, string>, Record<string, User>>) => {
    try {
        const userid = ctx.state.user.id; // Récupérer l'ID de l'utilisateur connecté

        // Récupérer les todos associés à cet utilisateur
        const todos = await getTodosByUserId(userid);

        ctx.response.body = todos; // Retourner les todos
        console.log(userid);
        ctx.response.status = 200;
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur lors de la récupération des todos", error };
    }
};

export const getOneTodo = async (ctx: RouterContext<string, Record<string, string>, Record<string, null>>) => {

    try {
        const id = Number(ctx.params.id); // Conversion en nombre
        if (isNaN(id)) { // Vérifier si l'id est un nombre valide
            ctx.response.status = 400;
            ctx.response.body = { message: "ID invalide" };
            return;
        }

        const todo = await getTodosById(id); // Récupérer le todo par ID
        if (!todo) { // Si aucun todo trouvé
            ctx.response.status = 404;
            ctx.response.body = { message: "Todo non trouvé" };
            return;
        }

        // Destructuring de l'objet todo
        const { id: todoId, title, is_completed, userid } = todo;

        // Tu peux maintenant utiliser directement ces variables
        ctx.response.body = { message: `La todo id : ${todoId} `, title, is_completed, userid };
        ctx.response.status = 200;


    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Erreur lors de la récupération des todos", error };
    }
}

export const addTodo = async (ctx: RouterContext<string, Record<string, string>, Record<string, User>>) => {

    try {
        // Extraire les données de la requête
        const { title } = await ctx.request.body().value;
        const userid = ctx.state.user.id
        console.log(userid);
        // Vérifier que le titre n'est pas vide
        if (!title || title.trim() === "") {
            ctx.response.status = 400;
            ctx.response.body = { message: "Le titre du todo est requis" };
            return;
        }

        // Créer le nouveau todo
        const newTodo = await createTodo(title, userid);

        // Définir le statut de réponse et envoyer une réponse JSON
        ctx.response.status = 201;
        ctx.response.body = {
            message: "Todo ajouté avec succès",
            todo: newTodo, // Envoyer directement le nouvel objet todo
        };

    } catch (err: unknown) {
        // Gestion des erreurs et retour de réponse d'erreur
        if (err instanceof Error) {
            ctx.response.body = { message: "Erreur lors de l'ajout du todo", error: err.message };
            console.error("Erreur capturée :", err);
        } else {
            ctx.response.body = { message: "Erreur inconnue lors de l'ajout du todo" };
            console.error("Erreur inconnue :", err);
        }
        ctx.response.status = 500; // Indiquer une erreur serveur
    }
};

export const removeTodo = async (ctx: RouterContext<string, Record<string, string>, Record<string, null>>) => {

    try {
        const id = Number(ctx.params.id);

        // Vérifier si le todo existe
        const todo = await getTodosById(id);

        if (!todo) {
            // Si le todo n'existe pas, renvoyer un 404
            ctx.response.status = 404;
            ctx.response.body = { message: "Todo introuvable" };
            return;
        }

        // Si le todo existe, le supprimer
        await deleteTodo(id);

        // Retourner une réponse 204 No Content après suppression
        ctx.response.status = 204;
    } catch (error) {
        // Gestion des erreurs et envoi d'une réponse d'erreur
        if (error instanceof Error) {
            ctx.response.status = 500;
            ctx.response.body = { message: "Erreur lors de la suppression du todo", error: error.message };
            console.error("Erreur capturée :", error.name);
        } else {
            ctx.response.status = 400;
            ctx.response.body = { message: "Erreur inconnue" };
            console.error("Erreur inconnue :", error);
        }
    }

};

export const updateTodoStatus = async (ctx: RouterContext<string, Record<string, string>, Record<string, null>>) => {
    try {
        const id = Number(ctx.params.id);

        // Vérifier si l'id est valide
        if (isNaN(id)) {
            ctx.response.status = 400;
            ctx.response.body = { message: "ID invalide" };
            return;
        }

        // Extraire l'état 'is_completed' du body de la requête
        const { is_completed } = await ctx.request.body().value;

        // Vérifier que is_completed est bien un boolean
        if (typeof is_completed !== 'boolean') {
            ctx.response.status = 400;
            ctx.response.body = { message: "'is_completed' doit être un boolean (true ou false)" };
            return;
        }

        // Mettre à jour le todo
        const updatedTodo = await updateTodoStatusById(id, is_completed); // Fonction qui met à jour le todo en base de données

        // Vérifier si le todo existe
        if (!updatedTodo) {
            ctx.response.status = 404;
            ctx.response.body = { message: "Todo non trouvé" };
            return;
        }

        // Réponse de succès
        ctx.response.status = 200;
        ctx.response.body = { message: "Todo mis à jour avec succès", todo: updatedTodo };

    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur lors de la mise à jour du todo", error };
        console.error("Erreur lors de la mise à jour :", error);
    }
};

export const updateTodoTitle = async (ctx: RouterContext<string, Record<string, string>, Record<string, null>>) => {
    try {
        const id = Number(ctx.params.id);

        // Vérification de l'id
        if (isNaN(id)) {
            ctx.response.status = 400;
            ctx.response.body = { message: "ID invalide" };
            return;
        }

        // Extraire le nouveau titre du body de la requête
        const { title } = await ctx.request.body().value;

        // Vérifier que le titre n'est pas vide ou nul
        if (!title || title.trim() === "") {
            ctx.response.status = 400;
            ctx.response.body = { message: "Le titre ne peut pas être vide" };
            return;
        }

        // Mettre à jour le titre dans la base de données
        const updatedTodo = await updateTodoTitleById(id, title);

        // Vérifier si le todo existe
        if (!updatedTodo) {
            ctx.response.status = 404;
            ctx.response.body = { message: "Todo non trouvé" };
            return;
        }

        // Réponse de succès
        ctx.response.status = 200;
        ctx.response.body = { message: "Titre mis à jour avec succès", todo: updatedTodo };

    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur lors de la mise à jour du titre", error };
        console.error("Erreur lors de la mise à jour du titre :", error);
    }

}
