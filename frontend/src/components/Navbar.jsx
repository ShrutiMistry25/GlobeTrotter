import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/trips', label: 'My Trips', icon: 'luggage' },
  { to: '/explore/cities', label: 'Explore', icon: 'explore' },
  { to: '/profile', label: 'Profile', icon: 'person' }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-outline/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl text-primary">public</span>
          <span className="text-xl font-extrabold tracking-tight text-ink">GlobeTrotter</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.slice(0, 3).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-primary-container text-primary-dark' : 'text-muted hover:bg-surface-container hover:text-ink'
                }`
              }
            >
              <span className="material-symbols-outlined text-lg">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/explore/activities"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive ? 'bg-primary-container text-primary-dark' : 'text-muted hover:bg-surface-container hover:text-ink'
              }`
            }
          >
            Activities
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/trips/new"
            className="hidden items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lift transition hover:bg-primary-dark sm:flex"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Plan New Trip
          </Link>
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                className="ml-1 flex items-center"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="h-10 w-10 rounded-full border border-outline object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </button>
              <div
                className={`absolute right-0 top-full mt-2 w-52 rounded-2xl bg-surface p-2 shadow-ambient transition-all duration-150 ${
                  menuOpen
                    ? 'visible translate-y-0 opacity-100'
                    : 'invisible -translate-y-1 opacity-0'
                }`}
              >
                <p className="truncate px-3 py-2 text-xs font-semibold text-muted">{user.email}</p>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-lg">settings</span> Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-error hover:bg-error/10"
                >
                  <span className="material-symbols-outlined text-lg">logout</span> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
