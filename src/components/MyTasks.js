import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Todo from "./Todo";

function MyTasks() {
  const { currentUser } = useAuth();

  const { data: todos = [], refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch(
        `https://todo-server-olive.vercel.app/tasks?email=${currentUser?.email}`
      );

      const data = await res.json();
      return data;
    },
  });

  return (
    <div>
      {todos.length < 1 && (
        <p className="text-xl font-semibold">
          You don't have any task buddy :) Please{" "}
          <Link
            className="text-orange-500 underline decoration-orange-400 decoration-2"
            to="/myTasks"
          >
            add task
          </Link>{" "}
          to see
        </p>
      )}
      {todos?.map((el) => (
        <Todo key={el._id} todo={el} refetch={refetch} />
      ))}
    </div>
  );
}

export default MyTasks;
