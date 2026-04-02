import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAllCompanies } from "../../features/recruiter/hooks/useCompany";
import { Building2, MapPin, Globe, Briefcase } from "lucide-react";

const CARD_WIDTH  = 200;
const CARD_HEIGHT = 240;

const GRADIENTS = [
  "linear-gradient(135deg, #0060c4 0%, #38bdf8 100%)",
  "linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)",
  "linear-gradient(135deg, #0f766e 0%, #5eead4 100%)",
  "linear-gradient(135deg, #ea580c 0%, #fbbf24 100%)",
  "linear-gradient(135deg, #be185d 0%, #fb7185 100%)",
  "linear-gradient(135deg, #1d4ed8 0%, #818cf8 100%)",
  "linear-gradient(135deg, #065f46 0%, #34d399 100%)",
  "linear-gradient(135deg, #92400e 0%, #fcd34d 100%)",
  "linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)",
  "linear-gradient(135deg, #0e7490 0%, #67e8f9 100%)",
  "linear-gradient(135deg, #9d174d 0%, #f9a8d4 100%)",
  "linear-gradient(135deg, #166534 0%, #86efac 100%)",
  "linear-gradient(135deg, #1e3a8a 0%, #93c5fd 100%)",
  "linear-gradient(135deg, #78350f 0%, #fde68a 100%)",
  "linear-gradient(135deg, #4c1d95 0%, #ddd6fe 100%)",
  "linear-gradient(135deg, #134e4a 0%, #99f6e4 100%)",
  "linear-gradient(135deg, #7f1d1d 0%, #fca5a5 100%)",
  "linear-gradient(135deg, #1e40af 0%, #bfdbfe 100%)",
];

const STATIC_FALLBACK = [
  { name: "TechCorp Solutions", location: "Bangalore",   industry: "Software",    openRoles: 12 },
  { name: "Innovate.io",        location: "Mumbai",      industry: "Fintech",     openRoles: 8  },
  { name: "GlobalTech Inc.",    location: "Hyderabad",   industry: "IT Services", openRoles: 15 },
  { name: "DataWorks",          location: "Pune",        industry: "Analytics",   openRoles: 6  },
  { name: "CloudBase",          location: "Remote",      industry: "Cloud",       openRoles: 10 },
  { name: "AILabs",             location: "Hyderabad",   industry: "AI / ML",     openRoles: 9  },
  { name: "AppStudio",          location: "Delhi",       industry: "Mobile",      openRoles: 5  },
  { name: "LaunchPad",          location: "Bangalore",   industry: "Startup",     openRoles: 7  },
  { name: "QualityFirst",       location: "Chennai",     industry: "QA / Testing",openRoles: 4  },
  { name: "NexaDigital",        location: "Noida",       industry: "Digital Mktg",openRoles: 6  },
  { name: "ByteForge",          location: "Remote",      industry: "DevOps",      openRoles: 11 },
  { name: "PixelCraft",         location: "Bangalore",   industry: "Design",      openRoles: 3  },
  { name: "SecureNet",          location: "Mumbai",      industry: "Cybersecurity",openRoles: 8 },
  { name: "HealthBridge",       location: "Hyderabad",   industry: "HealthTech",  openRoles: 5  },
  { name: "EduSpark",           location: "Pune",        industry: "EdTech",      openRoles: 7  },
  { name: "FinEdge",            location: "Bangalore",   industry: "Finance",     openRoles: 9  },
  { name: "LogiTrack",          location: "Chennai",     industry: "Logistics",   openRoles: 6  },
  { name: "GreenSys",           location: "Remote",      industry: "CleanTech",   openRoles: 4  },
];

