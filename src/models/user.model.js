import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema({        //creamos el esquema de la base de datos
    username: {
        type: String,
        required: true,
        trim: true  //sirve para que no haya espacios en blancos al principio y al final
    },
    email: {
        type: String,
        required: true,
        trim: true, 
        unique: true //para que no se repita el correo
    },
    password: {
        type: String,
        required: true,
    }       
}, {
    timestamps: true //para que se cree la fecha de creacion y de modificacion
})

export default mongoose.model('User', userSchema); //exportamos el modelo, sirve para interactuar con la base de datos