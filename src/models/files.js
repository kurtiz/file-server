import mongoose, {isValidObjectId} from "mongoose";

/**
 * Mongoose schema for the File model.
 *
 * @type {mongoose.Schema<File>}
 */
const FileSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
            unique: true
        },
        fileSize: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
        },
        path: {
            type: String,
            required: true
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        }
    },
    {
        timestamps: true
    }
);


/**
 * Mongoose model for the File schema.
 *
 * @type {mongoose.Model<File>}
 */
const FileModel = mongoose.model('File', FileSchema);

/**
 * Gets all the files
 * @returns {QueryWithHelpers<Array<HydratedDocument<File, {}, {}>>, HydratedDocument<File, {}, {}>, {}, File, "find">}
 */
const getFiles = () => FileModel.find()
    .populate("uploadedBy")
    .sort({createdAt: -1});

/**
 * Gets some of the files based on certain options
 * @returns {QueryWithHelpers<Array<HydratedDocument<File, {}, {}>>, HydratedDocument<File, {}, {}>, {}, File, "find">}
 */
const getFilesWithOptions = (skip = 0, limit = 10) => FileModel.find()
    .populate("uploadedBy")
    .skip(skip)
    .limit(limit)
    .sort({createdAt: -1});

/**
 * Gets count of all the files
 * @returns {QueryWithHelpers<number, HydratedDocument<File, {}, {}>, {}, File, "countDocuments">}
 */
const getFilesCount = () => FileModel.countDocuments();


/**
 * Gets a file by the user id
 * @param id user id
 * @returns {QueryWithHelpers<UnpackedIntersection<Document<unknown, {}, File> & File & {_id: Types.ObjectId}, Document<unknown, {}, File> & File & {_id: Types.ObjectId}>, Document<unknown, {}, File> & File & {_id: Types.ObjectId}, {}, UnpackedIntersection<File, Document<unknown, {}, File> & File & {_id: Types.ObjectId}>, "findOne">}
 */
const getFileByUserId = (id) => {
    if (isValidObjectId(id)) return FileModel.findOne({uploadedBy: id}).populate("uploadedBy");
}


/**
 * Gets file by their ID
 * @param id file id
 * @returns {QueryWithHelpers<HydratedDocument<File, {}, {}> | null, HydratedDocument<File, {}, {}>, {}, File, "findOne">}
 */
const getFileById = (id) => {
    if (isValidObjectId(id)) return FileModel.findById(id).populate("uploadedBy");
}

/**
 * Gets file by their ID
 * @returns {QueryWithHelpers<HydratedDocument<File, {}, {}> | null, HydratedDocument<File, {}, {}>, {}, File, "findOne">}
 * @param query
 */
const getFilesByQuery = (query) => FileModel.find(query).populate("uploadedBy").sort({createdAt: -1});


/**
 * Create a new file
 * @param values file data to be used to create the file
 * @returns {Promise<File>}
 */
const createFile = (values) => new FileModel(values).save().then((file) => file);


/**
 * Deletes file with the file's ID
 * @param id ID of the file
 * @returns {QueryWithHelpers<ModifyResult<HydratedDocument<File, {}, {}>>, HydratedDocument<File, {}, {}>, {}, File, "findOneAndDelete">}
 */
const deleteFileById = (id) => {
    if (isValidObjectId(id)) return FileModel.findByIdAndDelete(id);
}

/**
 * Updates the file with the ID of the file
 * @param id ID of the File
 * @param values File data to be used for the update
 * @returns {QueryWithHelpers<HydratedDocument<File, {}, {}> | null, HydratedDocument<File, {}, {}>, {}, File, "findOneAndUpdate">}
 */
const updateFileById = (id, values) => {
    if (isValidObjectId(id)) return FileModel.findByIdAndUpdate(id, values);
}


export {
    getFiles,
    getFileByUserId,
    getFileById,
    createFile,
    deleteFileById,
    updateFileById,
    getFilesCount,
    getFilesByQuery,
    getFilesWithOptions,
    FileModel
};
