export interface Ingredient {
    id: string;
    name: string;
    quantity: string;
}

export interface Tag {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Smoothie {
  id: string;
  name: string;
  ingredients: SmoothieIngredient[];
  tags: SmoothieTag[];
  createdAt: string;
  updatedAt: string;
}

export interface SmoothieIngredient {
  smoothieId: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
  ingredient: IngredientDetails;
}


interface IngredientDetails {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SmoothieTag {
  smoothieId: string;
  tagId: string;
  createdAt: string;
  tag: Tag;
}

export interface CreateSmoothieInput {
    name: string;
    ingredients: {
      name: string;
      quantity: number; 
    }[];
    tags: string[]; 
  }

export interface UpdateSmoothieInput {
    id: string; 
    name?: string; 
    ingredients?: {
      name: string;     
      quantity: number; 
    }[];
    tags?: string[]; 
}
