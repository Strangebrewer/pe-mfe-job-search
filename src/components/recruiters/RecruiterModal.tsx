import { FC, SyntheticEvent, useState } from "react";
import { Modal, Button, Label, Input } from "@bka-stuff/pe-mfe-utils";
import { useCreateRecruiter } from "../../hooks/recruiterHooks";
import "./styles.css";

type RecruiterModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

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
      <div className="recruiter-modal-body">
        <h2 className="tw:mb-[16px]">New Recruiter</h2>
        <form onSubmit={submit}>
          <div>
            <Label text="Name" />
            <Input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              full
              autofocus
            />
          </div>

          <div>
            <Label text="Company" />
            <Input
              type="text"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              full
            />
          </div>

          <div>
            <Label text="Phone" />
            <Input
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              full
            />
          </div>

          <div>
            <Label text="Email" />
            <Input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              full
            />
          </div>

          <Label text="Rating:" />
          <div className="--stars tw:mt-[16px]">
            {[1, 2, 3, 4, 5].map(i => (
              <i
                key={i}
                className={i <= displayRating ? "fas fa-star" : "far fa-star"}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>

          <div className="tw:mt-[16px] tw:flex tw:justify-end">
            <button type="submit" style={{ display: 'none' }} />
            <Button variant="red" text="Cancel" onClick={closeModal} />
            <Button
              variant="blue"
              text="Save"
              onClick={submit}
              disabled={!name || !company || !email}
              last
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RecruiterModal;
