import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useFavorisCount } from "../context/FavorisCountContext";

const IconUser = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

function displayNameFromUser(user) {
  if (user?.displayName?.trim()) return user.displayName.trim();
  const email = user?.email || "";
  const local = email.split("@")[0];
  return local || "Compte";
}

export default function UserMenu({ user, onLogout, onNavigate }) {
  const { count: favorisCount } = useFavorisCount();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const close = () => setOpen(false);
  const displayName = displayNameFromUser(user);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        close();
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleNav = () => {
    close();
    onNavigate?.();
  };

  const handleLogout = async () => {
    close();
    onNavigate?.();
    await onLogout?.();
  };

  return (
    <div className={`nav-user-menu${open ? " is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="nav-user-trigger"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-user-trigger__icon">
          <IconUser />
        </span>
        <span className="nav-user-trigger__name">{displayName}</span>
        <span className="nav-user-trigger__caret" aria-hidden="true">
          ▾
        </span>
      </button>

      <div className="nav-user-dropdown" role="menu">
        <Link to="/compte/favoris/" className="nav-user-dropdown__item" role="menuitem" onClick={handleNav}>
          Favoris
          {favorisCount > 0 && (
            <span className="nav-user-dropdown__badge" aria-label={`${favorisCount} favoris`}>
              {favorisCount}
            </span>
          )}
        </Link>
        <Link to="/compte/messages/" className="nav-user-dropdown__item" role="menuitem" onClick={handleNav}>
          Messages
        </Link>
        <Link to="/compte/reservations/" className="nav-user-dropdown__item" role="menuitem" onClick={handleNav}>
          Réservations
        </Link>
        <Link to="/compte/reglages/" className="nav-user-dropdown__item" role="menuitem" onClick={handleNav}>
          Réglages
        </Link>
        <button type="button" className="nav-user-dropdown__item" role="menuitem" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
