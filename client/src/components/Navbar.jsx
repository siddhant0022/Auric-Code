import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-black-900/65 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold tracking-wide text-gold-gradient-text">
          AuricCode
        </Link>
        <div className="flex items-center gap-4 text-sm text-zinc-300">
          <Link to="/" className="transition hover:text-gold">
            Platform
          </Link>
          <Link to="/questions" className="transition hover:text-gold">
            Questions
          </Link>
          {user && (
            <Link to="/dashboard" className="transition hover:text-gold">
              Dashboard
            </Link>
          )}
          {user ? (
            <Button onClick={handleLogout} variant="secondary" className="px-3 py-1.5 text-sm">
              Logout
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-full border border-gold/35 px-3 py-1.5 transition hover:border-gold hover:bg-gold/10 hover:text-gold">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-gradient-to-r from-[#d4af37] to-[#ffd700] px-3 py-1.5 font-medium text-black shadow-[0_0_18px_rgba(212,175,55,0.33)] transition hover:shadow-[0_0_26px_rgba(255,215,0,0.42)]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
