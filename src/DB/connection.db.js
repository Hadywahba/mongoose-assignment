import mongoose from "mongoose";
import { DB_URI } from "../config.js";
import { UserModel } from "./model/user.model.js";
import { NoteModel } from "./model/note.model.js";



// DB Connection
export const bootstrapDB = async (app , port) => {
    try {
        await mongoose.connect(DB_URI);
        console.log("DB Connected Successfully");
        await UserModel.syncIndexes();
        await NoteModel.syncIndexes();
        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    } catch (error) {
        console.log(error)
        console.log("Fail to connect on DB")
    }
}