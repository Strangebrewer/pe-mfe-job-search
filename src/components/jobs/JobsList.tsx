import { FC, useState } from 'react';
import { ActionButton, DeleteConfirmationModal } from '@bka-stuff/pe-mfe-utils';
import { useDeleteJob, useGetJobs, useUpdateJob } from '../../hooks/jobHooks';
import { useJobFilterStore } from '../../store/jobs/jobFilterStore';
import JobModal from './JobModal';
import JobRow from './JobRow';
import JobsFilter from './JobsFilter';
import './styles.css';

const JobsList: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState<Obj>({ type: null, item: null });

  const {
    company,
    recruiter,
    status,
    workFrom,
    dateMin,
    dateMax,
    archived,
    includeDeclined,
    sortBy,
    sortDir,
    setFilter,
  } = useJobFilterStore();

  const queryParams: Record<string, any> | undefined = (() => {
    const p: Record<string, any> = {};
    if (company) p.company = company;
    if (recruiter) p.recruiter = recruiter;
    if (status) p.status = status;
    if (workFrom) p.workFrom = workFrom;
    if (dateMin) p.dateMin = dateMin;
    if (dateMax) p.dateMax = dateMax;
    if (archived) p.archived = 'true';
    if (includeDeclined) p.includeDeclined = 'true';
    if (sortBy) {
      p.sortBy = sortBy;
      p.sortDir = sortDir || 'asc';
    }
    return Object.keys(p).length ? p : undefined;
  })();

  const { data: jobs } = useGetJobs(queryParams);
  const { mutate: deleteJob } = useDeleteJob();
  const { mutate: updateJob } = useUpdateJob();

  function handleSort(field: string) {
    if (sortBy === field) {
      setFilter('sortDir', sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setFilter('sortBy', field);
      setFilter('sortDir', 'asc');
    }
  }

  function renderSortHeader(label: string, field: string) {
    const isActive = sortBy === field;
    const icon = isActive ? (sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort';
    return (
      <div className="--sortable-header" onClick={() => handleSort(field)}>
        {label} <i className={`fas ${icon}`} />
      </div>
    );
  }

  function openDeleteModal(id: string, name: string) {
    setModalState({ type: 'delete', item: { id, name } });
  }

  function openArchiveModal(id: string, name: string) {
    setModalState({ type: 'archive', item: { id, name } });
  }

  function confirmDelete() {
    deleteJob(modalState.item.id);
    setModalState({ type: null, item: null });
  }

  function confirmArchive() {
    updateJob({ id: modalState.item.id, archived: true });
    setModalState({ type: null, item: null });
  }

  return (
    <div className="jobs-container">
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
        Jobs&nbsp;
        <ActionButton iconClass="fas fa-plus" onClick={() => setIsOpen(true)} />
      </h2>
      <JobsFilter />
      <div className="jobs-grid">
        <div className="jobs-grid-header">
          <div></div>
          {renderSortHeader('Company', 'companyName')}
          {renderSortHeader('Job Title', 'jobTitle')}
          {renderSortHeader('Date Applied', 'dateApplied')}
          {renderSortHeader('Recruiter', 'recruiter')}
          {renderSortHeader('Work From', 'workFrom')}
          {renderSortHeader('Status', 'status')}
          <div></div>
        </div>
        {jobs?.map((j: any) => (
          <JobRow
            key={j.id}
            job={j}
            onClickDelete={openDeleteModal}
            onClickArchive={openArchiveModal}
          />
        ))}
      </div>
      <JobModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default JobsList;
