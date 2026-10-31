'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  MapPin,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react'

type Category = 'Technology' | 'Education' | 'Design' | 'Administration'
type Job = {
  id: number
  title: string
  company: string
  initials: string
  category: Category
  location: string
  salary: string
  posted: string
  description: string
  color: string
}
type Application = {
  id: number
  jobId: number
  jobTitle: string
  company: string
  applicant: string
  email: string
  note: string
  status: 'Submitted' | 'Under Review'
  date: string
}

type Employer = { name: string; industry: string; location: string; jobs: number; initials: string; color: string }

const seedJobs: Job[] = [
  { id: 1, title: 'Senior Product Designer', company: 'Nexa Labs', initials: 'NL', category: 'Design', location: 'Lagos, Nigeria', salary: '$4,500 – $6,000 / mo', posted: '2 days ago', description: 'Lead product design across our next generation of financial tools and shape experiences used by millions.', color: 'bg-[#dcefe8] text-[#15725e]' },
  { id: 2, title: 'Frontend Engineer', company: 'Kora Technologies', initials: 'KT', category: 'Technology', location: 'Remote · Africa', salary: '$3,500 – $5,200 / mo', posted: '4 days ago', description: 'Build elegant, performant web experiences with a product-minded engineering team that ships fast.', color: 'bg-[#e4e5fb] text-[#5157a7]' },
  { id: 3, title: 'Secondary School Teacher', company: 'Greenfield Academy', initials: 'GA', category: 'Education', location: 'Abuja, Nigeria', salary: '₦280k – ₦420k / mo', posted: '1 week ago', description: 'Inspire curious learners in a collaborative environment that values creativity, care and excellence.', color: 'bg-[#fbe8d7] text-[#b9662b]' },
  { id: 4, title: 'Operations Coordinator', company: 'Oasis Health', initials: 'OH', category: 'Administration', location: 'Port Harcourt, Nigeria', salary: '₦220k – ₦350k / mo', posted: '1 week ago', description: 'Keep our people and processes moving smoothly while making a meaningful impact on patient care.', color: 'bg-[#dceaf4] text-[#327097]' },
  { id: 5, title: 'UX Researcher', company: 'Mosaic Studio', initials: 'MS', category: 'Design', location: 'Remote · Worldwide', salary: '$3,800 – $5,000 / mo', posted: '2 weeks ago', description: 'Turn customer insight into clear product direction for a studio building brands people love.', color: 'bg-[#f1e0ef] text-[#98518c]' },
  { id: 6, title: 'Data Science Lead', company: 'Atlas Finance', initials: 'AF', category: 'Technology', location: 'Lagos, Nigeria', salary: '$5,500 – $7,500 / mo', posted: '2 weeks ago', description: 'Guide data strategy and unlock the models that power smarter financial decisions across Africa.', color: 'bg-[#e3eee0] text-[#4f7c4a]' },
]

const seedEmployers: Employer[] = [
  { name: 'Nexa Labs', industry: 'Technology & Product', location: 'Lagos, Nigeria', jobs: 12, initials: 'NL', color: 'bg-[#dcefe8] text-[#15725e]' },
  { name: 'Kora Technologies', industry: 'Software & Fintech', location: 'Lagos · Remote', jobs: 8, initials: 'KT', color: 'bg-[#e4e5fb] text-[#5157a7]' },
  { name: 'Greenfield Academy', industry: 'Education', location: 'Abuja, Nigeria', jobs: 6, initials: 'GA', color: 'bg-[#fbe8d7] text-[#b9662b]' },
  { name: 'Oasis Health', industry: 'Healthcare', location: 'Port Harcourt, Nigeria', jobs: 4, initials: 'OH', color: 'bg-[#dceaf4] text-[#327097]' },
]

const categories: Array<'All categories' | Category> = ['All categories', 'Technology', 'Education', 'Design', 'Administration']

