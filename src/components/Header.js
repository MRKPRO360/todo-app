import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    path: "/",
    text: "Add Tasks",
  },
  {
    path: "/myTasks",
    text: "My Tasks",
  },
  {
    path: "/completedTasks",
    text: "Completed Tasks",
  },
];
function Header() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async function () {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-between gap-4 mt-5 sm:gap-0 sm:flex-row">
      <Link to="/">
        <h1 className="text-2xl font-semibold md:text-3xl">Todo</h1>
      </Link>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {navItems.map((el, i) => (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-white bg-orange-400  px-3 py-2 transition duration-300 rounded font-semibold shadow-md shadow-orange-300 text-center"
                : "text-black px-3 py-2 transition duration-300 rounded font-semibold text-center"
            }
            to={el.path}
            key={i}
          >
            {el.text}
          </NavLink>
        ))}

        {!currentUser?.uid ? (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-white bg-orange-400 px-3 py-2 transition duration-300 rounded font-semibold shadow-md shadow-orange-300 text-center"
                : "text-black px-3 py-2 transition duration-300 rounded font-semibold text-center"
            }
            to="/login"
          >
            Login
          </NavLink>
        ) : (
          <Link
            className="px-3 py-2 font-semibold text-center text-black transition duration-300 rounded"
            to="/"
            onClick={handleLogout}
          >
            Logout
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
