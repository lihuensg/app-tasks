import User from "../models/user.model.js";
import bcript from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const passwordHash = await bcript.hash(password, 10); //encripta la contraseña

    const newUser = new User({
      //crea un nuevo usuario
      username,
      email,
      password: passwordHash,
    });
    const userSaved = await newUser.save(); //guarda el usuario en la base de datos
    const token = await createAccessToken({ id: userSaved._id }); //crea el token de acceso
    res.cookie("token", token); //guarda el token en una cookie
    res.json(
      //devuelve el usuario guardado
      {
        id: userSaved._id,
        username: userSaved.username,
        email: userSaved.email,
        createdAt: userSaved.createdAt,
        updatedAt: userSaved.updatedAt,
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message }); //si hay un error devuelve un mensaje de error
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email: email }); //busca el usuario por el correo
    if (!userFound) return res.status(400).json({ message: "User not found" }); //si no encuentra el usuario devuelve un mensaje de error

    const isMatch = await bcript.compare(password, userFound.password); //compara la contraseña encriptada
    if (!isMatch) return res.status(400).json({ message: "Invalid password" }); //si la contraseña no coincide devuelve un mensaje de error

    const token = await createAccessToken({ id: userFound._id }); //crea el token de acceso
    res.cookie("token", token); //guarda el token en una cookie
    res.json(
      //devuelve el usuario encontrado
      {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message }); //si hay un error devuelve un mensaje de error
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "User not found" });
  res.json(
    //devuelve el usuario encontrado
    {
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    }
  );
};
