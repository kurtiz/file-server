import mongoose, {isValidObjectId} from "mongoose";

/**
 * Mongoose schema for the Admin model.
 *
 * @type {mongoose.Schema<Admin>}
 */
const AdminSchema = new mongoose.Schema(
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
 * Mongoose model for the Admin schema.
 *
 * @type {mongoose.Model<Admin>}
 */
const AdminModel = mongoose.model('Admin', AdminSchema);

/**
 * Gets all the admins
 * @returns {QueryWithHelpers<Array<HydratedDocument<Admin, {}, {}>>, HydratedDocument<Admin, {}, {}>, {}, Admin, "find">}
 */
const getAdmins = () => AdminModel.find();


/**
 * Gets a admin by their email
 * @param email admin email
 * @returns {QueryWithHelpers<Array<HydratedDocument<Admin, {}, {}>>, HydratedDocument<Admin, {}, {}>, {}, Admin, "find">}
 */
const getAdminByEmail = (email) => {
    if (isValidObjectId(email)) return AdminModel.findOne({email: email});
}


/**
 * Gets admin by their session token
 * @param sessionToken session token of admin
 * @returns {QueryWithHelpers<Array<HydratedDocument<Admin, {}, {}>>, HydratedDocument<Admin, {}, {}>, {}, Admin, "find">}
 */
const getAdminBySessionToken = (sessionToken) => {
    if (isValidObjectId(sessionToken)) return AdminModel.findOne({'authentication.session.token': sessionToken});
}


/**
 * Gets admin by their ID
 * @param id id of admin
 * @returns {QueryWithHelpers<HydratedDocument<Admin, {}, {}> | null, HydratedDocument<Admin, {}, {}>, {}, Admin, "findOne">}
 */
const getAdminById = (id) => {
    if (isValidObjectId(id)) return AdminModel.findById(id);
}


/**
 * Create a new admin
 * @param values admin data to be used to create the admin
 * @returns {Promise<Admin>}
 */
const createAdmin = (values) => new AdminModel(values).save().then((admin) => admin);


/**
 * Deletes admin with the admin's ID
 * @param id ID of the admin
 * @returns {QueryWithHelpers<ModifyResult<HydratedDocument<Admin, {}, {}>>, HydratedDocument<Admin, {}, {}>, {}, Admin, "findOneAndDelete">}
 */
const deleteAdminById = (id) => {
    if (isValidObjectId(id)) return AdminModel.findByIdAndDelete(id);
}

/**
 * Updates the admin with the ID of the admin
 * @param id ID of the Admin
 * @param values Admin data to be used for the update
 * @returns {QueryWithHelpers<HydratedDocument<Admin, {}, {}> | null, HydratedDocument<Admin, {}, {}>, {}, Admin, "findOneAndUpdate">}
 */
const updateAdminById = (id, values) => {
    if (isValidObjectId(id)) return AdminModel.findByIdAndUpdate(id, values);
}


export {
    getAdmins,
    getAdminByEmail,
    getAdminBySessionToken,
    getAdminById,
    createAdmin,
    deleteAdminById,
    updateAdminById,
    AdminModel
};
