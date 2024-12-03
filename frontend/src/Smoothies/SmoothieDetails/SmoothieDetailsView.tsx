// SmoothieDetailsView.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSmoothieById } from '../../api/smoothieApi';
import './styles.css';

// Define TypeScript interfaces for type safety
interface SmoothieIngredient {
  id: string;
  quantity: number;
  unit: string;
  ingredient: {
    id: string;
    name: string;
  };
}

interface SmoothieTag {
  tagId: string;
  tag: {
    id: string;
    name: string;
  };
}

interface Smoothie {
  id: string;
  name: string;
  ingredients: SmoothieIngredient[];
  tags: SmoothieTag[];
}

export const SmoothieDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [smoothie, setSmoothie] = useState<Smoothie | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Fetch the smoothie details when the component mounts
  useEffect(() => {
    const fetchSmoothie = async () => {
      try {
        setIsFetching(true);
        if (!id) {
          console.error("No Smoothie ID provided")
          return;
        }
        const data = await getSmoothieById(id);
        setSmoothie(data);
      } catch (error) {
        console.error('Error fetching smoothie:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSmoothie();
  }, [id]);

  if (isFetching) {
    return <div className="loading">Loading smoothie details...</div>;
  }

  if (!smoothie) {
    return null;
  }

  return (
    <div className="smoothie-details-page">
      <h1 className="page-title">Check out my Smoothie!</h1>
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/smoothies')}>
        Back to Smoothie List
      </button>
      <div className="smoothie-details-container">
        <h2 className="smoothie-name">{smoothie.name}</h2>
        {/* Ingredients Section */}
        <div className="section">
          <h3 className="section-title">Ingredients</h3>
          <ul className="ingredients-list">
            {smoothie.ingredients.map((item) => (
              <li key={item.id} className="ingredient-item">
                {item.quantity} {item.unit} of {item.ingredient.name}
              </li>
            ))}
          </ul>
        </div>
        {/* Tags Section */}
        {smoothie.tags && smoothie.tags.length > 0 && (
          <div className="section">
            <h3 className="section-title">Tags</h3>
            <div className="tags-container">
              {smoothie.tags.map((tag) => (
                <span key={tag.tagId} className="tag">
                  {tag.tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};