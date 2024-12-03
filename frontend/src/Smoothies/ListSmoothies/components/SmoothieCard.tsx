import { Smoothie } from "../../context/SmoothiesProvider/types";
import '../styles.css'


interface SmoothieCardProps {
    smoothie: Smoothie;
    onEdit: (smoothie: Smoothie) => void;
    onDelete: (id: string) => void;
    onShare: (smoothie: Smoothie) => void;
}

export const SmoothieCard = ({smoothie, onEdit, onDelete, onShare}: SmoothieCardProps) => {
    return (
        <div className="smoothie-card">
            <div className="smoothie-header">
                <h3 className="smoothie-title">{smoothie.name}</h3>
                <div className="actions-container">
                <button
                    className="action-button"
                    onClick={() => onShare(smoothie)}
                    aria-label="Share smoothie"
                >
                    Share
                </button>
                <button
                    className="action-button"
                    onClick={() => onEdit(smoothie)}
                    aria-label="Edit smoothie"
                >
                    Edit
                </button>
                <button
                    className="action-button delete"
                    onClick={() => onDelete(smoothie.id)}
                    aria-label="Delete smoothie"
                >
                    Delete
                </button>
                </div>
            </div>

            <div className="ingredients-list">
                {smoothie.ingredients.map((item) => (
                    <span key={item.ingredientId} className="ingredient-tag">
                        {item.ingredient.name} {item.quantity}
                    </span>
                ))} 
            </div>
            
            {smoothie.tags && smoothie.tags.length > 0 && (
            <div className="tags-container">
                {smoothie.tags.map((tag) => (
                    <span key={tag.tagId} className="tag">
                        {tag.tag.name}
                    </span>
                ))}
            </div>
            )}
        </div>
    )
}

