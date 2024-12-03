import { useEffect, useState } from "react";
import { useSmoothiesContext } from "../context";
import {useNavigate} from 'react-router-dom'
import { deleteSmoothie, getSmoothies } from "../../api/smoothieApi";
import { Smoothie } from "../context/SmoothiesProvider/types";
import { DeleteModal } from "./components/DeleteModal";
import { SmoothieCard } from "./components/SmoothieCard";
import './styles.css'

export const ListSmoothiesView = () => {
    const {smoothies, setSmoothies, setSelectedSmoothie, setIsEditing, setIsCreating, loading, setLoading, error, setError} = useSmoothiesContext();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState<string>("");
    const [smoothieToDelete, setSmoothieToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchSmoothies = async () => {
            try {
                setLoading(true)

                const data = await getSmoothies();
                setSmoothies(data);

            } catch (error){
                console.error(error, "Failed to fetch smoothies")
                setError("Failed to fetch smoothies")
            } finally {
                setLoading(false)
            }
        }
        fetchSmoothies();

    },[setSmoothies, setLoading, setError])

    const handleEdit = (smoothie: Smoothie) => {
        navigate(`/smoothies/edit/${smoothie.id}`)
    }

    const handleDelete = async () => {
        if (!smoothieToDelete) {
            return
        }

        try {
            await deleteSmoothie(smoothieToDelete);
            setSmoothies(smoothies.filter(smoothie => smoothie.id !== smoothieToDelete))
            setSmoothieToDelete(null)
        } catch (error){
            console.error(error, "Failed to delete smoothie")
            setError("Failed to delete smoothie")
        }
    }

    const handleShare = async(smoothie: Smoothie) => {
        const shareUrl = `${window.location.origin}/smoothies/${smoothie.id}`
        try {
            await navigator.clipboard.writeText(shareUrl)
            alert("The smoothie link has been copied to your clipboard")
        } catch (error) {
            alert("Failed to copy smoothie link to clipboard")
        }
    }

    const filteredSmoothies = smoothies.filter(smoothie => smoothie.name.toLowerCase().includes(searchInput.toLowerCase()));

    if (loading){
        return <div className="loading">Loading Smoothies...</div>
    }

    if (error){
        return <div className="error">{error}</div>
    }



    return (
        <div className="smoothies-container">
      <div className="smoothies-header">
      <h1 className="page-title">Smoothie Recipebook</h1>
        <input
          type="search"
          className="search-input"
          placeholder="Search smoothies..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search smoothies"
        />
        <button 
          className="create-button"
          onClick={() => navigate('/smoothies/new')}
        >
          Create New Smoothie
        </button>
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
    )

}
