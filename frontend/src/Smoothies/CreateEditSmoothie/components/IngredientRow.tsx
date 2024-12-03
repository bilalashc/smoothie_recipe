import React from 'react';
import '../styles.css'

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface IngredientRowProps {
  ingredient: Ingredient;
  index: number;
  onChange: (index: number, field: keyof Ingredient, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export const IngredientRow = ({
  ingredient,
  index,
  onChange,
  onRemove,
  canRemove,
}: IngredientRowProps) => {
  return (
    <div className="ingredient-row">
      <input
        type="text"
        value={ingredient.name}
        onChange={(e) => onChange(index, 'name', e.target.value)}
        placeholder="Ingredient name"
        required
      />
      <input
        type="number"
        value={ingredient.quantity}
        onChange={(e) => onChange(index, 'quantity', e.target.value)}
        placeholder="Quantity"
        required
        min="0"
        step="any"
      />
      <input
        type="text"
        value={ingredient.unit}
        onChange={(e) => onChange(index, 'unit', e.target.value)}
        placeholder="Unit"
        required
      />
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="remove-button"
        >
          Remove
        </button>
      )}
    </div>
  );
};