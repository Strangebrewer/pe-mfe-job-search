import { FC, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetRecruiters } from "../../hooks/recruiterHooks";
import { STATUS_OPTIONS, WORK_FROM_OPTIONS } from "../../utils/constants";
import { Button } from '@bka-stuff/pe-mfe-utils';
import { useJobFilterStore } from "../../store/jobs/jobFilterStore";

const JobsFilter: FC = () => {
  const { setFilter, setFilters, resetFilters } = useJobFilterStore();
  const [companyInput, setCompanyInput] = useState('');
  const [dateMin, setDateMin] = useState<Date | null>(null);
  const [dateMax, setDateMax] = useState<Date | null>(null);

  const { data: recruiters } = useGetRecruiters();

  function handleSearch() {
    setFilters({
      company: companyInput,
      dateMin: dateMin ? dateMin.toISOString() : '',
      dateMax: dateMax ? dateMax.toISOString() : '',
    });
  }

  function handleClear() {
    setCompanyInput('');
    setDateMin(null);
    setDateMax(null);
    resetFilters();
  }

  return (
    <div className="jobs-filter">
      <div className="jobs-filter-fields">
        <input
          className="jobs-filter-input"
          placeholder="Company"
          value={companyInput}
          onChange={e => setCompanyInput(e.target.value)}
        />

        <select
          className="jobs-filter-select"
          onChange={e => setFilter('status', e.target.value)}
        >
          <option value="">Status</option>
          {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>

        <select
          className="jobs-filter-select"
          onChange={e => setFilter('workFrom', e.target.value)}
        >
          <option value="">Work Location...</option>
          {WORK_FROM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>

        <select
          className="jobs-filter-select"
          onChange={e => setFilter('recruiter', e.target.value)}
        >
          <option value="">Recruiter...</option>
          {recruiters?.map((r: Obj) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        <DatePicker
          className="jobs-filter-input"
          placeholderText="Date from"
          selected={dateMin}
          onChange={(date: Date | null) => setDateMin(date)}
          selectsStart
          startDate={dateMin}
          endDate={dateMax}
          isClearable
        />

        <DatePicker
          className="jobs-filter-input"
          placeholderText="Date to"
          selected={dateMax}
          onChange={(date: Date | null) => setDateMax(date)}
          selectsEnd
          startDate={dateMin}
          endDate={dateMax}
          minDate={dateMin ?? undefined}
          isClearable
        />
      </div>

      <div className="jobs-filter-actions">
        <Button color="blue" text="Search" onClick={handleSearch} />
        <Button color="grey" text="Clear" onClick={handleClear} />
      </div>

      <div className="jobs-filter-checks">
        <label className="jobs-filter-checkbox">
          <input
            type="checkbox"
            onChange={e => setFilter('archived', e.target.checked)}
          />
          Include archived
        </label>
        <label className="jobs-filter-checkbox">
          <input
            type="checkbox"
            onChange={e => setFilter('includeDeclined', e.target.checked)}
          />
          Include declined
        </label>
      </div>
    </div>
  );
};

export default JobsFilter;
