import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Search, Briefcase, Building2, Users, ArrowRight, Zap } from "lucide-react";
import FeaturedRolesCarousel from "../components/common/FeaturedRolesCarousel";
import PopularCompaniesSlider from "../components/common/PopularCompaniesSlider";
import HeroButton from "../components/UI/HeroButton";
import Footer from "../components/layout/Footer";
import styled from "styled-components";

const HOW_IT_WORKS = [
  { icon: Search,    title: "Find Jobs",     desc: "Browse thousands of verified job listings across all industries and locations.",      gradient: "linear-gradient(135deg, #0060c4 0%, #38bdf8 100%)", to: "/jobs",      cta: "Browse Jobs"  },
  { icon: Users,     title: "Build Profile", desc: "Create your profile, upload your resume and showcase your skills to top recruiters.", gradient: "linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)", to: "/register",  cta: "Get Started"  },
  { icon: Building2, title: "Top Companies", desc: "Discover verified companies actively hiring and explore their open positions.",        gradient: "linear-gradient(135deg, #0f766e 0%, #5eead4 100%)", to: "/companies", cta: "Explore"      },
  { icon: Briefcase, title: "Post & Hire",   desc: "Recruiters can post jobs, review applications and manage their hiring pipeline.",      gradient: "linear-gradient(135deg, #ea580c 0%, #fbbf24 100%)", to: "/register",  cta: "Start Hiring" },
];

