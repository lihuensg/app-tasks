import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find(
    {
        user: req.user.id       //solo las tareas del usuario autenticado
    }
  ).populate("user"); //populate para traer los datos del usuario
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title, description, date } = req.body;
   
  const newTask = new Task({ title, description, date, user: req.user.id});
  const savedTask = await newTask.save();
  res.json(savedTask);
};

export const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id).populate("user");
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.sendStatus(204); //devuelve 204 si se elimino correctamente
};

export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }); //new:true devuelve el documento actualizado
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};
