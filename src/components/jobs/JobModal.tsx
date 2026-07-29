import { FC, SyntheticEvent, useState } from 'react';
import {
  Modal,
  Input,
  Select,
  ModalContent,
  InputGroup,
  ModalButtons,
} from '@bka-stuff/pe-mfe-utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCreateJob } from '../../hooks/jobHooks';
import { useGetRecruiters } from '../../hooks/recruiterHooks';

type JobModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EMPTY_FORM = {
  jobTitle: '',
  workFrom: 'remote',
  recruiterId: '',
  dateApplied: new Date() as Date | null,
  companyName: '',
  companyAddress: '',
  companyCity: '',
  companyState: '',
  pointOfContact: '',
  pocTitle: '',
};

const JobModal: FC<JobModalProps> = ({ isOpen, onClose }) => {
  const { data: recruiters } = useGetRecruiters();
  const [form, setForm] = useState(EMPTY_FORM);
  const { mutate: createJob } = useCreateJob();

  function set(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function closeModal() {
    setForm(EMPTY_FORM);
    onClose();
  }

  function validateForm() {
    return !!form.jobTitle && !!form.workFrom && !!form.dateApplied && !!form.companyName;
  }

  function submit(e?: SyntheticEvent) {
    e?.preventDefault();
    if (!validateForm()) return;
    const jobToSave: Obj = {
      jobTitle: form.jobTitle,
      workFrom: form.workFrom,
      dateApplied: form.dateApplied?.toISOString(),
      companyName: form.companyName,
      status: 'applied',
    };
    if (form.recruiterId) jobToSave.recruiterId = form.recruiterId;
    if (form.companyAddress) jobToSave.companyAddress = form.companyAddress;
    if (form.companyCity) jobToSave.companyCity = form.companyCity;
    if (form.companyState) jobToSave.companyState = form.companyState;
    if (form.pointOfContact) jobToSave.pointOfContact = form.pointOfContact;
    if (form.pocTitle) jobToSave.pocTitle = form.pocTitle;

    createJob(jobToSave);
    closeModal();
  }

  return (
    <Modal isOpen={isOpen} close={closeModal}>
      <ModalContent heading="New Job">
        <form onSubmit={submit} className="tw:w-[420px]">
          <InputGroup label="Job Title *">
            <Input
              type="text"
              name="jobTitle"
              value={form.jobTitle}
              onChange={(e) => set('jobTitle', e.target.value)}
              full
              autofocus
            />
          </InputGroup>

          <InputGroup label="Company Name *">
            <Input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={(e) => set('companyName', e.target.value)}
              full
            />
          </InputGroup>

          <InputGroup label="Work Location *">
            <Select
              name="workFrom"
              value={form.workFrom}
              onChange={(e) => set('workFrom', e.target.value)}
              full
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </Select>
          </InputGroup>

          <InputGroup label="Recruiter">
            <Select
              name="recruiterId"
              value={form.recruiterId}
              onChange={(e) => set('recruiterId', e.target.value)}
              full
            >
              <option value="">--Select a recruiter</option>
              {recruiters?.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup label="Date Applied *">
            <DatePicker
              wrapperClassName="job-modal-date-picker"
              selected={form.dateApplied}
              onChange={(date: Date | null) => set('dateApplied', date)}
              placeholderText="Select a date"
            />
          </InputGroup>

          <InputGroup label="Company Address">
            <Input
              type="text"
              name="companyAddress"
              value={form.companyAddress}
              onChange={(e) => set('companyAddress', e.target.value)}
              full
            />
          </InputGroup>

          <InputGroup label="Company City">
            <Input
              type="text"
              name="companyCity"
              value={form.companyCity}
              onChange={(e) => set('companyCity', e.target.value)}
              full
            />
          </InputGroup>

          <InputGroup label="Company State">
            <Input
              type="text"
              name="companyState"
              value={form.companyState}
              onChange={(e) => set('companyState', e.target.value)}
              full
            />
          </InputGroup>

          <InputGroup label="Point of Contact">
            <Input
              type="text"
              name="pointOfContact"
              value={form.pointOfContact}
              onChange={(e) => set('pointOfContact', e.target.value)}
              full
            />
          </InputGroup>

          <InputGroup label="POC Title">
            <Input
              type="text"
              name="pocTitle"
              value={form.pocTitle}
              onChange={(e) => set('pocTitle', e.target.value)}
              full
            />
          </InputGroup>

          <ModalButtons
            onClose={closeModal}
            onConfirm={submit}
            isDisabled={!validateForm()}
            confirmText="Save"
            confirmColor="green"
          />
        </form>
      </ModalContent>
    </Modal>
  );
};

export default JobModal;
