import { useState } from "react";
import { Smoothie } from "./types";
import { SmoothiesContext } from "./context";

export const SmoothiesProvider = ({children}: {children: React.ReactNode}) => {
    const [smoothies, setSmoothies] = useState<Smoothie[]>([]);
    const [selectedSmoothie, setSelectedSmoothie] = useState<Smoothie | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null)

    return (
        <SmoothiesContext.Provider value={{
            smoothies,
            setSmoothies,
            selectedSmoothie,
            setSelectedSmoothie,
            isCreating,
            setIsCreating,
            isEditing,
            setIsEditing,
            loading,
            setLoading,
            error,
            setError
        }}>
            {children}
        </SmoothiesContext.Provider>
    )
}
