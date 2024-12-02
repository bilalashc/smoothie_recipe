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
