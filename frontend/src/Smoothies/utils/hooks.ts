import { deleteSmoothie } from "../../api/smoothieApi";
import { useSmoothiesContext } from "../context";
import { Smoothie } from "../context/SmoothiesProvider/types";

export const useDeleteSmoothie = (
  smoothieToDelete: string | null,
  setSmoothieToDelete: (id: string | null) => void
) => {
  const { smoothies, setSmoothies, setError } = useSmoothiesContext();

  return async () => {
    if (!smoothieToDelete) {
      return;
    }
    
    try {
      await deleteSmoothie(smoothieToDelete);
      setSmoothies(
        smoothies.filter((smoothie) => smoothie.id !== smoothieToDelete)
      );
      setSmoothieToDelete(null);
    } catch (error) {
      console.error(error, "Failed to delete smoothie");
      setError("Failed to delete smoothie");
    }
  };
};

export const useShareSmoothie = () => {
  return async (smoothie: Smoothie) => {
    const shareUrl = `${window.location.origin}/smoothies/${smoothie.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("The smoothie link has been copied to your clipboard");
    } catch (error) {
      alert("Failed to copy smoothie link to clipboard");
    }
  };
};
