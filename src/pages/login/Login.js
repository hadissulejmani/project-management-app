import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

// styles
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isPending } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="my-10">
      <div className="flex flex-col space-y-5">
        <label for="email">
          <p class="font-medium text-slate-700 pb-2">Email address</p>
          <input
            required
            id="email"
            name="email"
            type="email"
            className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
            placeholder="Enter email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label for="password">
          <p className="font-medium text-slate-700 pb-2">Password</p>
          <input
            required
            id="password"
            name="password"
            type="password"
            className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <div class="flex flex-row justify-between">
          <div>
            <label for="remember" class="">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 border-slate-200 focus:bg-indigo-600"
              />
              Remember me
            </label>
          </div>
          <div>
            <Link to={"/signup"} className="font-medium text-indigo-600">
              Forgot Password?
            </Link>
          </div>
        </div>
        {!isPending && (
          <button className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span>Login</span>
          </button>
        )}
        {isPending && (
          <button className="btn" disabled>
            loading
          </button>
        )}
        {error && <div className="error">{error}</div>}
        <p class="text-center">
          Not registered yet?{" "}
          <Link
            to={"/signup"}
            className="text-indigo-600 font-medium inline-flex space-x-1 items-center"
          >
            <span>Register now </span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </span>
          </Link>
        </p>
      </div>
    </form>
  );
}
