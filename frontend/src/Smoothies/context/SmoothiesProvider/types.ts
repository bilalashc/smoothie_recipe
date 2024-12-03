
interface IngredientDetails {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SmoothieIngredient {
    smoothieId: string;
    ingredientId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    ingredient: IngredientDetails;
  }

  interface TagDetails {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SmoothieTag {
    smoothieId: string;
    tagId: string;
    createdAt: string;
    tag: TagDetails;
  }
  
  export interface Smoothie {
    id: string;
    name: string;
    ingredients: SmoothieIngredient[];
    tags: SmoothieTag[];
    createdAt: string;
    updatedAt: string;
  }