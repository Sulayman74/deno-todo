
export interface Todo {
    id: number;        // L'identifiant unique du todo
    is_completed: boolean;  // Indicateur d'état
    title: string;     // Le titre du todo
    userid: number;
}