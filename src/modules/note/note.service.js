import { BadRequestException, NotFoundException, UnauthorizedException } from "../../common/exceptions/error.exception.js";
import { NoteModel, UserModel } from "../../DB/model/index.js"
import { ConvertToObjectId } from "../../common/utils/objectid.js";




// post note
export const addNote = async ({ userId }, inputs) => {
    const errors = [];
    const { title, content } = inputs;
    // Required fields
    if (!title || !content) {
        errors.push("All fields are required");
    }

    // Title validation
    if (title && title.length < 3) {
        errors.push('Title must be at least 3 characters');
    }

    if (title && title.length > 100) {
        errors.push('Title must not exceed 100 characters');
    }

    // Content validation
    if (content && content.length < 3) {
        errors.push('Content must be at least 3 characters');
    }

    if (!userId) {
        NotFoundException({
            message: 'User ID is required',
        });
    }

    if (errors.length) {
        BadRequestException({
            message: 'Validation Error',
            options: { cause: { status: 400, errors } }
        });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
        throw NotFoundException({
            message: 'User not found',
        });
    }


    const note = await NoteModel.create({ userId, title, content })
    return note;
}

// update note
export const updateNote = async ({ noteId }, { userId }, { title, content }) => {
    const errors = [];


    // Title validation
    if (title && title.length < 3) {
        errors.push('Title must be at least 3 characters');
    }

    if (title && title.length > 100) {
        errors.push('Title must not exceed 100 characters');
    }

    if (errors.length) {
        BadRequestException({
            message: 'Validation Error',
            options: { cause: { status: 400, errors } }
        });
    }

    const note = await NoteModel.findById(noteId);

    if (!note) {
        NotFoundException({
            message: 'Note not found',
        });
    }

    if (note.userId.toString() !== userId.toString()) {
        UnauthorizedException({
            message: 'You are not the owner',
        });
    }

    const updatedNote = await NoteModel.findByIdAndUpdate(noteId,
        { title, content },
        { new: true, runValidators: true });


    return updatedNote;
}


// update all
export const updateAllNotes = async ({ userId }, inputs) => {
    const errors = [];
    const { title } = inputs;


    // Title validation
    if (title && title.length < 3) {
        errors.push('Title must be at least 3 characters');
    }

    if (title && title.length > 100) {
        errors.push('Title must not exceed 100 characters');
    }

    if (errors.length) {
        BadRequestException({
            message: 'Validation Error',
            options: { cause: { status: 400, errors } }
        });
    }

    const notes = await NoteModel.find({ userId: ConvertToObjectId(userId) });

    if (!notes.length) {
        UnauthorizedException({
            message: 'You are not the owner',
        });
    }

    const result = await NoteModel.updateMany(
        { userId: ConvertToObjectId(userId) },
        { $set: { title } }
    );

    return result;

}

// Delete note
export const deleteNote = async ({ noteId }, { userId }) => {
    const note = await NoteModel.findByIdAndDelete(noteId);
    if (!note) {
        NotFoundException({
            message: 'Note not found',
        });
    }

    if (note.userId.toString() !== userId.toString()) {
        UnauthorizedException({
            message: 'You are not the owner',
        });
    }

    return note;
}

// GetAllNotes
export const getAll = async ({ userId, page = 1, limit = 3 }) => {
    page = Math.floor(page < 1 ? 1 : page)
    limit = Math.floor(limit < 1 ? 1 : limit)
    const skip = (page - 1) * limit;

    const total = await NoteModel.countDocuments({ userId })
    const noteList = await NoteModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    if (!noteList) {
        NotFoundException({
            message: 'Account not found',
        });
    }
    return { metaData: { total, page, limit, pages: Math.ceil(total / limit) }, noteList }

}

// GetNote By Id
export const getNote = async ({ noteId }, { userId }) => {

    const note = await NoteModel.findById(noteId)


    if (!note) {
        NotFoundException({
            message: 'Note not found',
        });
    }

    if (note.userId.toString() !== userId.toString()) {
        UnauthorizedException({
            message: 'You are not the owner',
        });
    }
    return note

}

// GetNote By Id
export const getNoteContent = async ({ content, userId }) => {
    // Find note by content
    const note = await NoteModel.findOne({
        content,
        userId,
    });

    if (!note) {
        NotFoundException({
            message: 'Note not found',
        });
    }

    return note;
};

// GetAllNotes
export const retrievesAllNotes = async ({ userId }) => {
    const noteList = await NoteModel.find({ userId: ConvertToObjectId(userId) })
        .select('title userId createdAt')
        .populate({
            path: 'userId',
            select: 'email ',
        });

    return noteList;
};

// GetAllNotes
export const aggregationAllNotes = async ({ userId, title }) => {
    const noteList = await NoteModel.aggregate([
        {
            $match: {
                userId: ConvertToObjectId(userId),
                ...(title && {
                    title: {
                        $regex: title,
                        $options: 'i',
                    },
                }),
            },
        },
        {
            $lookup: {
                from: 'Users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: '$user',
        },
        {
            $project: {
                title: 1,
                createdAt: 1,
                user: {
                    name: 1,
                    email: 1,
                },
            },
        },
    ]);

    return noteList;
};

// Delete All Notes
export const deleteAllNotes = async ({ userId }) => {
  const result = await NoteModel.deleteMany({
    userId: ConvertToObjectId(userId),
  });

  if (result.deletedCount === 0) {
    throw NotFoundException({
      message: 'Notes not found',
    });
  }

  return result;
};