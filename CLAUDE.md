# pe-mfe-job-search — Claude Context

## What This Is

The job application tracking MFE. Full CRUD for job applications and recruiters. Complete and deployed.

Port: 3003. Accessed via the shell at `/job-search/*`.

---

## Domain Model

### Job
Fields: `jobTitle`, `companyName`, `workFrom` (enum), `status` (enum), `dateApplied`, `recruiterId?`, `companyAddress?`, `companyCity?`, `companyState?`, `pointOfContact?`, `pocTitle?`, `links?` (primary + secondary URL), `interviews?` (array), `comments?` (array), `archived?`

`workFrom` and `status` option arrays are defined in `src/utils/constants.ts`. Default status on create is `'applied'`.

### Recruiter
Fields: `name`, `company`, `email`, `phone?`, `rating?` (1–5 star), `comments?` (array), `archived?`

---

## Pages / Routes

Single page (`/` only). `JobsList` and `RecruitersList` are rendered vertically stacked on the index route. No sub-routes.

---

## Component Structure

```
src/
  components/
    jobs/
      JobsList.tsx              ← container; manages modal state, sort, delete/archive
      JobRow.tsx                ← expandable row; inline editing on double-click
      JobModal.tsx              ← create form
      JobsFilter.tsx            ← filter panel (company, status, workFrom, recruiter, dates, archived)
    recruiters/
      RecruitersList.tsx        ← container
      RecruiterRow.tsx          ← expandable row; inline editing, star rating
      RecruiterModal.tsx        ← create form
    shared/
      DeleteConfirmationModal.tsx
  hooks/
    jobHooks.ts                 ← useGetJobs, useCreateJob, useUpdateJob, useDeleteJob
    recruiterHooks.ts           ← useGetRecruiters, useCreateRecruiter, useUpdateRecruiter, useDeleteRecruiter
  store/
    jobs/
      jobFilterStore.ts         ← Zustand; all filter state (company, status, workFrom, recruiter, dates, archived, sortBy, sortDir)
  api/
    baseApi.ts                  ← BaseApi class; adds X-Trace-ID header on every request
    jobApi.ts
    recruiterApi.ts
  utils/
    axios.ts                    ← axiosAuth (API_URL), axiosPublic (AUTH_URL for refresh)
    constants.ts                ← status and workFrom option arrays
```

---

## Key Patterns

### Inline editing
Double-click any field in an expanded row to edit it in place. Saves on blur. Array fields (interviews, comments) have add/remove controls.

### Filter state
`jobFilterStore` (Zustand) holds all filter values. `useGetJobs` passes the full filter object as query params to `GET /jobs`. The full params object is included in the TanStack Query key so each filter combination caches independently.

### Tracing
`baseApi.ts` adds `X-Trace-ID: <uuid>` on every request. The header is sent but the frontend doesn't yet poll go-tracer for results — that's the hook point for future tracing integration.

---

## env vars

- `API_URL` → go-job-search base URL (default: `http://localhost:8083`)
- `AUTH_URL` → go-auth base URL for token refresh (default: `http://localhost:8080`)

---

## Tailwind
Uses `tw:` prefix (`tw:flex`, `tw:text-sm`, etc.) — required by the MFE Tailwind config.

## pe-mfe-utils
`@bka-stuff/pe-mfe-utils` is installed via `github:` URL (public tarball). Never use `pnpm link` or workspace overrides — breaks CI.
