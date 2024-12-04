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

// Utility function to copy text to clipboard
const copyToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Failed to copy using navigator.clipboard:", error);
    }
  }

  // Fallback method for insecure contexts or older browsers
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Prevent scrolling to the bottom
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";

  document.body.appendChild(textArea);
  textArea.focus({ preventScroll: true });
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      return true;
    } else {
      console.error("Fallback: Unable to copy text");
    }
  } catch (error) {
    console.error("Fallback: Error copying text:", error);
  } finally {
    document.body.removeChild(textArea);
  }

  return false;
};

// Hook to share the smoothie
export const useShareSmoothie = () => {
  return async (smoothie: Smoothie) => {
    const shareUrl = `${window.location.origin}/smoothies/${smoothie.id}`;
    const isCopied = await copyToClipboard(shareUrl);

    if (isCopied) {
      alert("The smoothie link has been copied to your clipboard");
    } else {
      alert("Failed to copy smoothie link to clipboard");
    }
  };
};
