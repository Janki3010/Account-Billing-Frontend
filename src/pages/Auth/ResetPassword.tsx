import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../api/auth";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!token) return setError("Invalid reset token");
  if (password !== confirmPassword) {
    return setError("Passwords do not match");
  }
  try {
    await resetPassword(token, password, confirmPassword);  // <-- pass both
    setMessage("Password reset successfully!");
    setError("");
    setTimeout(() => navigate("/login"), 2000);
  } catch (err: any) {
    setError(err.detail || "Failed to reset password");
    setMessage("");
  }
};


  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        {message && <p className="text-green-500 mb-2">{message}</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
            <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
          >
            Reset Password
          </button>
        </form>
         <div className="flex flex-col items-center mt-4 space-y-2 text-sm">
        <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
        </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
