import { FC, useState } from 'react';
import { Input } from '@bka-stuff/pe-mfe-utils';
import { useGetCompanies } from '../../hooks/jobHooks';

const MAX_SUGGESTIONS = 8;

type CompanySuggestionsProps = {
  value: string;
  onChange: (value: string) => void;
};

const CompanySuggestions: FC<CompanySuggestionsProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const { data: companies } = useGetCompanies();

  const query = value.trim().toLowerCase();
  const matches = query
    ? (companies || [])
        .filter((c) => c.toLowerCase().includes(query) && c !== value)
        .slice(0, MAX_SUGGESTIONS)
    : [];

  function select(company: string) {
    onChange(company);
    setOpen(false);
  }

  return (
    <div
      className="company-suggestions"
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      <Input
        type="text"
        name="companyName"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        full
      />
      {open && matches.length > 0 && (
        <ul className="--suggestions-list">
          {matches.map((c) => (
            // mousedown + preventDefault keeps focus on the input so onBlur doesn't close the list first
            <li
              key={c}
              onMouseDown={(e) => {
                e.preventDefault();
                select(c);
              }}
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanySuggestions;
