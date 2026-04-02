import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { User, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import styled from "styled-components";
import NotificationBell from "../common/NotificationBell";

export default function Navbar({ sidebarExpanded, onToggleSidebar }) {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  const displayName = (user?.name || user?.email || "").split("@")[0].split(" ")[0];
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 h-16 w-full flex items-center px-6 md:px-10 gap-4
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-md
      border-b border-gray-200 dark:border-slate-800
      transition-colors duration-300">

      {/* Left: toggle + logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {isAuthenticated && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarExpanded
              ? <PanelLeftClose className="w-5 h-5" />
              : <PanelLeftOpen className="w-5 h-5" />}
          </button>
        )}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <ShineText>CareerHub</ShineText>
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 ml-auto">

        {/* Theme switcher */}
        <ThemeSwitchWrapper>
          <label className="theme-switch" aria-label="Toggle theme">
            <input
              type="checkbox"
              className="theme-switch__checkbox"
              checked={isDark}
              onChange={toggleTheme}
            />
            <div className="theme-switch__container">
              <div className="theme-switch__clouds" />
              <div className="theme-switch__stars-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor" />
                </svg>
              </div>
              <div className="theme-switch__circle-container">
                <div className="theme-switch__sun-moon-container">
                  <div className="theme-switch__moon">
                    <div className="theme-switch__spot" />
                    <div className="theme-switch__spot" />
                    <div className="theme-switch__spot" />
                  </div>
                </div>
              </div>
            </div>
          </label>
        </ThemeSwitchWrapper>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <NotificationBell />
            {/* Profile link */}
            <Link
              to="/profile"
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl
                hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700 flex-shrink-0">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-primary max-w-24 truncate">
                {displayName}
              </span>
            </Link>

            {/* Logout button */}
            <LogoutWrapper>
              <button className="Btn" onClick={logout} title="Logout">
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                  </svg>
                </div>
                <div className="text">Logout</div>
              </button>
            </LogoutWrapper>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <NavAuthWrapper $type="login">
              <Link to="/login" aria-label="Login" className="user-profile">
                <div className="user-profile-inner">
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g id="Layer_2"><path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z" /></g>
                  </svg>
                  <p>Log In</p>
                </div>
              </Link>
            </NavAuthWrapper>
            <NavAuthWrapper $type="signup">
              <Link to="/register" aria-label="Sign up" className="user-profile">
                <div className="user-profile-inner">
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm6 11h-1v-1a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2z" />
                  </svg>
                  <p>Sign Up</p>
                </div>
              </Link>
            </NavAuthWrapper>
          </div>
        )}
      </div>
    </header>
  );
}

const NavAuthWrapper = styled.div`
  .user-profile {
    width: 110px;
    height: 44px;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.3s ease;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      to bottom right,
      ${({ $type }) => $type === "login" ? "#2e8eff 0%, rgba(46,142,255,0) 30%" : "#a855f7 0%, rgba(168,85,247,0) 30%"}
    );
    background-color: ${({ $type }) => $type === "login" ? "rgba(46,142,255,0.15)" : "rgba(168,85,247,0.15)"};
  }

  .user-profile:hover {
    background-color: ${({ $type }) => $type === "login" ? "rgba(46,142,255,0.5)" : "rgba(168,85,247,0.5)"};
    box-shadow: 0 0 10px ${({ $type }) => $type === "login" ? "rgba(46,142,255,0.4)" : "rgba(168,85,247,0.4)"};
    outline: none;
  }

  /* ── Light mode inner panel ── */
  .user-profile-inner {
    width: 106px;
    height: 40px;
    border-radius: 10px;
    background-color: #ffffff;
    border: 1px solid ${({ $type }) => $type === "login" ? "rgba(46,142,255,0.25)" : "rgba(168,85,247,0.25)"};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: ${({ $type }) => $type === "login" ? "#2e8eff" : "#a855f7"};
    font-weight: 700;
    font-size: 0.82rem;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .user-profile-inner svg {
    width: 18px;
    height: 18px;
    fill: ${({ $type }) => $type === "login" ? "#2e8eff" : "#a855f7"};
    flex-shrink: 0;
    transition: fill 0.3s ease;
  }

  .user-profile:hover .user-profile-inner {
    background-color: ${({ $type }) => $type === "login" ? "rgba(46,142,255,0.08)" : "rgba(168,85,247,0.08)"};
  }

  /* ── Dark mode inner panel ── */
  .dark & .user-profile-inner {
    background-color: #1a1a1a;
    border-color: transparent;
    color: #fff;
  }

  .dark & .user-profile-inner svg { fill: #fff; }

  .dark & .user-profile:hover .user-profile-inner {
    background-color: #1a1a1a;
  }

  .user-profile-inner p { margin: 0; }
`;

