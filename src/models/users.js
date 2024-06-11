import mongoose, {isValidObjectId} from "mongoose";
import {EmailModel} from "./emails.js";

/**
 * Mongoose schema for the User model.
 *
 * @type {mongoose.Schema<User>}
 */
const UserSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        authentication: {
            password: {
                type: String,
                required: true
            },
            session: {
                token: {
                    type: String,
                },
                expires: {
                    type: Date
                }
            },
            otp: {
                code: {
                    type: Number,
                },
                expires: {
                    type: Date,
                }
            }
        },
    },
    {
        timestamps: true
    }
);


/**
 * Mongoose model for the User schema.
 *
 * @type {mongoose.Model<User>}
 */
const UserModel = mongoose.model('User', UserSchema);

/**
 * Gets all the users
 * @returns {QueryWithHelpers<Array<HydratedDocument<User, {}, {}>>, HydratedDocument<User, {}, {}>, {}, User, "find">}
 */
const getUsers = () => UserModel.find();


/**
 * Gets a user by their email
 * @param email user email
 * @returns {QueryWithHelpers<Array<HydratedDocument<User, {}, {}>>, HydratedDocument<User, {}, {}>, {}, User, "find">}
 */
const getUserByEmail = (email) => UserModel.findOne({email: email});

/**
 * Gets count of all the users
 * @returns {QueryWithHelpers<number, HydratedDocument<User, {}, {}>, {}, User, "countDocuments">}
 */
const getUsersCount = () => UserModel.countDocuments();

/**
 * Gets user by their session token
 * @param sessionToken session token of user
 * @returns {QueryWithHelpers<Array<HydratedDocument<User, {}, {}>>, HydratedDocument<User, {}, {}>, {}, User, "find">}
 */
const getUserBySessionToken = (sessionToken) => UserModel.findOne({'authentication.session.token': sessionToken});


/**
 * Gets user by their ID
 * @param id id of user
 * @returns {QueryWithHelpers<HydratedDocument<User, {}, {}> | null, HydratedDocument<User, {}, {}>, {}, User, "findOne">}
 */
const getUserById = (id) => {
    if (isValidObjectId(id)) return UserModel.findById(id);
}


/**
 * Create a new user
 * @param values user data to be used to create the user
 * @returns {Promise<User>}
 */
const createUser = (values) => new UserModel(values).save().then((user) => user);


/**
 * Deletes user with the user's ID
 * @param id ID of the user
 * @returns {QueryWithHelpers<ModifyResult<HydratedDocument<User, {}, {}>>, HydratedDocument<User, {}, {}>, {}, User, "findOneAndDelete">}
 */
const deleteUserById = (id) => {
    if (isValidObjectId(id)) return UserModel.findByIdAndDelete(id);
}

/**
 * Updates the user with the ID of the user
 * @param id ID of the User
 * @param values User data to be used for the update
 * @returns {QueryWithHelpers<HydratedDocument<User, {}, {}> | null, HydratedDocument<User, {}, {}>, {}, User, "findOneAndUpdate">}
 */
const updateUserById = (id, values) => {
    if (isValidObjectId(id)) return UserModel.findByIdAndUpdate(id, values);
}


export {
    getUsers,
    getUserByEmail,
    getUserBySessionToken,
    getUserById,
    createUser,
    deleteUserById,
    updateUserById,
    getUsersCount,
    UserModel
};
