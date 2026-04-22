import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", form);
      login(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential
      });
      login(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <main className="mx-auto mt-10 max-w-md px-4">
      <Card>
        <h1 className="mb-4 text-2xl font-semibold text-gold">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="my-4 flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google login failed")} />
        </div>

        <p className="text-sm text-gray-300">
          New user?{" "}
          <Link to="/signup" className="text-gold hover:underline">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
};

export default LoginPage;
