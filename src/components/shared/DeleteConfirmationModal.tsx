import { FC } from "react";
import { Button, Modal } from "@bka-stuff/pe-mfe-utils";
import "./styles.css";

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  item: Obj;
  onConfirm: () => void;
  onClose: () => void;
  action?: string;
}

const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({ isOpen, item, onClose, onConfirm, action = 'delete' }) => {
  const actionLabel = action.charAt(0).toUpperCase() + action.slice(1);
  return (
    <Modal isOpen={isOpen} close={onClose}>
      <div className="delete-confirmation-modal">
        <p className="tw:mb-[24px]">Are you sure you want to {action} {item?.name}?</p>
        <div className="delete-confirmation-modal--buttons">
          <Button color="grey" text="Cancel" onClick={onClose} />
          <Button
            color="red"
            text={actionLabel}
            onClick={onConfirm}
            last
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;