export default function PopularCompaniesSlider() {
  const navigate = useNavigate();
  const { data } = useAllCompanies();
  const raw = data || [];

  // Use real data if available, pad with static fallback to always have 18
  const realMapped = raw.map((c, i) => ({
    _id:      c._id,
    name:     c.name,
    location: c.location?.split(",")[0] || "India",
    industry: "Technology",
    openRoles: null,
    logo:     c.logo,
  }));

  const companies = realMapped.length
    ? [...realMapped, ...STATIC_FALLBACK].slice(0, 18)
    : STATIC_FALLBACK;

  const quantity = companies.length;

  return (
    <SliderWrapper>
      <div
        className="slider"
        style={{ "--width": `${CARD_WIDTH}px`, "--height": `${CARD_HEIGHT}px`, "--quantity": quantity }}
      >
        <div className="list">
          {companies.map((company, i) => (
            <div
              key={`${company.name}-${i}`}
              className="item"
              style={{ "--position": i + 1 }}
              onClick={() => company._id ? navigate(`/companies/${company._id}`) : navigate("/companies")}
            >
              <div className="card" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
                {/* bg glow */}
                <div className="card-glow" />

                {/* icon */}
                <div className="card-icon">
                  {company.logo
                    ? <img src={company.logo} alt={company.name} className="logo-img" />
                    : <Building2 className="building-icon" />
                  }
                </div>

                {/* content */}
                <div className="card-body">
                  <p className="company-name">{company.name}</p>
                  <span className="industry-badge">{company.industry}</span>
                  <div className="card-meta-list">
                    <p className="company-meta">
                      <MapPin className="meta-icon" /> {company.location}
                    </p>
                    {company.openRoles !== null && (
                      <p className="company-meta">
                        <Briefcase className="meta-icon" /> {company.openRoles} open roles
                      </p>
                    )}
                  </div>
                </div>

                <div className="card-cta">View Jobs →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SliderWrapper>
  );
}

const SliderWrapper = styled.div`
  width: 100%;

  .slider {
    width: 100%;
    height: var(--height);
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 8% 92%, transparent);
  }

  .list {
    display: flex;
    width: 100%;
    min-width: calc(var(--width) * var(--quantity));
    position: relative;
  }

  .item {
    width: var(--width);
    height: var(--height);
    position: absolute;
    left: 100%;
    animation: autoRun 30s linear infinite;
    transition: filter 0.4s ease;
    animation-delay: calc((30s / var(--quantity)) * (var(--position) - 1) - 30s);
    cursor: pointer;
    padding: 0 8px;
  }

  @keyframes autoRun {
    from { left: 100%; }
    to   { left: calc(var(--width) * -1); }
  }

  .slider:hover .item {
    animation-play-state: paused !important;
    filter: grayscale(0.5) brightness(0.8);
  }

  .item:hover {
    filter: grayscale(0) brightness(1) !important;
    z-index: 10;
  }

  .item:hover .card {
    transform: translateY(-6px) scale(1.04);
    box-shadow: 0 16px 32px rgba(0,0,0,0.3);
  }

  .item:hover .card-cta {
    opacity: 1;
  }

  .card {
    width: 100%;
    height: 100%;
    padding: 1rem;
    border-radius: 1rem;
    border: 1.5px solid rgba(255,255,255,0.2);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    color: white;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .card-glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at top left, rgba(255,255,255,0.15) 0%, transparent 60%),
      radial-gradient(ellipse at bottom right, rgba(0,0,0,0.2) 0%, transparent 60%);
    pointer-events: none;
  }

  .card-icon {
    position: relative;
    z-index: 1;
  }

  .logo-img {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    object-fit: cover;
    border: 1.5px solid rgba(255,255,255,0.4);
  }

  .building-icon {
    width: 28px;
    height: 28px;
    color: rgba(255,255,255,0.9);
    filter: drop-shadow(0 0 6px rgba(255,255,255,0.4));
  }

  .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    position: relative;
    z-index: 1;
  }

  .company-name {
    font-size: 0.82rem;
    font-weight: 800;
    color: white;
    line-height: 1.2;
    text-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }

  .industry-badge {
    display: inline-flex;
    width: fit-content;
    font-size: 0.55rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.95);
    background: rgba(0,0,0,0.25);
    border: 1px solid rgba(255,255,255,0.25);
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
  }

  .card-meta-list {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: 0.25rem;
  }

  .company-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.62rem;
    color: rgba(255,255,255,0.7);
  }

  .meta-icon {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
  }

  .card-cta {
    position: relative;
    z-index: 1;
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255,255,255,0.9);
    letter-spacing: 0.04em;
    opacity: 0;
    transition: opacity 0.2s ease;
    margin-top: auto;
  }
`;