export default function Page() {
  const [activeTab, setActiveTab] = useState('Browse Jobs')
  const [jobs, setJobs] = useState(seedJobs)
  const [applications, setApplications] = useState<Application[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('All categories')
  const [showApply, setShowApply] = useState<Job | null>(null)
  const [showPost, setShowPost] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({ name: '', email: '', note: '' })
  const [jobForm, setJobForm] = useState({ title: '', company: '', category: 'Technology' as Category, location: '', salary: '', description: '' })

  useEffect(() => {
    try {
      const savedJobs = window.localStorage.getItem('prinesther-jobs')
      const savedApplications = window.localStorage.getItem('prinesther-applications')
      if (savedJobs) setJobs(JSON.parse(savedJobs))
      if (savedApplications) setApplications(JSON.parse(savedApplications))
    } catch { /* browser storage may be unavailable */ }
  }, [])

  useEffect(() => { window.localStorage.setItem('prinesther-jobs', JSON.stringify(jobs)) }, [jobs])
  useEffect(() => { window.localStorage.setItem('prinesther-applications', JSON.stringify(applications)) }, [applications])
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 3500); return () => window.clearTimeout(timer) }, [toast])

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const haystack = `${job.title} ${job.company} ${job.description}`.toLowerCase()
    return haystack.includes(query.toLowerCase()) && (category === 'All categories' || job.category === category)
  }), [jobs, query, category])

  function submitApplication(event: React.FormEvent) {
    event.preventDefault()
    if (!showApply || !form.name || !form.email || !form.note) return
    setApplications((current) => [{ id: Date.now(), jobId: showApply.id, jobTitle: showApply.title, company: showApply.company, applicant: form.name, email: form.email, note: form.note, status: 'Submitted', date: 'Just now' }, ...current])
    setShowApply(null); setForm({ name: '', email: '', note: '' }); setToast('Application submitted successfully')
  }

  function submitJob(event: React.FormEvent) {
    event.preventDefault()
    if (!jobForm.title || !jobForm.company || !jobForm.location || !jobForm.salary || !jobForm.description) return
    const initials = jobForm.company.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()
    setJobs((current) => [{ ...jobForm, id: Date.now(), initials, posted: 'Just now', color: 'bg-[#e7e1f6] text-[#66539a]' }, ...current])
    setShowPost(false); setJobForm({ title: '', company: '', category: 'Technology', location: '', salary: '', description: '' }); setActiveTab('Browse Jobs'); setToast('Your job is now live')
  }

  return (
    <main className="min-h-screen bg-[#f8faf9] text-[#172c2a]">
      <header className="border-b border-[#e7eeeb] bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 lg:px-8">
          <button className="flex items-center gap-3" onClick={() => setActiveTab('Browse Jobs')} aria-label="Go to Browse Jobs">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#0e6552] text-white shadow-sm"><BriefcaseBusiness /></span>
            <span className="text-left"><span className="block font-semibold tracking-tight">Prinesther <span className="text-[#0e8b6d]">Jobs</span></span><span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-[#8a9b96]">Find work that matters</span></span>
          </button>
          <nav className="hidden items-center gap-1 rounded-full bg-[#f4f7f5] p-1 md:flex" aria-label="Main navigation">
            {['Browse Jobs', 'My Applications', 'Employer Profiles'].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-5 py-2 text-sm font-medium transition ${activeTab === tab ? 'bg-white text-[#0e6552] shadow-sm' : 'text-[#71817c] hover:text-[#172c2a]'}`}>{tab}</button>)}
          </nav>
          <button onClick={() => setShowPost(true)} className="flex items-center gap-2 rounded-lg bg-[#0e6552] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5545]"><Plus /> <span className="hidden sm:inline">Post a Job</span></button>
        </div>
        <div className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-5 pb-3 md:hidden"><span className="sr-only">Mobile navigation</span>{['Browse Jobs', 'My Applications', 'Employer Profiles'].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium ${activeTab === tab ? 'bg-[#e5f2ed] text-[#0e6552]' : 'bg-[#f4f7f5] text-[#71817c]'}`}>{tab}</button>)}</div>
      </header>

      <section className="mx-auto max-w-[1240px] px-5 pb-16 pt-10 lg:px-8 lg:pt-14">
        {activeTab === 'Browse Jobs' && <>
          <div className="relative overflow-hidden rounded-2xl bg-[#103f38] px-6 py-10 text-white shadow-sm sm:px-10 lg:px-14 lg:py-12"><div className="relative z-10 max-w-2xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-[#b8e8d8]"><Sparkles /> Curated opportunities for ambitious people</div><h1 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Your next chapter <span className="text-[#69d5b0]">starts here.</span></h1><p className="mt-4 max-w-lg text-sm leading-6 text-[#c0d8d1] sm:text-base">Discover meaningful work with companies that are building what&apos;s next across Africa and beyond.</p></div><div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full border-[32px] border-[#1a6658] opacity-60" /><div className="pointer-events-none absolute -bottom-40 right-24 size-80 rounded-full border-[32px] border-[#1a6658] opacity-50" /></div>
          <div className="relative z-10 -mt-6 rounded-xl border border-[#e7eeeb] bg-white p-3 shadow-[0_14px_35px_rgba(16,63,56,0.10)]"><div className="grid gap-3 md:grid-cols-[1fr_210px_auto]"><label className="flex items-center gap-3 rounded-lg bg-[#f7faf8] px-4 py-3"><Search className="text-[#7d938b]" /><span className="sr-only">Search jobs</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by role, company, or keyword" className="w-full bg-transparent text-sm outline-none placeholder:text-[#9aac a5]" /></label><label className="flex items-center gap-3 rounded-lg bg-[#f7faf8] px-4 py-3"><BriefcaseBusiness className="text-[#7d938b]" /><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value as typeof category)} className="w-full bg-transparent text-sm text-[#4d635c] outline-none"><option>All categories</option>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select><ChevronDown className="pointer-events-none text-[#7d938b]" /></label><button onClick={() => setQuery(query.trim())} className="rounded-lg bg-[#0e6552] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0b5545]">Search jobs</button></div></div>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0e8b6d]">Explore opportunities</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Latest job openings</h2></div><p className="text-sm text-[#7d8d88]"><span className="font-semibold text-[#172c2a]">{filteredJobs.length}</span> roles matching your search</p></div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">{filteredJobs.map((job) => <JobCard key={job.id} job={job} onApply={() => setShowApply(job)} />)}</div>{filteredJobs.length === 0 && <div className="mt-5 rounded-xl border border-dashed border-[#cbdcd5] bg-white py-16 text-center"><Search className="mx-auto text-[#9bb1a9]" /><p className="mt-3 font-medium">No roles found</p><p className="mt-1 text-sm text-[#80918b]">Try a different keyword or category.</p></div>}
        </>}
        {activeTab === 'My Applications' && <ApplicationsView applications={applications} onDelete={(id) => setApplications((current) => current.filter((item) => item.id !== id))} />}
        {activeTab === 'Employer Profiles' && <EmployersView employers={seedEmployers} />}
      </section>

      {showApply && <Modal title="Apply for this role" onClose={() => setShowApply(null)}><div className="mb-5 rounded-lg bg-[#f0f7f4] p-4"><p className="font-semibold">{showApply.title}</p><p className="mt-1 text-sm text-[#6f817b]">{showApply.company} · {showApply.location}</p></div><form onSubmit={submitApplication} className="flex flex-col gap-4"><Field label="Full name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="e.g. Amaka Okafor" /><Field label="Email address" value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="you@example.com" type="email" /><label className="flex flex-col gap-2 text-sm font-medium">Cover note<textarea required value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Tell the employer why you are a great fit..." rows={5} className="resize-none rounded-lg border border-[#dce7e2] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0e8b6d] focus:ring-2 focus:ring-[#b5e3d5]" /></label><button className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#0e6552] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0b5545]"><Send /> Submit application</button></form></Modal>}
      {showPost && <Modal title="Post a new job" onClose={() => setShowPost(false)}><form onSubmit={submitJob} className="grid gap-4 sm:grid-cols-2"><Field label="Job title" value={jobForm.title} onChange={(value) => setJobForm({ ...jobForm, title: value })} placeholder="e.g. Product Manager" /><Field label="Company" value={jobForm.company} onChange={(value) => setJobForm({ ...jobForm, company: value })} placeholder="Company name" /><label className="flex flex-col gap-2 text-sm font-medium">Category<select value={jobForm.category} onChange={(event) => setJobForm({ ...jobForm, category: event.target.value as Category })} className="rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0e8b6d]"><option>Technology</option><option>Education</option><option>Design</option><option>Administration</option></select></label><Field label="Location" value={jobForm.location} onChange={(value) => setJobForm({ ...jobForm, location: value })} placeholder="e.g. Lagos or Remote" /><Field label="Salary range" value={jobForm.salary} onChange={(value) => setJobForm({ ...jobForm, salary: value })} placeholder="e.g. ₦400k – ₦600k / mo" /><label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">Job description<textarea required value={jobForm.description} onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })} placeholder="Share what this person will do..." rows={4} className="resize-none rounded-lg border border-[#dce7e2] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0e8b6d] focus:ring-2 focus:ring-[#b5e3d5]" /></label><button className="flex items-center justify-center gap-2 rounded-lg bg-[#0e6552] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0b5545] sm:col-span-2"><Plus /> Publish job</button></form></Modal>}
      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#103f38] px-4 py-3 text-sm font-medium text-white shadow-lg"><CheckCircle2 className="text-[#69d5b0]" /> {toast}</div>}
    </main>
  )
}

function JobCard({ job, onApply }: { job: Job; onApply: () => void }) { return <article className="group flex flex-col justify-between rounded-xl border border-[#e3ece8] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#a6d7c7] hover:shadow-[0_10px_28px_rgba(30,75,64,0.08)] sm:p-6"><div><div className="flex items-start justify-between gap-3"><div className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${job.color}`}>{job.initials}</div><span className="rounded-full bg-[#f2f6f4] px-2.5 py-1 text-[11px] font-semibold text-[#648078]">{job.category}</span></div><h3 className="mt-5 text-lg font-semibold tracking-tight">{job.title}</h3><p className="mt-1 text-sm font-medium text-[#0e8b6d]">{job.company}</p><p className="mt-3 text-sm leading-6 text-[#7b8d87]">{job.description}</p><div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#71837c]"><span className="flex items-center gap-1.5"><MapPin />{job.location}</span><span className="flex items-center gap-1.5"><Clock3 />{job.posted}</span></div></div><div className="mt-6 flex items-center justify-between border-t border-[#edf2ef] pt-4"><span className="text-sm font-semibold text-[#314940]">{job.salary}</span><button onClick={onApply} className="rounded-lg bg-[#e6f4ef] px-4 py-2 text-sm font-semibold text-[#0e6552] transition hover:bg-[#cceade]">Apply now</button></div></article> }

function ApplicationsView({ applications, onDelete }: { applications: Application[]; onDelete: (id: number) => void }) { return <><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0e8b6d]">Your career journey</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">My applications</h1><p className="mt-2 text-sm text-[#7d8d88]">Keep track of every opportunity you&apos;ve put your name forward for.</p></div><div className="rounded-xl bg-white px-5 py-3 text-center shadow-sm ring-1 ring-[#e3ece8]"><p className="text-2xl font-semibold text-[#0e6552]">{applications.length}</p><p className="text-[11px] font-medium uppercase tracking-wide text-[#80918b]">Total sent</p></div></div>{applications.length === 0 ? <div className="mt-8 rounded-xl border border-dashed border-[#cbdcd5] bg-white py-20 text-center"><FileText className="mx-auto text-[#9bb1a9]" /><p className="mt-3 font-medium">No applications yet</p><p className="mt-1 text-sm text-[#80918b]">Your submitted applications will appear here.</p></div> : <div className="mt-8 flex flex-col gap-3">{applications.map((application) => <div key={application.id} className="flex flex-col gap-4 rounded-xl border border-[#e3ece8] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4"><div className="flex size-10 items-center justify-center rounded-lg bg-[#e6f4ef] text-[#0e6552]"><FileText /></div><div><h2 className="font-semibold">{application.jobTitle}</h2><p className="mt-1 text-sm text-[#71837c]">{application.company} · Applied {application.date}</p></div></div><div className="flex items-center justify-between gap-5 sm:justify-end"><span className="flex items-center gap-1.5 rounded-full bg-[#fff3dc] px-3 py-1.5 text-xs font-semibold text-[#9a691d]"><Clock3 />{application.status}</span><button onClick={() => onDelete(application.id)} className="rounded-lg p-2 text-[#9aa9a4] hover:bg-[#fff0ef] hover:text-[#b84c42]" aria-label={`Delete application for ${application.jobTitle}`}><Trash2 /></button></div></div>)}</div>}</> }

function EmployersView({ employers }: { employers: Employer[] }) { return <><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0e8b6d]">Meet the teams</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Employer profiles</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#7d8d88]">Get to know the organizations creating the next wave of opportunity.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{employers.map((employer) => <article key={employer.name} className="rounded-xl border border-[#e3ece8] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(30,75,64,0.08)]"><div className={`flex size-12 items-center justify-center rounded-xl text-sm font-bold ${employer.color}`}>{employer.initials}</div><h2 className="mt-5 font-semibold">{employer.name}</h2><p className="mt-1 text-sm text-[#0e8b6d]">{employer.industry}</p><p className="mt-4 flex items-center gap-2 text-xs text-[#7b8d87]"><MapPin />{employer.location}</p><div className="mt-5 border-t border-[#edf2ef] pt-4 text-sm"><span className="font-semibold text-[#314940]">{employer.jobs}</span> active roles</div></article>)}</div></> }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#102c27]/40 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-semibold tracking-tight">{title}</h2><button onClick={onClose} className="rounded-full p-2 text-[#80918b] hover:bg-[#f0f5f3]" aria-label="Close modal"><X /></button></div>{children}</div></div> }

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) { return <label className="flex flex-col gap-2 text-sm font-medium">{label}<input required type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="rounded-lg border border-[#dce7e2] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0e8b6d] focus:ring-2 focus:ring-[#b5e3d5]" /></label> }
