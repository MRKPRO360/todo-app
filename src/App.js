import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddTasks from "./components/AddTasks";
import CompletedTasks from "./components/CompletedTasks";
import Login from "./components/Login";
import MyTasks from "./components/MyTasks";
import Signup from "./components/Signup";
import Main from "./layout/Main";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <AddTasks />,
      },
      {
        path: "/myTasks",
        element: (
          <PrivateRoute>
            <MyTasks />
          </PrivateRoute>
        ),
      },
      {
        path: "/completedTasks",
        element: (
          <PrivateRoute>
            <CompletedTasks />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
