import { useAuth } from "../context/AuthContext";
import { FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Login() {
  const { googleLogin, login } = useAuth();
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async function (data) {
    try {
      const { email, password } = data;

      const result = await login(email, password);
      const user = result.user;

      if (user?.uid) {
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 250);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = async function () {
    try {
      const result = await googleLogin();
      const user = result.user;

      if (user?.uid) {
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 250);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="mx-auto max-w-[375px]">
      <h1 className="text-3xl font-semibold text-center">Login</h1>
      <form
        className="p-5 mt-8 space-y-5 rounded shadow-lg shadow-orange-300/30"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div>
          <span className="block mb-1">Email</span>
          <input
            className="block w-full p-2 bg-transparent border-b-2 border-orange-400 rounded-t outline-none "
            type="email"
            placeholder="your email"
            {...register("email", { required: true })}
          />
          {errors?.email && (
            <span className="text-red-500">Provide your email</span>
          )}
        </div>
        <div>
          <span className="block mb-1">Password</span>
          <input
            className="block w-full p-2 bg-transparent border-b-2 border-orange-400 rounded-t outline-none "
            type="password"
            placeholder="your password"
            {...register("password", { required: true })}
          />
          {errors?.password && (
            <span className="text-red-500">Provide your password</span>
          )}
        </div>
        <div className="text-center ">
          <button
            type="submit"
            className="w-full p-2 mt-4 font-semibold text-white transition duration-200 transform bg-orange-400 rounded outline-none active:shadow-md active:shadow-orange-300 active:translate-y-1"
          >
            Login
          </button>

          <span className="block mt-1 font-semibold">
            Doesn't have an account?{" "}
            <Link
              className="text-orange-500 underline decoration-orange-400 decoration-2"
              to="/signup"
            >
              Signup
            </Link>{" "}
            Now
          </span>
        </div>

        <div className="flex my-2 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-400">Or</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <div
          className="flex items-center justify-center gap-2 py-2 transition duration-200 transform border-2 rounded outline-none cursor-pointer active:shadow-md active:shadow-orange-300 active:translate-y-1 hover:bg-orange-400 hover:text-white active:border-transparent hover:border-transparent"
          onClick={handleGoogleLogin}
        >
          <FaGoogle className="text-2xl" />
          <span>Continue With Google</span>
        </div>
      </form>
    </div>
  );
}

export default Login;
