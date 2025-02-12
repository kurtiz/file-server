import mongoose, {isValidObjectId} from "mongoose";

/**
 * Mongoose schema for the Email model.
 *
 * @type {mongoose.Schema<Email>}
 */
const EmailSchema = new mongoose.Schema(
    {
        recipient: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        content: {
            type: String,
        },
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
            required: true
        },
        sentByUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        sentByAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        }
    },
    {
        timestamps: true
    }
);


/**
 * Mongoose model for the Email schema.
 *
 * @type {mongoose.Model<Email>}
 */
const EmailModel = mongoose.model('Email', EmailSchema);

/**
 * Gets all the emails
 * @returns {QueryWithHelpers<Array<HydratedDocument<Email, {}, {}>>, HydratedDocument<Email, {}, {}>, {}, Email, "find">}
 */
const getEmails = (skip = 0, limit = null, filter = {}) => EmailModel.find(filter)
    .populate("file")
    .populate("sentByUser")
    .populate("sentByAdmin")
    .skip(skip)
    .limit(limit)
    .sort({createdAt: -1});

/**
 * Gets count of all the emails
 * @returns {QueryWithHelpers<number, HydratedDocument<Download, {}, {}>, {}, Download, "countDocuments">}
 */
const getEmailsCount = () => EmailModel.countDocuments();

/**
 * Gets count of emails by file id
 * @returns {QueryWithHelpers<number, Document<unknown, {}, Email> & Email & {_id: Types.ObjectId}, {}, Email, "countDocuments">}
 */
const getEmailsCountByFileId = (fileId) => {
    if (isValidObjectId(fileId)) return EmailModel.find({file: fileId}).countDocuments();
}


/**
 * Gets an email by the user id
 * @param id user id
 * @returns {QueryWithHelpers<UnpackedIntersection<Document<unknown, {}, Email> & Email & {_id: Types.ObjectId}, Document<unknown, {}, Email> & Email & {_id: Types.ObjectId}>, Document<unknown, {}, Email> & Email & {_id: Types.ObjectId}, {}, UnpackedIntersection<Email, Document<unknown, {}, Email> & Email & {_id: Types.ObjectId}>, "findOne">}
 */
const getEmailByUserId = (id) => {
    if (isValidObjectId(id)) return EmailModel.findOne({sentByUser: id}).populate("file").populate("sentByUser")
}

/**
 * Gets an email by the user id
 * @param id user id
 * @returns {QueryWithHelpers<UnpackedIntersection<Document<unknown, {}, Email> & Email & {_id: Types.ObjectId}, Document<unknown, {}, Email> & Email & {_id: Types.ObjectId}>, Document<unknown, {}, Email> & Email & {_id: Types.ObjectId}, {}, UnpackedIntersection<Email, Document<unknown, {}, Email> & Email & {_id: Types.ObjectId}>, "findOne">}
 */
const getEmailByAdminId = (id) => {
    if (isValidObjectId(id)) return EmailModel.findOne({sentByAdmin: id}).populate("file").populate("sentByAdmin")
}


/**
 * Gets email by their ID
 * @param id email id
 * @returns {QueryWithHelpers<HydratedDocument<Email, {}, {}> | null, HydratedDocument<Email, {}, {}>, {}, Email, "findOne">}
 */
const getEmailById = (id) => {
    if (isValidObjectId(id)) return EmailModel.findById(id).populate("file").populate("sentBy")
}


/**
 * Create a new email
 * @param values email data to be used to create the email
 * @returns {Promise<Email>}
 */
const createEmail = (values) => new EmailModel(values).save().then((email) => email);


/**
 * Deletes email with the email's ID
 * @param id ID of the email
 * @returns {QueryWithHelpers<ModifyResult<HydratedDocument<Email, {}, {}>>, HydratedDocument<Email, {}, {}>, {}, Email, "findOneAndDelete">}
 */
const deleteEmailById = (id) => {
    if (isValidObjectId(id)) return EmailModel.findByIdAndDelete(id);
}

/**
 * Updates the email with the ID of the email
 * @param id ID of the Email
 * @param values Email data to be used for the update
 * @returns {QueryWithHelpers<HydratedDocument<Email, {}, {}> | null, HydratedDocument<Email, {}, {}>, {}, Email, "findOneAndUpdate">}
 */
const updateEmailById = (id, values) => {
    if (isValidObjectId(id)) return EmailModel.findByIdAndUpdate(id, values);
}


export {
    getEmails,
    getEmailByUserId,
    getEmailById,
    createEmail,
    deleteEmailById,
    updateEmailById,
    getEmailsCount,
    getEmailByAdminId,
    getEmailsCountByFileId,
    EmailModel
};
