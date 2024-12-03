import { useContext } from "react"
import { SmoothiesContext } from "./context"

export const useSmoothiesContext = () => {
    const context = useContext(SmoothiesContext);
    if (!context){
        throw new Error("useSmoothiesContext must be used within Smoothies ")
    }
    return context;
}
