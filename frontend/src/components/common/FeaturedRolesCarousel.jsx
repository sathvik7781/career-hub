import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAllJobs } from "../../features/jobs/hooks/useJobs";

const COLORS = [
  "142, 202, 252", "142, 249, 252", "142, 252, 204", "142, 252, 157",
  "215, 252, 142", "252, 252, 142", "252, 208, 142", "252, 142, 142",
  "252, 142, 239", "204, 142, 252",
];

const TYPE_ICONS = {
  "Full-time":  "💻",
  "Part-time":  "🕐",
  "Contract":   "⚙️",
  "Internship": "🎓",
  "Freelance":  "🚀",
  "Remote":     "🌐",
};

const STATIC_FALLBACK = [
  { title: "Frontend Developer",  company: "TechCorp",     type: "Full-time",  location: "Remote",     salary: "8k–15k",  },
  { title: "UI/UX Designer",      company: "Innovate.io",  type: "Full-time",  location: "Bangalore",  salary: "6k–12k",  },
  { title: "Backend Developer",   company: "GlobalTech",   type: "Contract",   location: "Hybrid",     salary: "10k–18k", },
  { title: "Data Analyst",        company: "DataWorks",    type: "Full-time",  location: "Mumbai",     salary: "7k–13k",  },
  { title: "DevOps Engineer",     company: "CloudBase",    type: "Remote",     location: "Remote",     salary: "12k–20k", },
  { title: "Product Manager",     company: "LaunchPad",    type: "Full-time",  location: "Delhi",      salary: "15k–25k", },
  { title: "Mobile Developer",    company: "AppStudio",    type: "Freelance",  location: "Remote",     salary: "9k–16k",  },
  { title: "ML Engineer",         company: "AILabs",       type: "Full-time",  location: "Hyderabad",  salary: "14k–22k", },
  { title: "QA Engineer",         company: "QualityFirst", type: "Contract",   location: "Pune",       salary: "5k–10k",  },
  { title: "Cloud Architect",     company: "SkyNet Inc.",  type: "Full-time",  location: "Remote",     salary: "20k–35k", },
];

export default function FeaturedRolesCarousel() {
  const navigate = useNavigate();
  const { data } = useAllJobs({ limit: 10 });
  const rawJobs = data?.data;

  const cards = (rawJobs?.length ? rawJobs : STATIC_FALLBACK).slice(0, 10).map((job, i) => ({
    id:       job._id || null,
    title:    job.title,
    company:  job.company?.name || job.company || "—",
    type:     job.type || "Full-time",
    location: job.location || "Remote",
    salary:   job.salary?.min
                ? `${(job.salary.min / 1000).toFixed(0)}k–${(job.salary.max / 1000).toFixed(0)}k`
                : job.salary || "Competitive",
    color:    COLORS[i % COLORS.length],
    icon:     TYPE_ICONS[job.type] || "💼",
  }));

  const handleClick = (card) => {
    if (card.id) navigate(`/jobs/${card.id}`);
    else navigate(`/jobs?keyword=${encodeURIComponent(card.title)}`);
  };

  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="inner" style={{ "--quantity": cards.length }}>
          {cards.map((card, i) => (
            <div
              key={i}
              className="card"
              style={{ "--index": i, "--colorCard": card.color }}
              onClick={() => handleClick(card)}
            >
              <div className="card-bg" />
              <div className="card-body">
                <div className="card-top">
                  <div className="card-icon">{card.icon}</div>
                  <span className="card-badge">{card.type}</span>
                </div>
                <div className="card-mid">
                  <p className="card-title">{card.title}</p>
                  <p className="card-company">{card.company}</p>
                </div>
                <div className="card-footer">
                  <span className="card-meta">📍 {card.location}</span>
                  <span className="card-meta">💰 {card.salary}</span>
                </div>
                <div className="card-cta">View Job →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;

  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .inner {
    --w: 180px;
    --h: 220px;
    --translateZ: 380px;
    --rotateX: -4deg;
    --perspective: 1200px;
    position: relative;
    width: var(--w);
    height: var(--h);
    z-index: 2;
    transform-style: preserve-3d;
    animation: rotating 25s linear infinite;
  }

  .wrapper:hover .inner {
    animation-play-state: running;
  }

  .card:hover ~ * ,
  .inner:has(.card:hover) {
    animation-play-state: paused;
  }

  .inner:has(.card:hover) {
    animation-play-state: paused;
  }

  @keyframes rotating {
    from { transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0); }
    to   { transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(1turn); }
  }

  .card {
    position: absolute;
    inset: 0;
    border-radius: 1rem;
    overflow: hidden;
    border: 1.5px solid rgba(var(--colorCard), 0.5);
    transform: rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ));
    cursor: pointer;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .card:hover {
    border-color: rgba(var(--colorCard), 1);
    box-shadow: 0 0 24px rgba(var(--colorCard), 0.5), 0 0 6px rgba(var(--colorCard), 0.3);
  }

  .card-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at top left, rgba(var(--colorCard), 0.25) 0%, transparent 60%),
      radial-gradient(ellipse at bottom right, rgba(var(--colorCard), 0.35) 0%, transparent 60%),
      linear-gradient(160deg, rgba(10, 15, 30, 0.92) 0%, rgba(15, 20, 40, 0.97) 100%);
  }

  .card-body {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0.875rem;
    gap: 0.5rem;
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-icon {
    font-size: 1.4rem;
    line-height: 1;
    filter: drop-shadow(0 0 6px rgba(var(--colorCard), 0.7));
  }

  .card-badge {
    font-size: 0.55rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgba(var(--colorCard), 1);
    background: rgba(var(--colorCard), 0.12);
    border: 1px solid rgba(var(--colorCard), 0.3);
    padding: 0.2rem 0.45rem;
    border-radius: 999px;
  }

  .card-mid {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.2rem;
  }

  .card-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.3;
    text-shadow: 0 1px 8px rgba(0,0,0,0.6);
  }

  .card-company {
    font-size: 0.65rem;
    font-weight: 500;
    color: rgba(var(--colorCard), 0.85);
  }

  .card-footer {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(var(--colorCard), 0.15);
  }

  .card-meta {
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.55);
  }

  .card-cta {
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(var(--colorCard), 0.9);
    text-align: right;
    letter-spacing: 0.03em;
    margin-top: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .card:hover .card-cta {
    opacity: 1;
  }
`;
