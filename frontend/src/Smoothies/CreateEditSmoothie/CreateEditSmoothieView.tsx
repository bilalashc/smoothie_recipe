import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSmoothie, getSmoothieById, updateSmoothie } from '../../api/smoothieApi';
import { IngredientRow } from './components/IngredientRow';
import { TagRow } from './components/TagRow';
import './styles.css';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface IngredientName {
    id: string;
    quantity: string;
    unit: string;
    ingredient: {
        id: string;
        name: string;
    }
}

interface TagName {
    tagId: string;
    tag: {
        id: string;
        name: string;
    }
}

interface FormData {
  name: string;
  ingredients: Ingredient[];
  tags: string[];
}

export const CreateEditSmoothieView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    tags: [''],
  });
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  console.log(id, "testing id")
  // Fetch smoothie data when editing
  useEffect(() => {
    console.log("fetching smoothie data when editing")
    const fetchSmoothie = async () => {
      try {
        setIsFetching(true);
        const smoothie = await getSmoothieById(id!);
        console.log(smoothie, "fetch smoothie data")
        setFormData({
          name: smoothie.name,
          ingredients: smoothie.ingredients.map((ing: IngredientName) => ({
            name: ing.ingredient.name,
            quantity: ing.quantity,
            unit: ing.unit,
          })),
          tags: smoothie.tags.map((tag: TagName) => tag.tag.name),
        });
      } catch (error) {
        setLocalError('Failed to fetch smoothie details');
        // navigate('/smoothies');
      } finally {
        setIsFetching(false);
      }
    };

    if (isEditing) {
      fetchSmoothie();
    }
  }, [id, isEditing, navigate]);

  // Handle changes to the smoothie name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  // Handle changes to ingredients
  const handleIngredientChange = useCallback(
    (index: number, field: keyof Ingredient, value: string) => {
      setFormData((prev) => {
        const newIngredients = [...prev.ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        return { ...prev, ingredients: newIngredients };
      });
    },
    []
  );

  // Add a new ingredient row
  const addIngredient = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }],
    }));
  }, []);

  // Remove an ingredient row
  const removeIngredient = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  }, []);

  const handleTagChange = useCallback(
    (index: number, value: string) => {
      setFormData((prev) => {
        const newTags = [...prev.tags];
        newTags[index] = value;
        return { ...prev, tags: newTags };
      });
    },
    []
  );
  
  const addTag = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, ''],
    }));
  }, []);
  
  const removeTag = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
  
      if (!formData.name.trim()) {
        throw new Error('Smoothie name cannot be empty');
      }
  
      // Validate ingredients
      const ingredients = formData.ingredients.map((ing) => {
        const name = ing.name.trim();
        const unit = ing.unit.trim();
        const quantity = parseFloat(ing.quantity);
  
        if (!name) {
          throw new Error('Ingredient name cannot be empty');
        }
        if (isNaN(quantity) || quantity <= 0) {
          throw new Error(`Invalid quantity for ingredient "${name}"`);
        }
        if (!unit) {
          throw new Error(`Unit cannot be empty for ingredient "${name}"`);
        }
  
        return {
          name,
          quantity,
          unit,
        };
      });
  
      // Validate tags
      const tags = formData.tags
        .map((tag) => tag.trim())
        .filter((tag) => {
          if (!tag) {
            setLocalError('Tag names cannot be empty');
          }
          return tag;
        });
  
      const smoothieData = {
        name: formData.name.trim(),
        ingredients,
        tags,
      };
  
      if (isEditing && id) {
        await updateSmoothie({ id, ...smoothieData });
      } else {
        await createSmoothie(smoothieData);
      }
  
      navigate('/smoothies');
    } catch (error: any) {
      setLocalError(error.message || `Failed to ${isEditing ? 'update' : 'create'} smoothie`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="create-edit-container">
      <h1 className="page-title">{isEditing ? 'Edit Smoothie' : 'Create New Smoothie'}</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="smoothie-form">
        <div className="form-group">
          <label htmlFor="name">Smoothie Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleNameChange}
            required
            placeholder="Enter smoothie name"
          />
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <IngredientRow
              key={index}
              ingredient={ingredient}
              index={index}
              onChange={handleIngredientChange}
              onRemove={removeIngredient}
              canRemove={formData.ingredients.length > 1}
            />
          ))}
          <button type="button" onClick={addIngredient} className="add-button">
            Add Ingredient
          </button>
        </div>

        <div className="form-group">
  <label>Tags</label>
  {formData.tags.map((tag, index) => (
    <TagRow
      key={index}
      tag={tag}
      index={index}
      onChange={handleTagChange}
      onRemove={removeTag}
      canRemove={formData.tags.length > 1}
    />
  ))}
  <button type="button" onClick={addTag} className="add-button">
    Add Tag
  </button>
</div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/smoothies')} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isEditing ? 'Update Smoothie' : 'Create Smoothie'}
          </button>
        </div>
      </form>
    </div>
  );
};