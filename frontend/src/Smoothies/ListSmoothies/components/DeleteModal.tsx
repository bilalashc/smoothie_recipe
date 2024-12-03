import '../styles.css'
interface DeleteModalProps {
    showModal: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteModal = ({showModal, onClose, onConfirm}: DeleteModalProps) => {
    
    if (!showModal){
        return null
    }
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2 className="modal-title">Delete Smoothie</h2>
                <p>Are you sure you want to <b>delete</b> this smoothie? This action cannot be undone.</p>
                <div className="modal-actions">
                    <button className="modal-button cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="modal-button delete" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )

}
