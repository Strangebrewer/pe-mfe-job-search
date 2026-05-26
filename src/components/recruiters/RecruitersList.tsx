import { FC, useState } from 'react';
import { ActionButton, DeleteConfirmationModal } from '@bka-stuff/pe-mfe-utils';
import {
  useDeleteRecruiter,
  useGetRecruiters,
  useUpdateRecruiter,
} from '../../hooks/recruiterHooks';
import RecruiterModal from './RecruiterModal';
import RecruiterRow from './RecruiterRow';
import './styles.css';

const RecruitersList: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState<Obj>({ type: null, item: null });

  const { data: recruiters } = useGetRecruiters();
  const { mutate: deleteRecruiter } = useDeleteRecruiter();
  const { mutate: updateRecruiter } = useUpdateRecruiter();

  function openDeleteModal(id: string, name: string) {
    setModalState({ type: 'delete', item: { id, name } });
  }

  function openArchiveModal(id: string, name: string) {
    setModalState({ type: 'archive', item: { id, name } });
  }

  function confirmDelete() {
    deleteRecruiter(modalState.item.id);
    setModalState({ type: null, item: null });
  }

  function confirmArchive() {
    updateRecruiter({ id: modalState.item.id, archived: true });
    setModalState({ type: null, item: null });
  }

  return (
    <div className="recruiters-container">
      <DeleteConfirmationModal
        isOpen={modalState.type === 'delete'}
        name={modalState.item?.name}
        onConfirm={confirmDelete}
        onClose={() => setModalState({ type: null, item: null })}
      />
      <DeleteConfirmationModal
        isOpen={modalState.type === 'archive'}
        name={modalState.item?.name}
        onConfirm={confirmArchive}
        onClose={() => setModalState({ type: null, item: null })}
      />
      <h2>
        Recruiters&nbsp;
        <ActionButton iconClass="fas fa-plus" onClick={() => setIsOpen(true)} />
      </h2>
      <div className="recruiters-grid">
        <div className="recruiters-grid-header">
          <div></div>
          <div>Name</div>
          <div>Company</div>
          <div>Phone</div>
          <div>Email</div>
          <div>Rating</div>
          <div></div>
        </div>
        {recruiters?.map((r: any) => (
          <RecruiterRow
            key={r.id}
            recruiter={r}
            onClickDelete={openDeleteModal}
            onClickArchive={openArchiveModal}
          />
        ))}
      </div>
      <RecruiterModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default RecruitersList;