export default function Home() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn overflow-y-auto">

      {/* ── Hero ── */}
      <HeroSection>
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="page-container hero-content">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full hero-badge text-xs font-semibold mb-8">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Connecting talent with opportunity</span>
            </div>
            <h1 className="hero-heading">
              Find Your Next<br />
              <span className="hero-accent">Career Opportunity</span>
            </h1>
            <p className="hero-sub">
              CareerHub connects talented professionals with top companies. Whether you're hiring or job hunting, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-6">
              {!isAuthenticated ? (
                <>
                  <HeroButton label1="GetStarted" label2="Register" colors="purple" onClick={() => navigate("/register")} />
                  <HeroButton label1="SignIn"     label2="Login"    colors="blue"   onClick={() => navigate("/login")}    />
                </>
              ) : (
                <>
                  <HeroButton label1="FindJobs"   label2="BrowseNow"  colors="purple" onClick={() => navigate("/jobs")}      />
                  <HeroButton label1="Companies"  label2="ExploreNow" colors="blue"   onClick={() => navigate("/companies")} />
                </>
              )}
            </div>
          </div>
        </div>
      </HeroSection>

      {/* ── Stats ── */}
      <section className="bg-surface border-y border-app">
        <div className="page-container py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Briefcase, label: "Jobs Posted",  value: "1,200+", desc: "Active listings across all industries", gradient: "linear-gradient(43deg, #0060c4 0%, #0ea5e9 60%, #38bdf8 100%)", to: "/jobs"      },
              { icon: Users,     label: "Candidates",   value: "8,500+", desc: "Talented professionals on CareerHub",   gradient: "linear-gradient(43deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)", to: "/register"  },
              { icon: Building2, label: "Companies",    value: "300+",   desc: "Verified companies actively hiring",   gradient: "linear-gradient(43deg, #0f766e 0%, #14b8a6 50%, #5eead4 100%)", to: "/companies" },
            ].map(({ icon: Icon, label, value, desc, gradient, to }) => (
              <StyledStatCard key={label} $gradient={gradient} onClick={() => navigate(to)}>
                <div className="card">
                  <div className="card-content">
                    <Icon className="stat-icon" />
                    <p className="card-title">{value}</p>
                    <p className="stat-label">{label}</p>
                    <p className="card-para">{desc}</p>
                  </div>
                </div>
              </StyledStatCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="page-container py-16 md:py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="heading-xl text-primary">Built for both sides of hiring</h2>
          <p className="text-secondary text-sm mt-3 max-w-lg mx-auto">Four simple steps to connect talent with opportunity on CareerHub.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
          {HOW_IT_WORKS.map((item) => (
            <HowItWorksCard key={item.title} $gradient={item.gradient}>
              <div className="parent">
                <div className="card">
                  <div className="logo">
                    <span className="circle circle1" />
                    <span className="circle circle2" />
                    <span className="circle circle3" />
                    <span className="circle circle4" />
                    <span className="circle circle5">
                      <item.icon className="circle-icon" />
                    </span>
                  </div>
                  <div className="glass" />
                  <div className="content">
                    <span className="title">{item.title}</span>
                    <span className="text">{item.desc}</span>
                  </div>
                  <div className="bottom">
                    <Link to={item.to} className="action-btn">
                      {item.cta} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </HowItWorksCard>
          ))}
        </div>
      </section>

      {/* ── Featured Roles Carousel ── */}
      <section className="bg-app border-y border-app py-16 md:py-20">
        <div className="page-container">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">In Demand</p>
            <h2 className="heading-xl text-primary">Featured Job Roles</h2>
            <p className="text-sm text-secondary mt-3">Explore the most sought-after roles — hover to pause, click to explore</p>
          </div>
          <div className="h-[30rem] md:h-[36rem]">
            <FeaturedRolesCarousel />
          </div>
        </div>
      </section>

      {/* ── Popular Companies Slider ── */}
      <section className="page-container py-16 md:py-20">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">Top Employers</p>
          <h2 className="heading-xl text-primary">Popular Companies</h2>
          <p className="text-sm text-secondary mt-3">Hover to pause — click any company to explore their open roles</p>
        </div>
        <PopularCompaniesSlider />
      </section>

      {/* ── Features strip ── */}
      <section className="bg-app border-t border-app py-16 md:py-24">
        <div className="page-container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">Why CareerHub</p>
            <h2 className="heading-xl text-primary">Everything you need to hire or get hired</h2>
            <p className="hidden lg:block text-secondary text-sm mt-3 max-w-lg mx-auto">Move your mouse over each card to feel the 3D effect.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center">
            {[
              {
                gradient: "linear-gradient(43deg, #0060c4 0%, #0ea5e9 60%, #38bdf8 100%)",
                title: "Fast & Easy",
                points: ["Apply in seconds", "No repetitive forms", "One-click with saved profile", "Instant confirmation"],
              },
              {
                gradient: "linear-gradient(43deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
                title: "Verified Companies",
                points: ["Admin-reviewed listings", "No fake job posts", "Trusted employers only", "Safe application process"],
              },
              {
                gradient: "linear-gradient(43deg, #0f766e 0%, #14b8a6 50%, #5eead4 100%)",
                title: "Track Progress",
                points: ["Real-time status updates", "Applied to Hired pipeline", "All applications in one place", "Recruiter feedback"],
              },
            ].map((item) => (
              <FeatureCard key={item.title} $gradient={item.gradient}>
                <div className="container noselect">
                  <div className="canvas">
                    {Array.from({ length: 25 }, (_, i) => (
                      <div key={i} className={`tracker tr-${i + 1}`} />
                    ))}
                    <div id="card">
                      <div className="card-title">{item.title}</div>
                      <ul className="card-points">
                        {item.points.map((p) => (
                          <li key={p}>✦ {p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── Styled Components ──────────────────────────────────────────────────────────

const FeatureCard = styled.div`
  .container {
    position: relative;
    width: 260px;
    height: 320px;
    transition: 200ms;
  }
  .container:active { width: 248px; height: 308px; }

  #card {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 1.5rem;
    border-radius: 20px;
    transition: 700ms;
    background: ${({ $gradient }) => $gradient};
    gap: 0.75rem;
  }

  #card::before {
    content: '';
    background: ${({ $gradient }) => $gradient};
    filter: blur(2rem);
    opacity: 30%;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    transition: 200ms;
    border-radius: 20px;
  }

  .container:hover #card::before { opacity: 80%; }

  #prompt {
    bottom: 10px;
    right: 14px;
    z-index: 20;
    font-size: 0.7rem;
    font-weight: 600;
    transition: 300ms ease-in-out;
    position: absolute;
    color: rgba(255,255,255,0.6);
  }

  .tracker:hover ~ #card #prompt { opacity: 0; }

  .card-title {
    font-size: 1.1rem;
    font-weight: 800;
    color: white;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    opacity: 1;
  }

  .card-points {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    opacity: 1;
  }

  .tracker:hover ~ #card .card-points { opacity: 1; }

  .card-points li {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.9);
    font-weight: 500;
  }

  .canvas {
    perspective: 800px;
    inset: 0;
    z-index: 200;
    position: absolute;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-template-areas:
      "tr-1 tr-2 tr-3 tr-4 tr-5"
      "tr-6 tr-7 tr-8 tr-9 tr-10"
      "tr-11 tr-12 tr-13 tr-14 tr-15"
      "tr-16 tr-17 tr-18 tr-19 tr-20"
      "tr-21 tr-22 tr-23 tr-24 tr-25";
  }

  .tracker { position: absolute; z-index: 200; width: 100%; height: 100%; cursor: pointer; }
  .tracker:hover ~ #card { transition: 300ms; filter: brightness(1.1); }

  .tr-1  { grid-area: tr-1;  } .tr-2  { grid-area: tr-2;  } .tr-3  { grid-area: tr-3;  }
  .tr-4  { grid-area: tr-4;  } .tr-5  { grid-area: tr-5;  } .tr-6  { grid-area: tr-6;  }
  .tr-7  { grid-area: tr-7;  } .tr-8  { grid-area: tr-8;  } .tr-9  { grid-area: tr-9;  }
  .tr-10 { grid-area: tr-10; } .tr-11 { grid-area: tr-11; } .tr-12 { grid-area: tr-12; }
  .tr-13 { grid-area: tr-13; } .tr-14 { grid-area: tr-14; } .tr-15 { grid-area: tr-15; }
  .tr-16 { grid-area: tr-16; } .tr-17 { grid-area: tr-17; } .tr-18 { grid-area: tr-18; }
  .tr-19 { grid-area: tr-19; } .tr-20 { grid-area: tr-20; } .tr-21 { grid-area: tr-21; }
  .tr-22 { grid-area: tr-22; } .tr-23 { grid-area: tr-23; } .tr-24 { grid-area: tr-24; }
  .tr-25 { grid-area: tr-25; }

  .tr-1:hover~#card{transform:rotateX(20deg) rotateY(-10deg)} .tr-2:hover~#card{transform:rotateX(20deg) rotateY(-5deg)}
  .tr-3:hover~#card{transform:rotateX(20deg) rotateY(0deg)}   .tr-4:hover~#card{transform:rotateX(20deg) rotateY(5deg)}
  .tr-5:hover~#card{transform:rotateX(20deg) rotateY(10deg)}  .tr-6:hover~#card{transform:rotateX(10deg) rotateY(-10deg)}
  .tr-7:hover~#card{transform:rotateX(10deg) rotateY(-5deg)}  .tr-8:hover~#card{transform:rotateX(10deg) rotateY(0deg)}
  .tr-9:hover~#card{transform:rotateX(10deg) rotateY(5deg)}   .tr-10:hover~#card{transform:rotateX(10deg) rotateY(10deg)}
  .tr-11:hover~#card{transform:rotateX(0deg) rotateY(-10deg)} .tr-12:hover~#card{transform:rotateX(0deg) rotateY(-5deg)}
  .tr-13:hover~#card{transform:rotateX(0deg) rotateY(0deg)}   .tr-14:hover~#card{transform:rotateX(0deg) rotateY(5deg)}
  .tr-15:hover~#card{transform:rotateX(0deg) rotateY(10deg)}  .tr-16:hover~#card{transform:rotateX(-10deg) rotateY(-10deg)}
  .tr-17:hover~#card{transform:rotateX(-10deg) rotateY(-5deg)} .tr-18:hover~#card{transform:rotateX(-10deg) rotateY(0deg)}
  .tr-19:hover~#card{transform:rotateX(-10deg) rotateY(5deg)} .tr-20:hover~#card{transform:rotateX(-10deg) rotateY(10deg)}
  .tr-21:hover~#card{transform:rotateX(-20deg) rotateY(-10deg)} .tr-22:hover~#card{transform:rotateX(-20deg) rotateY(-5deg)}
  .tr-23:hover~#card{transform:rotateX(-20deg) rotateY(0deg)} .tr-24:hover~#card{transform:rotateX(-20deg) rotateY(5deg)}
  .tr-25:hover~#card{transform:rotateX(-20deg) rotateY(10deg)}

  .noselect {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  min-height: 88vh;
  display: flex;
  align-items: center;

  .hero-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% -10%, #0060c4 0%, #0ea5e9 40%, #e0f2fe 100%);
    z-index: 0;
  }

  /* dark mode override */
  .dark & .hero-bg {
    background: radial-gradient(ellipse 80% 60% at 50% -10%, #1e3a5f 0%, #0f172a 50%, #020617 100%);
  }

  .hero-grid {
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image:
      linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 3rem 3rem;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }

  .dark & .hero-grid {
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  }

  .hero-content {
    position: relative;
    z-index: 2;
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .hero-badge {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    color: white;
    backdrop-filter: blur(8px);
  }

  .dark & .hero-badge {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.12);
  }

  .hero-heading {
    font-size: clamp(2.2rem, 5vw, 3.75rem);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: #0f172a;
    margin-bottom: 1.5rem;
  }

  .dark & .hero-heading { color: #f1f5f9; }

  .hero-accent {
    background: linear-gradient(135deg, #0060c4, #0ea5e9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dark & .hero-accent {
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    color: #334155;
    font-size: 1.1rem;
    line-height: 1.7;
    max-width: 36rem;
    margin: 0 auto 2rem;
  }

  .dark & .hero-sub { color: #94a3b8; }
`;

const HowItWorksCard = styled.div`
  .parent {
    width: 240px;
    height: 280px;
    perspective: 1000px;
  }
  .card {
    height: 100%;
    border-radius: 40px;
    background: ${({ $gradient }) => $gradient};
    transition: all 0.5s ease-in-out;
    transform-style: preserve-3d;
    box-shadow: rgba(37,5,71,0) 40px 50px 25px -40px, rgba(34,5,71,0.2) 0px 25px 25px -5px;
    position: relative;
    z-index: 1;
  }
  .glass {
    transform-style: preserve-3d;
    position: absolute;
    inset: 8px;
    border-radius: 45px;
    border-top-right-radius: 100%;
    background: linear-gradient(0deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.7) 100%);
    backdrop-filter: blur(5px);
    transform: translate3d(0px, 0px, 25px);
    border-left: 1px solid white;
    border-bottom: 1px solid white;
    transition: all 0.5s ease-in-out;
  }
  .content {
    padding: 90px 40px 0px 24px;
    transform: translate3d(0, 0, 26px);
    position: relative;
    z-index: 10;
  }
  .title { display: block; color: #fff; font-weight: 900; font-size: 16px; }
  .text  { display: block; color: rgba(255,255,255,0.85); font-size: 12px; margin-top: 10px; line-height: 1.5; }
  .bottom {
    padding: 10px 16px;
    transform-style: preserve-3d;
    position: absolute;
    bottom: 16px; left: 16px; right: 16px;
    transform: translate3d(0, 0, 26px);
    z-index: 10;
  }
  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.9);
    color: #1e1e2e;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 999px;
    text-decoration: none;
    transition: background 0.2s ease, transform 0.2s ease;
    box-shadow: rgba(28,5,71,0.3) 0px 5px 10px -3px;
  }
  .action-btn:hover { background: white; transform: translate3d(0, 0, 20px) scale(1.05); }
  .logo { position: absolute; right: 0; top: 0; transform-style: preserve-3d; z-index: 5; }
  .circle {
    display: block; position: absolute; aspect-ratio: 1; border-radius: 50%;
    top: 0; right: 0;
    box-shadow: rgba(100,100,111,0.2) -10px 10px 20px 0px;
    backdrop-filter: blur(5px);
    background: rgba(255,255,255,0.2);
    transition: all 0.5s ease-in-out;
  }
  .circle1 { width: 140px; transform: translate3d(0,0,20px); top: 8px; right: 8px; }
  .circle2 { width: 115px; transform: translate3d(0,0,40px); top: 10px; right: 10px; backdrop-filter: blur(1px); transition-delay: 0.1s; }
  .circle3 { width: 90px;  transform: translate3d(0,0,60px); top: 17px; right: 17px; transition-delay: 0.2s; }
  .circle4 { width: 65px;  transform: translate3d(0,0,80px); top: 23px; right: 23px; transition-delay: 0.3s; }
  .circle5 { width: 42px;  transform: translate3d(0,0,100px); top: 28px; right: 28px; display: grid; place-content: center; transition-delay: 0.4s; }
  .circle-icon { width: 18px; height: 18px; color: white; }
  .parent:hover .card { transform: rotate3d(1,1,0,25deg); box-shadow: rgba(28,5,71,0.3) 30px 50px 25px -40px, rgba(28,5,71,0.3) 0px 25px 30px 0px; }
  .parent:hover .card .logo .circle2 { transform: translate3d(0,0,60px); background: rgba(255,255,255,0.3); }
  .parent:hover .card .logo .circle3 { transform: translate3d(0,0,80px); background: rgba(255,255,255,0.4); }
  .parent:hover .card .logo .circle4 { transform: translate3d(0,0,100px); background: rgba(255,255,255,0.5); }
  .parent:hover .card .logo .circle5 { transform: translate3d(0,0,120px); background: rgba(255,255,255,0.6); }
`;

const StyledStatCard = styled.div`
  .card {
    width: 100%;
    height: 190px;
    background: ${({ $gradient }) => $gradient};
    border-radius: 16px;
    color: white;
    overflow: hidden;
    position: relative;
    transform-style: preserve-3d;
    perspective: 1000px;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
    cursor: pointer;
  }
  .card-content {
    padding: 20px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: white;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
  }
  .stat-icon  { width: 2rem; height: 2rem; opacity: 0.9; margin-bottom: 6px; }
  .card-title { font-size: 2.2rem; font-weight: 800; color: white; line-height: 1; }
  .stat-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.85; }
  .card-para  { color: white; opacity: 0.65; font-size: 0.7rem; line-height: 1.4; margin-top: 2px; }
  .card:hover { transform: rotateY(10deg) rotateX(10deg) scale(1.05); box-shadow: 0 16px 32px rgba(0,0,0,0.25); }
  .card:before {
    content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(transparent, rgba(0,0,0,0.1));
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.320, 1); z-index: 1;
  }
  .card:hover:before { transform: translateX(-100%); }
  .card:after {
    content: ""; position: absolute; top: 0; right: 0; width: 100%; height: 100%;
    background: linear-gradient(transparent, rgba(0,0,0,0.1));
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.320, 1); z-index: 1;
  }
  .card:hover:after { transform: translateX(100%); }
`;