const ShineText = styled.span`
  font-size: 1.25rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.3);
  background: #0060c4 -webkit-gradient(
      linear, left top, right top,
      from(#0060c4), to(#0060c4), color-stop(0.5, #fff)
    ) 0 0 no-repeat;
  background-image: -webkit-linear-gradient(
    -40deg,
    transparent 0%,
    transparent 40%,
    #fff 50%,
    transparent 60%,
    transparent 100%
  );
  -webkit-background-clip: text;
  -webkit-background-size: 50px;
  -webkit-animation: shine 5s infinite;
  @-webkit-keyframes shine {
    0%, 10% { background-position: -200px; }
    20%      { background-position: top left; }
    100%     { background-position: 200px; }
  }
`;

const ThemeSwitchWrapper = styled.div`
  /* Hide on very small screens, show from sm up */
  @media (max-width: 480px) {
    display: none;
  }

  .theme-switch {
    --toggle-size: 18px;
    --container-width: 5.625em;
    --container-height: 2.5em;
    --container-radius: 6.25em;
    --container-light-bg: #3D7EAE;
    --container-night-bg: #1D1F2C;
    --circle-container-diameter: 3.375em;
    --sun-moon-diameter: 2.125em;
    --sun-bg: #ECCA2F;
    --moon-bg: #C4C9D1;
    --spot-color: #959DB1;
    --circle-container-offset: calc((var(--circle-container-diameter) - var(--container-height)) / 2 * -1);
    --stars-color: #fff;
    --clouds-color: #F3FDFF;
    --back-clouds-color: #AACADF;
    --transition: .5s cubic-bezier(0, -0.02, 0.4, 1.25);
    --circle-transition: .3s cubic-bezier(0, -0.02, 0.35, 1.17);
  }

  .theme-switch, .theme-switch *, .theme-switch *::before, .theme-switch *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: var(--toggle-size);
  }

  .theme-switch__container {
    width: var(--container-width);
    height: var(--container-height);
    background-color: var(--container-light-bg);
    border-radius: var(--container-radius);
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0em -0.062em 0.062em rgba(0,0,0,0.25), 0em 0.062em 0.125em rgba(255,255,255,0.94);
    transition: var(--transition);
    position: relative;
  }

  .theme-switch__container::before {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    box-shadow: 0em 0.05em 0.187em rgba(0,0,0,0.25) inset, 0em 0.05em 0.187em rgba(0,0,0,0.25) inset;
    border-radius: var(--container-radius);
  }

  .theme-switch__checkbox { display: none; }

  .theme-switch__circle-container {
    width: var(--circle-container-diameter);
    height: var(--circle-container-diameter);
    background-color: rgba(255,255,255,0.1);
    position: absolute;
    left: var(--circle-container-offset);
    top: var(--circle-container-offset);
    border-radius: var(--container-radius);
    box-shadow: inset 0 0 0 3.375em rgba(255,255,255,0.1), inset 0 0 0 3.375em rgba(255,255,255,0.1), 0 0 0 0.625em rgba(255,255,255,0.1), 0 0 0 1.25em rgba(255,255,255,0.1);
    display: flex;
    transition: var(--circle-transition);
    pointer-events: none;
  }

  .theme-switch__sun-moon-container {
    pointer-events: auto;
    position: relative;
    z-index: 2;
    width: var(--sun-moon-diameter);
    height: var(--sun-moon-diameter);
    margin: auto;
    border-radius: var(--container-radius);
    background-color: var(--sun-bg);
    box-shadow: 0.062em 0.062em 0.062em 0em rgba(254,255,239,0.61) inset, 0em -0.062em 0.062em 0em #a1872a inset;
    filter: drop-shadow(0.062em 0.125em 0.125em rgba(0,0,0,0.25)) drop-shadow(0em 0.062em 0.125em rgba(0,0,0,0.25));
    overflow: hidden;
    transition: var(--transition);
  }

  .theme-switch__moon {
    transform: translateX(100%);
    width: 100%;
    height: 100%;
    background-color: var(--moon-bg);
    border-radius: inherit;
    box-shadow: 0.062em 0.062em 0.062em 0em rgba(254,255,239,0.61) inset, 0em -0.062em 0.062em 0em #969696 inset;
    transition: var(--transition);
    position: relative;
  }

  .theme-switch__spot {
    position: absolute;
    top: 0.75em;
    left: 0.312em;
    width: 0.75em;
    height: 0.75em;
    border-radius: var(--container-radius);
    background-color: var(--spot-color);
    box-shadow: 0em 0.0312em 0.062em rgba(0,0,0,0.25) inset;
  }
  .theme-switch__spot:nth-of-type(2) { width: 0.375em; height: 0.375em; top: 0.937em; left: 1.375em; }
  .theme-switch__spot:nth-last-of-type(3) { width: 0.25em; height: 0.25em; top: 0.312em; left: 0.812em; }

  .theme-switch__clouds {
    width: 1.25em;
    height: 1.25em;
    background-color: var(--clouds-color);
    border-radius: var(--container-radius);
    position: absolute;
    bottom: -0.625em;
    left: 0.312em;
    box-shadow: 0.937em 0.312em var(--clouds-color), -0.312em -0.312em var(--back-clouds-color), 1.437em 0.375em var(--clouds-color), 0.5em -0.125em var(--back-clouds-color), 2.187em 0 var(--clouds-color), 1.25em -0.062em var(--back-clouds-color), 2.937em 0.312em var(--clouds-color), 2em -0.312em var(--back-clouds-color), 3.625em -0.062em var(--clouds-color), 2.625em 0em var(--back-clouds-color), 4.5em -0.312em var(--clouds-color), 3.375em -0.437em var(--back-clouds-color), 4.625em -1.75em 0 0.437em var(--clouds-color), 4em -0.625em var(--back-clouds-color), 4.125em -2.125em 0 0.437em var(--back-clouds-color);
    transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
  }

  .theme-switch__stars-container {
    position: absolute;
    color: var(--stars-color);
    top: -100%;
    left: 0.312em;
    width: 2.75em;
    height: auto;
    transition: var(--transition);
  }

  .theme-switch__checkbox:checked + .theme-switch__container { background-color: var(--container-night-bg); }
  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__circle-container {
    left: calc(100% - var(--circle-container-offset) - var(--circle-container-diameter));
  }
  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__circle-container:hover {
    left: calc(100% - var(--circle-container-offset) - var(--circle-container-diameter) - 0.187em);
  }
  .theme-switch__circle-container:hover { left: calc(var(--circle-container-offset) + 0.187em); }
  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__moon { transform: translate(0); }
  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__clouds { bottom: -4.062em; }
  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__stars-container {
    top: 50%;
    transform: translateY(-50%);
  }
`;

const LogoutWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    overflow: hidden;
    transition-duration: .3s;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
    background-color: rgb(255, 65, 65);
    flex-shrink: 0;
    position: relative;
  }

  .sign {
    width: 100%;
    transition-duration: .3s;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sign svg { width: 15px; fill: white; }

  .text {
    position: absolute;
    right: 10px;
    width: auto;
    opacity: 0;
    color: white;
    font-size: 0.82em;
    font-weight: 600;
    transition-duration: .3s;
    white-space: nowrap;
    pointer-events: none;
  }

  /* Only expand on non-touch / hover-capable devices */
  @media (hover: hover) {
    .Btn:hover {
      width: 110px;
      border-radius: 40px;
    }
    .Btn:hover .sign {
      width: 30%;
      padding-left: 16px;
    }
    .Btn:hover .text {
      opacity: 1;
    }
  }

  .Btn:active { transform: translate(2px, 2px); }
`;
