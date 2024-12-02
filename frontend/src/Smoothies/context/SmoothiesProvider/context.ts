import { Smoothie } from "./types";
import { createContext } from "react";

interface SmoothieContextInterface {
    smoothies: Smoothie[];
    setSmoothies: React.Dispatch<React.SetStateAction<Smoothie[]>>;
    selectedSmoothie: Smoothie | null;
    setSelectedSmoothie: React.Dispatch<React.SetStateAction<Smoothie | null>>;
    isCreating: boolean;
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SmoothiesContext = createContext<SmoothieContextInterface>({
    smoothies: [],
    setSmoothies: () => {},
    selectedSmoothie: null,
    setSelectedSmoothie: () => {},
    isCreating: false,
    setIsCreating: () => {},
    isEditing: false,
    setIsEditing: () => {},
    loading: false,
    setLoading: () => {},
    error: null,
    setError: () => {},
})
