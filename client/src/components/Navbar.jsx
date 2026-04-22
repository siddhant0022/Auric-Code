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
    <header className="border-b border-black-700 bg-black-800">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold text-gold">
          CodeForge
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-gold">
            Problems
          </Link>
          {user && (
            <Link to="/dashboard" className="hover:text-gold">
              Dashboard
            </Link>
          )}
          {user ? (
            <Button onClick={handleLogout} className="px-3 py-1.5 text-sm">
              Logout
            </Button>
          ) : (
            <Link to="/login" className="hover:text-gold">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
