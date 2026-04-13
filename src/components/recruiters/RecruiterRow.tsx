import { FC, useState } from "react";
import { useUpdateRecruiter } from "../../hooks/recruiterHooks";
import { ActionButton } from "@bka-stuff/pe-mfe-utils";

type RecruiterRowProps = {
  recruiter: Obj;
  onClickDelete: (id: string, name: string) => void;
  onClickArchive: (id: string, name: string) => void;
}

const RecruiterRow: FC<RecruiterRowProps> = ({ recruiter, onClickDelete, onClickArchive }) => {
  const [expanded, setExpanded] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [addingComment, setAddingComment] = useState(false);
  const [newComment, setNewComment] = useState('');

  const { mutate: updateRecruiter } = useUpdateRecruiter();

  function startEdit(field: string, value: string) {
    setEditingField(field);
    setEditingValue(value);
  }

  function saveEdit() {
    if (editingField) {
      updateRecruiter({ ...recruiter, [editingField]: editingValue });
      setEditingField(null);
    }
  }

  function cancelEdit() {
    setEditingField(null);
    setEditingValue('');
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
      <span className="--editable" onDoubleClick={() => startEdit(field, value)}>
        {value}
      </span>
    );
  }

  function setRating(rating: number) {
    updateRecruiter({ ...recruiter, rating });
  }

  function submitNewComment() {
    if (!newComment.trim()) return;
    updateRecruiter({ ...recruiter, comments: [...(recruiter.comments || []), newComment.trim()] });
    setNewComment('');
    setAddingComment(false);
  }

  function removeComment(index: number) {
    updateRecruiter({ ...recruiter, comments: recruiter.comments.filter((_: string, i: number) => i !== index) });
  }

  const displayRating = hoverRating || recruiter.rating || 1;

  return (
    <div className="recruiter-grid-row-wrapper">
      <div className="recruiter-grid-row">
        <div className="--toggle-cell">
          <ActionButton
            iconClass={expanded ? "fas fa-caret-down" : "fas fa-caret-right"}
            color="blue"
            onClick={() => setExpanded(!expanded)}
          />
        </div>

        <div className="--truncate">{renderEditable('name', recruiter.name)}</div>
        <div className="--truncate">{renderEditable('company', recruiter.company)}</div>
        <div className="--truncate">{renderEditable('phone', recruiter.phone)}</div>
        <div className="--truncate">{renderEditable('email', recruiter.email)}</div>

        <div className="--stars">
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

        <div className="--actions">
          <ActionButton
            iconClass="fas fa-archive"
            title="archive this recruiter"
            color="blue"
            onClick={() => onClickArchive(recruiter.id, recruiter.name)}
          />
          <ActionButton
            color="red"
            iconClass="fas fa-trash"
            onClick={() => onClickDelete(recruiter.id, recruiter.name)}
          />
        </div>
      </div>

      <div className={`--expansion-wrapper${expanded ? " is-open" : ""}`}>
        <div className="--expansion-inner">
          <div className="--expanded-content">
            <div className="--expanded-row">
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

                {recruiter.comments?.map((comment: string, i: number) => (
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

export default RecruiterRow;
