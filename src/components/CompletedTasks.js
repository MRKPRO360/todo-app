import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Complete from "./Complete";

function CompletedTasks() {
  const { currentUser } = useAuth();

  const { data: completedTask = [], refetch } = useQuery({
    queryKey: ["completedTask"],
    queryFn: async () => {
      const res = await fetch(
        `https://todo-server-olive.vercel.app/task-complete?email=${currentUser?.email}`
      );

      const data = await res.json();
      return data;
    },
  });

  return (
    <div>
      {completedTask.length < 1 && (
        <p className="text-xl font-semibold">
          You don't have any completed task buddy :) Please{" "}
          <Link
            className="text-orange-500 underline decoration-orange-400 decoration-2"
            to="/completedTasks"
          >
            complete task
          </Link>{" "}
          to see
        </p>
      )}
      {completedTask?.map((el) => (
        <Complete key={el._id} task={el} refetch={refetch} />
      ))}
    </div>
  );
}

export default CompletedTasks;
