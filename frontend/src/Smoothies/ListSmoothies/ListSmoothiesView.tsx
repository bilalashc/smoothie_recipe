import { useEffect, useState } from "react";
import { useSmoothiesContext } from "../context";
import { useNavigate } from "react-router-dom";
import { getSmoothies } from "../../api/smoothieApi";
import { Smoothie } from "../context/SmoothiesProvider/types";

import "./styles.css";
import { useDeleteSmoothie, useShareSmoothie } from "../utils/hooks";
import { DeleteModal } from "../components/DeleteModal";
import { SmoothieCard } from "../components/SmoothieCard";

export const ListSmoothiesView = () => {
  const { smoothies, setSmoothies, loading, setLoading, setError } =
    useSmoothiesContext();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState<string>("");
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
        setError("Failed to fetch smoothies");
      } finally {
        setLoading(false);
      }
    };
    fetchSmoothies();
  }, [setSmoothies, setLoading, setError]);

  const handleEdit = (smoothie: Smoothie) => {
    navigate(`edit/${smoothie.id}`);
  };

  const filteredSmoothies = smoothies.filter((smoothie) =>
    smoothie.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading Smoothies...</div>;
  }

  return (
    <div className="smoothies-container">
      <div className="smoothies-header">
        <h1 className="page-title">smoothie recipebook</h1>
        <input
          type="search"
          className="search-input"
          placeholder="Search smoothies..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search smoothies"
        />
        <div className="button-group">
          <button className="create-button" onClick={() => navigate("new")}>
            Create New Smoothie
          </button>
          <button
            className="allergy-button"
            onClick={() => navigate("allergies")}
          >
            I Have Allergies
          </button>
        </div>
      </div>

      <div className="smoothies-grid">
        {filteredSmoothies.map((smoothie) => (
          <SmoothieCard
            key={smoothie.id}
            smoothie={smoothie}
            onEdit={handleEdit}
            onDelete={(id) => setSmoothieToDelete(id)}
            onShare={handleShare}
          />
        ))}
      </div>

      <DeleteModal
        showModal={!!smoothieToDelete}
        onClose={() => setSmoothieToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
