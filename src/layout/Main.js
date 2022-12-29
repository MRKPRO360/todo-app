import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function Main() {
  return (
    <div className="px-3 md:px-0 max-w-[768px] mx-auto">
      <div className="mb-20">
        <Header />
      </div>
      <Outlet />
    </div>
  );
}

export default Main;
