import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function AddTasks() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const handleAddTask = async function (data) {
    const { todo, upload } = data;
    if (!currentUser)
      return toast.error("You need to login to add a todo!", {
        duration: 3000,
      });

    try {
      setLoading(true);
      const image = upload[0];
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
          name: todo,
          date: new Date().toISOString(),
          email: currentUser.email,
        };

        const config = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        };

        const res = await fetch(
          "https://todo-server-olive.vercel.app/tasks",
          config
        );

        const data = await res.json();

        if (data.acknowledged) {
          toast.success(
            `Hey ${currentUser?.displayName}!, your todo added successfully`
          );
          reset();
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <form onSubmit={handleSubmit(handleAddTask)}>
      <div className="flex flex-wrap gap-4">
        <input
          className="w-full px-2 py-3 font-semibold transition duration-150 rounded outline-none sm:w-auto sm:flex-1 sm:py-2 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          type="text"
          placeholder="New Todo..."
          {...register("todo", { required: true })}
        />
        <div className="relative transition duration-200 transform bg-orange-400 rounded w-44 active:shadow-md active:shadow-orange-300 active:translate-y-1">
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
            <FaCloudUploadAlt className="absolute text-3xl text-white " />
          </label>

          <input
            type="file"
            name="uploadImage"
            id="uploadImage"
            placeholder="Enter Title"
            //  w-full max-w-lg
            className="invisible w-0 h-0"
            {...register("upload", { required: true })}
          />
          {errors?.upload && (
            <p className="text-red-500">Image must be provided</p>
          )}
        </div>
        <button
          disabled={loading}
          className="px-5 py-2 text-lg font-semibold text-white transition duration-200 transform bg-orange-400 rounded-md active:shadow-md active:shadow-orange-300 active:translate-y-1"
          type="submit"
        >
          Add
        </button>
      </div>
      {errors.todo && (
        <span className="inline-block mt-2 ml-2 text-red-500">
          Todo must have a name!
        </span>
      )}
    </form>
  );
}

export default AddTasks;
