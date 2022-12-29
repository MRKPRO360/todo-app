import { RxUpdate, RxCross1 } from "react-icons/rx";
import { AiOutlineDelete, AiOutlineCheck } from "react-icons/ai";
import { FaCloudUploadAlt } from "react-icons/fa";
import Modal from "react-modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

function Todo({ todo, refetch }) {
  const { date, img, name, _id } = todo;
  const { handleSubmit, register } = useForm();
  const { currentUser } = useAuth();

  const updateTodo = async function (task) {
    const config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    };

    const res = await fetch(
      `https://todo-server-olive.vercel.app/tasks?id=${_id}`,
      config
    );

    const data = await res.json();

    if (data.modifiedCount >= 1) {
      refetch();
      toast.success(
        `Hey ${currentUser?.displayName}!, your todo updated successfully`
      );
    }
  };

  const handleUpdate = async function (data) {
    // const {uploadNew, todoName} = data;
    const uploadNew = data.uploadNew;
    const todoName = data.todoName || name;

    try {
      const image = uploadNew[0];

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const config = {
          method: "POST",
          body: formData,
        };

        const imgBbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_imageHostKey}`,
          config
        );

        const imgBbData = await imgBbRes.json();

        if (imgBbData.success) {
          const task = {
            img: imgBbData.data.url,
            name: todoName,
          };

          await updateTodo(task);
        }
      } else {
        const task = {
          name: todoName,
          img,
        };

        await updateTodo(task);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTasks = async function (id) {
    const proceed = window.confirm("Do you want to delete this item?");
    if (proceed) {
      const res = await fetch(
        `https://todo-server-olive.vercel.app/tasks?id=${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (data.deletedCount > 0) {
        refetch();
        toast.success(
          `Hey ${currentUser?.displayName}!, your todo deleted successfully`
        );
      }
    }
  };

  const handleCompletedTask = async function (id) {
    try {
      const task = {
        complete: true,
        date: new Date().toISOString(),
        email: currentUser?.email,
        img,
      };
      const res = await fetch(
        `https://todo-server-olive.vercel.app/task-complete?id=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );

      const data = await res.json();

      if (data.acknowledged) {
        toast.success(
          `Hey ${currentUser?.displayName}!,thanks for completed the task.`
        );
        refetch();
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="p-4 space-y-5 shadow-md shadow-orange-200/60">
      <div className="flex flex-col items-center justify-between gap-4 rounded lg:flex-row lg:gap-0">
        <div>
          <img
            className="w-28 h-[168px] object-cover rounded-md"
            src={img}
            alt="todo"
          />
        </div>
        <p className="font-semibold">{name}</p>
        <div className="flex flex-col items-center gap-1 font-semibold">
          <p>Todo Added</p>
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 lg:justify-start lg:flex-nowrap">
        <div>
          <button
            onClick={openModal}
            className="flex items-center gap-1 px-3 py-2 text-center text-white transition duration-300 bg-orange-400 rounded shadow-md outline-none shadow-orange-400 hover:bg-orange-500 active:translate-y-1"
          >
            <RxUpdate />
            <span>Update</span>
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
              onSubmit={handleSubmit(handleUpdate)}
              className="w-full mt-6 space-y-8"
            >
              <input
                className="w-full p-2 font-semibold transition duration-150 border-b-2 outline-none border-b-orange-400"
                type="text"
                placeholder="Todo text"
                {...register("todoName")}
              />

              <div className="relative w-full p-2 transition duration-200 transform bg-orange-400 rounded active:shadow-md active:shadow-orange-300 active:translate-y-1">
                <label
                  className="flex h-full font-semibold text-white cursor-pointer itmes-center"
                  htmlFor="uploadImage"
                >
                  <span className="flex items-center pl-3 text-base font-semibold ">
                    Upload Image
                  </span>
                </label>

                <label
                  htmlFor="uploadImage"
                  className="absolute cursor-pointer right-12 top-2"
                >
                  <FaCloudUploadAlt className="absolute text-2xl text-white " />
                </label>

                <input
                  type="file"
                  name="uploadImage"
                  id="uploadImage"
                  placeholder="Enter Title"
                  //  w-full max-w-lg
                  className="absolute invisible w-0 h-0"
                  {...register("uploadNew")}
                />
              </div>

              <button
                onClick={() => {
                  setTimeout(() => closeModal(), 800);
                }}
                type="submit"
                className="w-full py-[7px] transition duration-200 transform border-2 rounded outline-none cursor-pointer active:shadow-md font-semibold active:shadow-orange-300 active:translate-y-1 hover:bg-orange-400 hover:text-white active:border-transparent hover:border-transparent"
              >
                Update
              </button>
            </form>
          </Modal>
        </div>
        <button
          className="flex items-center gap-1 px-4 py-2 text-center text-white transition duration-300 bg-green-500 rounded shadow-md shadow-green-500 hover:bg-green-600 active:translate-y-1"
          onClick={() => handleCompletedTask(_id)}
        >
          <AiOutlineCheck />
          Complete
        </button>

        <button
          className="flex items-center gap-1 px-4 py-2 text-center text-white transition duration-300 bg-red-400 rounded shadow-md shadow-red-400 hover:bg-red-500 active:translate-y-1"
          onClick={() => handleDeleteTasks(_id)}
        >
          <AiOutlineDelete />
          Delete
        </button>
      </div>
    </div>
  );
}

export default Todo;
