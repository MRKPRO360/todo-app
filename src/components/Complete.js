import { RxCross1 } from "react-icons/rx";
import {
  AiOutlineDelete,
  AiOutlineRollback,
  AiOutlineCheck,
} from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

import Modal from "react-modal";
import { useState } from "react";
import { useForm } from "react-hook-form";

const customStyles = {
  content: {
    width: "375px",
    height: "75%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function Complete({ task, refetch }) {
  const { img, date, _id } = task;

  const { currentUser } = useAuth();
  const { handleSubmit, register } = useForm();

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleDeleteTaskComplete = async function (id) {
    const proceed = window.confirm(
      "Do you want you delete this completed item?"
    );

    if (proceed) {
      const res = await fetch(
        `https://todo-server-olive.vercel.app/task-complete?id=${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (data.deletedCount > 0) {
        refetch();
        toast.success(
          `Hey ${currentUser?.displayName}!, your completed todo deleted successfully`
        );
      }
    }
  };

  const handleComment = async function (data) {
    try {
      const { text } = data;
      if (text.length <= 0) return;

      const res = await fetch(
        `https://todo-server-olive.vercel.app/task-complete?id=${_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: text }),
        }
      );
      const promiseData = await res.json();

      if (promiseData.modifiedCount >= 1) {
        refetch();
        toast.success(
          `Hey ${currentUser?.displayName}!, your comment added successfully`
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-8 sm:items-end mb-14 shadow-md shadow-orange-200/60 pb-4">
      <img className="w-48 rounded" src={img} alt="completed todo" />
      <div>
        {task?.comment && (
          <div>
            <span className="font-semibold mb-2 inline-block">
              Comment: &nbsp;
            </span>
            <span>{task.comment}</span>
          </div>
        )}
        <div className="flex items-center">
          <span>
            <AiOutlineCheck className="text-green-600 font-semibold text-xl" />
          </span>{" "}
          Completed on {new Date(date).toLocaleDateString()}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            className="flex items-center gap-1 px-4 py-2 text-center text-white transition duration-300 bg-red-400 rounded shadow-md shadow-red-400 hover:bg-red-500 active:translate-y-1"
            onClick={() => handleDeleteTaskComplete(_id)}
          >
            <AiOutlineDelete />
            Delete
          </button>
          <button
            className="flex items-center gap-1 px-4 py-2 text-center text-white transition duration-300 bg-green-500 rounded shadow-md shadow-green-500 hover:bg-green-600 active:translate-y-1"
            onClick={openModal}
          >
            <BsPencil />
            Comment
          </button>
          <Modal
            ariaHideApp={false}
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <button onClick={closeModal}>
              <RxCross1 className="absolute text-2xl text-orange-400 outline-none right-4 top-3 " />
            </button>
            <form
              onSubmit={handleSubmit(handleComment)}
              className="w-full mt-6"
            >
              <div>
                <p className="font-semibold">Add comment</p>
                <textarea
                  className="w-full outline-orange-500 rounded p-1 my-3"
                  rows="4"
                  placeholder="Your comment goes here..."
                  {...register("text")}
                />
              </div>
              <button
                onClick={() => {
                  setTimeout(() => closeModal(), 800);
                }}
                type="submit"
                className="w-full py-[7px] transition duration-200 transform border-2 rounded outline-none cursor-pointer active:shadow-md font-semibold active:shadow-orange-300 active:translate-y-1 hover:bg-orange-400 hover:text-white active:border-transparent hover:border-transparent"
              >
                Submit
              </button>
            </form>
          </Modal>

          <Link
            to="/myTasks"
            className="flex items-center gap-1 px-4 py-2 text-center text-white transition duration-300 bg-orange-400 rounded shadow-md shadow-orange-400 hover:bg-orange-500 active:translate-y-1"
          >
            <AiOutlineRollback />
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Complete;
