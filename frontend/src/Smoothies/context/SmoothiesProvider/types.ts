export interface Ingredient {
    id: string;
    name: string;
    quantity: string;
}

export interface Tag {
    id: string;
    name: string;
}

export interface Smoothie {
    id: string;
    name: string;
    ingredients: Ingredient[]
    tags: Tag[]
    createdAt: string;
    updatedAt: string;
}