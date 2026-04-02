import { useState } from "react";
import { useMyApplications } from "../../applications/hooks/useApplications";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, FileText, ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import styled from "styled-components";

const STATUS_CONFIG = {
  applied:   { color: "#3b82f6", glow: "59,130,246",  icon: "📨", label: "Applied"   },
  screening: { color: "#a855f7", glow: "168,85,247",  icon: "🔎", label: "Screening" },
  interview: { color: "#f59e0b", glow: "245,158,11",  icon: "🗓️", label: "Interview" },
  offer:     { color: "#06b6d4", glow: "6,182,212",   icon: "🎉", label: "Offer"     },
  hired:     { color: "#10b981", glow: "16,185,129",  icon: "✅", label: "Hired"     },
  rejected:  { color: "#6b7280", glow: "107,114,128", icon: "❌", label: "Rejected"  },
};

function ApplicationFlipCard({ app }) {
  const navigate = useNavigate();
  const s        = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
  const title    = app.job?.title             || "Job Unavailable";
  const company  = app.job?.company?.name     || "Company Unavailable";
  const type     = app.job?.type              || "—";
  const location = app.job?.location          || "—";
  const salary   = app.job?.salary?.min
    ? `${(app.job.salary.min / 1000).toFixed(0)}k – ${(app.job.salary.max / 1000).toFixed(0)}k`
    : "Competitive";
  const date = new Date(app.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <StyledCard $glow={s.glow} $color={s.color}>
      {/* Card flips on hover, navigates on click */}
      <div className="card">
        <div className="content">

          {/* ── Back — status glow (default visible) ── */}
          <div className="back">
            <div className="back-content">
              <span className="status-icon">{s.icon}</span>
              <strong className="status-label">{s.label}</strong>
              <span className="hint">hover to flip</span>
            </div>
          </div>

          {/* ── Front — job details (visible on hover) ── */}
          <div className="front">
            {/* Floating color blobs — use classNames not IDs */}
            <div className="img">
              <div className="circle circle-main" />
              <div className="circle circle-right" />
              <div className="circle circle-bottom" />
            </div>
            <div className="front-content">
              <small className="badge">{type}</small>
              <div className="description">
                <div className="title-row">
                  <p className="job-title">{title}</p>
                  <span className="status-dot">{s.icon}</span>
                </div>
                <p className="company-name">{company}</p>
                <div className="meta-row">
                  <span>📍 {location}</span>
                  <span>💰 {salary}</span>
                </div>
                <p className="card-footer">🗓 {date}</p>
              </div>
              {app.job?._id && (
                <button
                  className="view-btn"
                  onClick={() => navigate(`/jobs/${app.job._id}`)}
                >
                  View Job →
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </StyledCard>
  );
}

export default function MyApplicationsPage() {
  const { data, isLoading } = useMyApplications();
  const applications = data || [];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = applications.filter((app) => {
    const matchSearch = !search ||
      app.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      app.job?.company?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-secondary w-8 h-8" />
      </div>
    );

  return (
    <div className="page-container animate-fadeIn section-spacing">

      <div className="mb-8">
        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Seeker</p>
        <h1 className="heading-xl text-primary">My Applications</h1>
        <p className="text-sm text-secondary mt-1">
          {filtered.length} of {applications.length} application{applications.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search & Filter */}
      {applications.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex items-center gap-2 flex-1 bg-surface border border-app rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-primary placeholder:text-secondary"
            />
          </div>
          <div className="flex items-center gap-2 bg-surface border border-app rounded-xl px-4 py-2.5">
            <SlidersHorizontal className="w-4 h-4 text-muted shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none text-sm text-secondary cursor-pointer"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([key, { label, icon }]) => (
                <option key={key} value={key}>{icon} {label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="card p-12 text-center border-dashed">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="heading-md text-primary mb-2">No applications yet</h3>
          <p className="text-secondary text-sm mb-6">Start applying to jobs to track your progress here.</p>
          <Link to="/jobs" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors">
            Browse Jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-secondary text-sm">No applications match your search.</p>
          <button onClick={() => { setSearch(""); setStatusFilter(""); }} className="text-primary-600 dark:text-primary-400 text-sm font-medium mt-2 hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
          {filtered.map((app) => (
            <ApplicationFlipCard key={app._id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}

const StyledCard = styled.div`
  .card {
    overflow: visible;
    width: 190px;
    height: 270px;
  }

  .content {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 400ms ease;
    box-shadow: 0 0 10px 1px #000000cc;
    border-radius: 8px;
  }

  .card:hover .content {
    transform: rotateY(180deg);
  }

  .front, .back {
    background-color: #151515;
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 8px;
    overflow: hidden;
  }

  /* ── Back ── */
  .back {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .back::before {
    position: absolute;
    content: '';
    width: 160px;
    height: 160%;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ $color }) => $color},
      ${({ $color }) => $color},
      transparent
    );
    animation: spin 5s infinite linear;
  }

  .back-content {
    position: absolute;
    width: 99%;
    height: 99%;
    background-color: #151515;
    border-radius: 7px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .status-icon {
    font-size: 2.4rem;
    filter: drop-shadow(0 0 12px rgba(${({ $glow }) => $glow}, 0.9));
  }

  .status-label {
    font-size: 1rem;
    font-weight: 700;
    color: ${({ $color }) => $color};
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .hint {
    font-size: 0.58rem;
    color: rgba(255,255,255,0.3);
    margin-top: 2px;
  }

  @keyframes spin {
    0%   { transform: rotateZ(0deg); }
    100% { transform: rotateZ(360deg); }
  }

  /* ── Front ── */
  .front {
    transform: rotateY(180deg);
    color: white;
  }

  .img {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .circle {
    border-radius: 50%;
    filter: blur(15px);
    animation: floating 2600ms ease-in-out infinite;
    position: absolute;
  }

  .circle-main {
    width: 90px;
    height: 90px;
    background-color: ${({ $color }) => $color}99;
    top: -10px;
    left: -10px;
  }

  .circle-bottom {
    background-color: ${({ $color }) => $color}66;
    left: 50px;
    top: 60px;
    width: 150px;
    height: 150px;
    animation-delay: -800ms;
  }

  .circle-right {
    background-color: ${({ $color }) => $color}44;
    left: 150px;
    top: -60px;
    width: 40px;
    height: 40px;
    animation-delay: -1800ms;
  }

  @keyframes floating {
    0%, 100% { transform: translateY(0);    }
    50%       { transform: translateY(10px); }
  }

  .front-content {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .badge {
    background: rgba(0,0,0,0.45);
    padding: 2px 10px;
    border-radius: 10px;
    backdrop-filter: blur(4px);
    width: fit-content;
    font-size: 0.62rem;
    color: rgba(255,255,255,0.85);
    border: 1px solid rgba(255,255,255,0.1);
  }

  .description {
    width: 100%;
    padding: 8px 10px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(6px);
    border-radius: 6px;
    box-shadow: 0 0 10px 4px rgba(0,0,0,0.5);
  }

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 4px;
  }

  .job-title {
    font-size: 0.74rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.3;
    flex: 1;
  }

  .status-dot { font-size: 0.8rem; flex-shrink: 0; }

  .company-name {
    font-size: 0.62rem;
    color: ${({ $color }) => $color};
    margin-top: 3px;
    font-weight: 600;
  }

  .meta-row {
    display: flex;
    gap: 6px;
    margin-top: 5px;
    flex-wrap: wrap;
  }

  .meta-row span {
    font-size: 0.56rem;
    color: rgba(255,255,255,0.5);
  }

  .card-footer {
    font-size: 0.56rem;
    color: rgba(255,255,255,0.35);
    margin-top: 4px;
  }

  .view-btn {
    width: 100%;
    padding: 5px 0;
    background: ${({ $color }) => $color}22;
    border: 1px solid ${({ $color }) => $color}55;
    border-radius: 5px;
    color: ${({ $color }) => $color};
    font-size: 0.62rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease;
    letter-spacing: 0.04em;
  }

  .view-btn:hover {
    background: ${({ $color }) => $color}44;
  }
`;
