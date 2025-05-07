"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { MoreVertical, Trash2, Edit2 } from "lucide-react";

interface Task {
  _id: string;
  taskName: string;
  description: string;
  dueDate: string;
}

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const api = axios.create({
  baseURL: "https://backend-2-cidd.onrender.com/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [form, setForm] = useState({
    taskName: "",
    description: "",
    dueDate: "",
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.data); // 'data' instead of 'tasks'
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && selectedTaskId) {
        const res = await api.put(`/tasks/${selectedTaskId}`, form);
        setTasks((prev) =>
          prev.map((t) => (t._id === selectedTaskId ? res.data.data : t))
        );
      } else {
        const res = await api.post("/tasks/createTask", form);
        setTasks([...tasks, res.data.data]);
      }
      closeModal();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const openEditModal = (task: Task) => {
    setEditMode(true);
    setSelectedTaskId(task._id);
    setForm({
      taskName: task.taskName,
      description: task.description,
      dueDate: task.dueDate.slice(0, 16), // Adjust to fit input type="datetime-local"
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ taskName: "", description: "", dueDate: "" });
    setEditMode(false);
    setSelectedTaskId(null);
  };

  return (
    <div className="p-8 bg-white ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-700">Tasks Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-full flex items-center gap-2"
        >
          <span>＋</span> Add Task
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">No</th>
              <th className="px-6 py-3">Date & Time</th>
              <th className="px-6 py-3">Task</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task, index) => (
              <tr key={task._id} className="border-b hover:bg-gray-50 text-black">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  {new Date(task.dueDate).toLocaleString()}
                </td>
                <td className="px-6 py-4">{task.taskName}</td>
                <td className="px-6 py-4">{task.description}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2 text-black">
                  <button onClick={() => openEditModal(task)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(task._id)} title="Delete">
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-8 relative shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center text-black">
              {editMode ? "Edit Task" : "Add Task"}
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="taskName"
                value={form.taskName}
                onChange={handleChange}
                placeholder="Enter Task Name"
                className="px-4 py-2 border rounded bg-gray-100 focus:outline-none text-black"
                required
              />
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="px-4 py-2 border rounded bg-gray-100 focus:outline-none text-black"
                required
              />
              <input
                type="datetime-local"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="px-4 py-2 border rounded bg-gray-100 focus:outline-none text-black"
                required
              />
              <button
                type="submit"
                className="mt-4 w-full bg-blue-700 text-white py-2 rounded-full font-medium hover:bg-blue-800"
              >
                {editMode ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="text-center mt-2 text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
