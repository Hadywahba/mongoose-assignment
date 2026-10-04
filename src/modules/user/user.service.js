import {
    ConflictException,
    NotFoundException,
} from '../../common/exceptions/index.js';
import { UserModel } from '../../DB/model/user.model.js';


// update user
export const updateUser = async ({ id }, inputs) => {
    const { password, email } = inputs;

    delete inputs.password;

    if (email) {
        const existingUser = await UserModel.findOne({
            email,
            _id: { $ne: id },
        });

        if (existingUser) {
             ConflictException({
                message: 'Email already exists',
            });
        }
    }

    const user = await UserModel.findByIdAndUpdate(
        id,
        {
            $set: inputs,
        },
        {
            returnDocument: 'after',
            runValidators: true,
        }
    );

    if (!user) {
        throw NotFoundException({
            message: 'User not found',
        });
    }

    return user;
};

// delete user
export const deleteUser = async ({ id }) => {
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
         NotFoundException({
            message: 'User not found',
        });
    }

    return user;
};

// get user
export const getUser = async ({ id }) => {
    const user = await UserModel.findById(id);

    if (!user) {
         NotFoundException({
            message: 'User not found',
        });
    }

    return user;
};