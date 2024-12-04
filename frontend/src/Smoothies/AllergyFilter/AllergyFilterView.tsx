import { useState, useEffect } from "react";
import { useSmoothiesContext } from "../context";
import { useNavigate } from "react-router-dom";
import { getSmoothies } from "../../api/smoothieApi";
import "./styles.css";
import { useDeleteSmoothie, useShareSmoothie } from "../utils/hooks";
import { DeleteModal } from "../components/DeleteModal";
import { SmoothieCard } from "../components/SmoothieCard";

export const AllergyFilterView = () => {
  const { smoothies, setSmoothies, loading, setLoading } =
    useSmoothiesContext();
  const navigate = useNavigate();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [smoothieToDelete, setSmoothieToDelete] = useState<string | null>(null);
  const handleDelete = useDeleteSmoothie(smoothieToDelete, setSmoothieToDelete);
  const handleShare = useShareSmoothie();

  useEffect(() => {
    const fetchSmoothies = async () => {
      try {
        setLoading(true);
        const data = await getSmoothies();
        setSmoothies(data);
      } catch (error) {
        console.error(error, "Failed to fetch smoothies");
      } finally {
        setLoading(false);
      }
    };
    fetchSmoothies();
  }, [setSmoothies, setLoading]);

  // Get unique ingredients
  const allIngredients = Array.from(
    new Set(
      smoothies.flatMap((smoothie) =>
        smoothie.ingredients.map((item) => item.ingredient.name)
      )
    )
  ).sort();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("dropdown-container");
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(
        selectedIngredients.filter((item) => item !== ingredient)
      );
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const filteredSmoothies = smoothies.filter((smoothie) => {
    if (selectedIngredients.length === 0) {
      return true;
    }
    const smoothieIngredients = smoothie.ingredients.map(
      (item) => item.ingredient.name
    );
    return !selectedIngredients.some((allergen) =>
      smoothieIngredients.includes(allergen)
    );
  });

  if (loading) {
    return <div className="loading">Loading Smoothies...</div>;
  }

  return (
    <div className="smoothies-container">
      <div className="smoothies-header">
        <h1 className="page-title">filter smoothies by allergies</h1>
        <div className="allergy-filter-section">
          <p className="filter-instruction">
            {
              "Select ingredients to filter out smoothies that can cause you allergies:"
            }
          </p>

          <div className="dropdown-container" id="dropdown-container">
            <button
              className="dropdown-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedIngredients.length === 0
                ? "Select ingredients to filter smoothies"
                : `${selectedIngredients.length} ingredient${
                    selectedIngredients.length === 1 ? "" : "s"
                  } selected`}
              <span className="dropdown-arrow">
                {isDropdownOpen ? "▲" : "▼"}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-content">
                {allIngredients.map((ingredient) => (
                  <label key={ingredient} className="dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedIngredients.includes(ingredient)}
                      onChange={() => toggleIngredient(ingredient)}
                    />
                    <span>{ingredient}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedIngredients.length > 0 && (
            <div className="selected-ingredients">
              {selectedIngredients.map((ingredient) => (
                <span key={ingredient} className="selected-ingredient">
                  {ingredient}
                  <button
                    onClick={() => toggleIngredient(ingredient)}
                    className="remove-ingredient"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          className="create-button"
          onClick={() => navigate("/smoothies")}
          style={{ marginTop: "20px" }}
        >
          Back to All Smoothies
        </button>
      </div>

      <div className="smoothies-grid">
        {filteredSmoothies.length > 0 ? (
          filteredSmoothies.map((smoothie) => (
            <SmoothieCard
              key={smoothie.id}
              smoothie={smoothie}
              onEdit={() => navigate(`/smoothies/edit/${smoothie.id}`)}
              onDelete={(id) => setSmoothieToDelete(id)}
              onShare={handleShare}
            />
          ))
        ) : (
          <div className="no-results">
            No smoothies found.
          </div>
        )}
      </div>
      <DeleteModal
        showModal={!!smoothieToDelete}
        onClose={() => setSmoothieToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
