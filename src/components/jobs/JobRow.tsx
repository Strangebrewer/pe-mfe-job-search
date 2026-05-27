import { FC, useState } from "react";
import { useGetRecruiters } from "../../hooks/recruiterHooks";
import { useUpdateJob } from "../../hooks/jobHooks";
import { ActionButton } from "@bka-stuff/pe-mfe-utils";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { STATUS_OPTIONS, WORK_FROM_OPTIONS } from "../../utils/constants";

type JobRowProps = {
  job: Obj;
  onClickDelete: (id: string, name: string) => void;
  onClickArchive: (id: string, name: string) => void;
}

const JobRow: FC<JobRowProps> = ({ job, onClickDelete, onClickArchive }) => {
  const [expanded, setExpanded] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingOriginal, setEditingOriginal] = useState('');
  const [editingLink, setEditingLink] = useState<{ group: 'primary' | 'secondary', url: string, text: string } | null>(null);
  const [addingInterview, setAddingInterview] = useState(false);
  const [addingComment, setAddingComment] = useState(false);
  const [newInterview, setNewInterview] = useState('');
  const [newComment, setNewComment] = useState('');

  const { data: recruiters } = useGetRecruiters();
  const recruiter = recruiters?.find((r: Obj) => r.id === job.recruiterId);
  const { mutate: updateJob } = useUpdateJob();

  function startEdit(field: string, value: string) {
    setEditingField(field);
    setEditingValue(value);
    setEditingOriginal(value);
  }

  function saveEdit() {
    if (editingField && editingValue !== editingOriginal) {
      updateJob({ ...job, [editingField]: editingValue });
    }
    setEditingField(null);
  }

  function cancelEdit() {
    setEditingField(null);
    setEditingValue('');
    setEditingOriginal('');
  }

  function saveLinkEdit() {
    if (!editingLink) return;
    const { group, url } = editingLink;
    const text = editingLink.text || (group === 'primary' ? 'LinkedIn' : 'Direct');
    const urlField = group === 'primary' ? 'primaryLink' : 'secondaryLink';
    const textField = group === 'primary' ? 'primaryLinkText' : 'secondaryLinkText';
    const originalUrl = job[urlField] || '';
    const originalText = job[textField] || '';
    if (url !== originalUrl || text !== originalText) {
      updateJob({ ...job, [urlField]: url, [textField]: text });
    }
    setEditingLink(null);
  }

  function renderLinkItem(group: 'primary' | 'secondary') {
    const url = job[group === 'primary' ? 'primaryLink' : 'secondaryLink'] || '';
    const text = job[group === 'primary' ? 'primaryLinkText' : 'secondaryLinkText'] || '';
    const label = group === 'primary' ? 'Primary' : 'Secondary';

    if (editingLink?.group === group) {
      return (
        <div className="--link-edit">
          <input
            autoFocus
            className="--inline-input --link-url-input"
            placeholder="URL"
            value={editingLink.url}
            onChange={e => setEditingLink({ ...editingLink, url: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') saveLinkEdit(); if (e.key === 'Escape') setEditingLink(null); }}
          />
          <input
            className="--inline-input --link-text-input"
            placeholder="Display text"
            value={editingLink.text}
            onChange={e => setEditingLink({ ...editingLink, text: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') saveLinkEdit(); if (e.key === 'Escape') setEditingLink(null); }}
          />
          <ActionButton iconClass="fas fa-check" color="green" size="sm" onClick={saveLinkEdit} />
          <ActionButton iconClass="fas fa-times" color="red" size="sm" onClick={() => setEditingLink(null)} />
        </div>
      );
    }

    let isValid = false;
    try { new URL(url); isValid = true; } catch {}
    const display = text || url;

    return (
      <div className="--link-read">
        <span className="--link-label">{label}</span>
        {display
          ? isValid
            ? <a className="--link-anchor" href={url} target="_blank" rel="noopener noreferrer">{display}</a>
            : <><span>{display}</span><span className="--invalid-url">invalid URL</span></>
          : <span className="--empty">none</span>
        }
        <ActionButton
          iconClass="fas fa-pencil-alt"
          color="blue"
          size="sm"
          onClick={() => setEditingLink({ group, url, text: text || (group === 'primary' ? 'LinkedIn' : 'Direct') })}
        />
      </div>
    );
  }

  function renderEditable(field: string, value: string) {
    if (editingField === field) {
      return (
        <input
          autoFocus
          className="--inline-input"
          value={editingValue}
          onChange={e => setEditingValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') cancelEdit();
          }}
          onBlur={saveEdit}
        />
      );
    }
    return (
      <span title={value} className="--editable" onDoubleClick={() => startEdit(field, value)}>
        {value}
      </span>
    );
  }

  function submitNewInterview() {
    if (!newInterview.trim()) return;
    updateJob({ ...job, interviews: [...(job.interviews || []), newInterview.trim()] });
    setNewInterview('');
    setAddingInterview(false);
  }

  function removeInterview(index: number) {
    updateJob({ ...job, interviews: job.interviews.filter((_: string, i: number) => i !== index) });
  }

  function submitNewComment() {
    if (!newComment.trim()) return;
    updateJob({ ...job, comments: [...(job.comments || []), newComment.trim()] });
    setNewComment('');
    setAddingComment(false);
  }

  function removeComment(index: number) {
    updateJob({ ...job, comments: job.comments.filter((_: string, i: number) => i !== index) });
  }

  return (
    <div className="job-grid-row-wrapper">
      <div className="job-grid-row">
        <div className="--toggle-cell">
          <ActionButton
            iconClass={expanded ? "fas fa-caret-down" : "fas fa-caret-right"}
            color="blue"
            onClick={() => setExpanded(!expanded)}
          />
        </div>

        <div className="--truncate">{renderEditable('companyName', job.companyName)}</div>
        <div className="--truncate">{renderEditable('jobTitle', job.jobTitle)}</div>
        <div className="--truncate">
          {editingField === 'dateApplied'
            ? (
              <DatePicker
                selected={job.dateApplied ? parseISO(job.dateApplied) : null}
                onChange={(date: Date | null) => {
                  if (date) updateJob({ ...job, dateApplied: date.toISOString() });
                  cancelEdit();
                }}
                onClickOutside={cancelEdit}
                autoFocus
                open
              />
            ) : (
              <span className="--editable" onDoubleClick={() => startEdit('dateApplied', job.dateApplied)}>
                {job.dateApplied ? format(parseISO(job.dateApplied), 'MMM dd, yyyy') : ''}
              </span>
            )
          }
        </div>
        <div className="--truncate">
          {editingField === 'recruiterId'
            ? (
              <select
                autoFocus
                className="--inline-select"
                value={editingValue}
                onChange={e => { updateJob({ ...job, recruiterId: e.target.value }); cancelEdit(); }}
                onBlur={cancelEdit}
              >
                <option value="">-- None</option>
                {recruiters?.map((r: Obj) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            ) : (
              <span className="--editable" onDoubleClick={() => startEdit('recruiterId', job.recruiterId)}>
                {recruiter?.name}
              </span>
            )
          }
        </div>

        <div>
          <select
            className="--inline-select"
            value={job.workFrom}
            onChange={e => updateJob({ ...job, workFrom: e.target.value })}
          >
            {WORK_FROM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <select
            className="--inline-select"
            value={job.status}
            onChange={e => updateJob({ ...job, status: e.target.value })}
          >
            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="--actions">
          <ActionButton
            iconClass="fas fa-archive"
            title="archive this job"
            color="blue"
            onClick={() => onClickArchive(job.id, job.jobTitle)}
          />
          <ActionButton
            color="red"
            iconClass="fas fa-trash"
            onClick={() => onClickDelete(job.id, job.jobTitle)}
          />
        </div>
      </div>

      <div className={`--expansion-wrapper${expanded ? " is-open" : ""}`}>
        <div className="--expansion-inner">
          <div className="--expanded-content">
            <div className="--links-bar">
              {renderLinkItem('primary')}
              {renderLinkItem('secondary')}
            </div>
            <div className="--expanded-row">
              <div className="--address">
                <h4>Company Address</h4>
                <p>{renderEditable('companyAddress', job.companyAddress)}</p>
                <p className="--city-state">
                  {renderEditable('companyCity', job.companyCity)}
                  {job.companyCity && job.companyState ? ', ' : ''}
                  {renderEditable('companyState', job.companyState)}
                </p>
              </div>

              <div className="--poc">
                <h4>Point of Contact</h4>
                <p>{renderEditable('pointOfContact', job.pointOfContact)}</p>
                <p>{renderEditable('pocTitle', job.pocTitle)}</p>
              </div>

              <div className="--section --interviews">
                <div className="--section-header">
                  <h4>Interviews</h4>
                  <ActionButton
                    iconClass="fas fa-plus"
                    color="green"
                    size="sm"
                    onClick={() => setAddingInterview(true)}
                  />
                </div>

                {job.interviews?.map((interview: string, i: number) => (
                  <div key={i} className="--section-item">
                    <ActionButton text="x" color="red" onClick={() => removeInterview(i)} />
                    <p>{interview}</p>
                  </div>
                ))}

                {addingInterview && (
                  <input
                    autoFocus
                    className="--add-input"
                    placeholder="New interview..."
                    value={newInterview}
                    onChange={e => setNewInterview(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') submitNewInterview();
                      if (e.key === 'Escape') { setAddingInterview(false); setNewInterview(''); }
                    }}
                    onBlur={() => { setAddingInterview(false); setNewInterview(''); }}
                  />
                )}
              </div>

              <div className="--section --comments">
                <div className="--section-header">
                  <h4>Comments</h4>
                  <ActionButton
                    iconClass="fas fa-plus"
                    color="green"
                    size="sm"
                    onClick={() => setAddingComment(true)}
                  />
                </div>

                {job.comments?.map((comment: string, i: number) => (
                  <div key={i} className="--section-item">
                    <ActionButton text="x" color="red" onClick={() => removeComment(i)} />
                    <p>{comment}</p>
                  </div>
                ))}

                {addingComment && (
                  <input
                    autoFocus
                    className="--add-input"
                    placeholder="New comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') submitNewComment();
                      if (e.key === 'Escape') { setAddingComment(false); setNewComment(''); }
                    }}
                    onBlur={() => { setAddingComment(false); setNewComment(''); }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobRow;
