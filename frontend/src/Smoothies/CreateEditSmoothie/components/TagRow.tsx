import React from 'react';
import '../styles.css';

interface TagRowProps {
  tag: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export const TagRow = ({
  tag,
  index,
  onChange,
  onRemove,
  canRemove,
}: TagRowProps) => {
  return (
    <div className="tag-row">
      <input
        type="text"
        value={tag}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder="Tag"
        required
      />
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="remove-button"
        >
          Remove
        </button>
      )}
    </div>
  );
};