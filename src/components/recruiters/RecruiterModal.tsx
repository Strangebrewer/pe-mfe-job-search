import { FC, SyntheticEvent, useState } from 'react';
import {
  Modal,
  Label,
  Input,
  ModalContent,
  InputGroup,
  ModalButtons,
} from '@bka-stuff/pe-mfe-utils';
import { useCreateRecruiter } from '../../hooks/recruiterHooks';
import './styles.css';

type RecruiterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const RecruiterModal: FC<RecruiterModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);

  const { mutate: createRecruiter } = useCreateRecruiter();

  function closeModal() {
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setRating(0);
    onClose();
  }

  function submit(e?: SyntheticEvent) {
    e?.preventDefault();
    if (name && company && email) {
      createRecruiter({ name, company, email, phone, rating });
    }
    closeModal();
  }

  const displayRating = hoverRating || rating || 1;

  return (
    <Modal isOpen={isOpen} close={closeModal}>
      <ModalContent heading="New Recruiter">
        <form onSubmit={submit}>
          <InputGroup label="Name">
            <Input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              full
              autofocus
            />
          </InputGroup>

          <InputGroup label="Company">
            <Input
              type="text"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              full
            />
          </InputGroup>

          <InputGroup label="Phone">
            <Input
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              full
            />
          </InputGroup>

          <InputGroup label="Email">
            <Input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              full
            />
          </InputGroup>

          <Label text="Rating:" />
          <div className="--stars tw:mt-[16px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <i
                key={i}
                className={i <= displayRating ? 'fas fa-star' : 'far fa-star'}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>

          <ModalButtons
            onClose={closeModal}
            onConfirm={submit}
            confirmText="Save"
            confirmColor="blue"
            isDisabled={!name || !company || !email}
          />
        </form>
      </ModalContent>
    </Modal>
  );
};

export default RecruiterModal;
