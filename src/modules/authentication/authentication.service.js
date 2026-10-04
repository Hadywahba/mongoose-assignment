import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../common/exceptions/index.js";
import { UserModel } from "../../DB/model/user.model.js";


export const signUp = async (inputs) => {
    const errors = [];
    const { name, email, password, phone, age } = inputs;

    // Required fields
    if (!name || !password || !phone || !age || !email) {
        errors.push("All fields are required");
    }

    // Name validation
    if (name && (name.length < 2 || name.length > 20)) {
        errors.push('Name must be between 2 and 20 characters');
    }

    // Email validation
    if (email && !email.includes('@')) {
        errors.push('Invalid email');
    }

    // Password validation
    if (password && password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    // Phone validation
    if (phone && typeof phone !== 'string') {
        errors.push('Phone must be a string');
    }

    // Age validation
    if (age !== undefined && (age < 18 || age > 60)) {
        errors.push('Age must be between 18 and 60');
    }

    // Return validation errors
    if (errors.length) {
        throw BadRequestException({
            message: 'Validation Error',
            options: { cause: { status: 400, errors } }
        });
    }
    const duplicatedAccount = await UserModel.findOne({ email })
    if (duplicatedAccount) {
        ConflictException({
            message: 'Email already exists',
        });
    }

    const user = await UserModel.create([{name, email, password, phone, age}])
     return user;
}

export const login = async (inputs) => {
    const { email, password } = inputs;

    const existAccount = await UserModel.findOne({ email });
    if (!existAccount) {
    NotFoundException({
      message: 'Account not found',
    });
  }

  if (existAccount.password !== password) {
    UnauthorizedException({
      message: 'Invalid password',
    });
  }
  const user=await UserModel.findOne({ email }).select("-password");

    return user;
}