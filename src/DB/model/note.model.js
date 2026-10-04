import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title must not exceed 100  characters'],
        required: [true, 'Title is required'],
        validate: {
            validator: (value) => value !== value.toUpperCase(),
            message: 'Title must not be entirely uppercase',
        }
    },
    content: {
        type: String,
         minlength: [3, 'content must be at least 3 characters'],
        required: [true, 'content is required'],
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, 'User ID is required'],
    }

}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    optimisticConcurrency: true,
    collection: "Notes"
},)

export const NoteModel = mongoose.models.Note || mongoose.model("Note", noteSchema)