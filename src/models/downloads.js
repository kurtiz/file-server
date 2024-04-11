import mongoose from "mongoose";

/**
 * Mongoose schema for the Download model.
 *
 * @type {mongoose.Schema<Download>}
 */
const DownloadSchema = new mongoose.Schema(
    {
        download: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
            required: true
        },
        downloadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);


/**
 * Mongoose model for the Download schema.
 *
 * @type {mongoose.Model<Download>}
 */
const DownloadModel = mongoose.model('Download', DownloadSchema);

/**
 * Gets all the downloads
 * @returns {QueryWithHelpers<Array<HydratedDocument<Download, {}, {}>>, HydratedDocument<Download, {}, {}>, {}, Download, "find">}
 */
const getDownloads = () => DownloadModel.find()
    .populate("download")
    .populate("downloadedBy");


/**
 * Gets a download by the user id
 * @param id user id
 * @returns {QueryWithHelpers<UnpackedIntersection<Document<unknown, {}, Download> & Download & {_id: Types.ObjectId}, Document<unknown, {}, Download> & Download & {_id: Types.ObjectId}>, Document<unknown, {}, Download> & Download & {_id: Types.ObjectId}, {}, UnpackedIntersection<Download, Document<unknown, {}, Download> & Download & {_id: Types.ObjectId}>, "findOne">}
 */
const getDownloadByUserId = (id) => DownloadModel.findOne({downloadedBy: id})
    .populate("file")
    .populate("downloadedBy");


/**
 * Gets a download by the file id
 * @param id file id
 * @returns {QueryWithHelpers<UnpackedIntersection<Document<unknown, {}, Download> & Download & {_id: Types.ObjectId}, Document<unknown, {}, Download> & Download & {_id: Types.ObjectId}>, Document<unknown, {}, Download> & Download & {_id: Types.ObjectId}, {}, UnpackedIntersection<Download, Document<unknown, {}, Download> & Download & {_id: Types.ObjectId}>, "findOne">}
 */
const getDownloadByFileId = (id) => DownloadModel.findOne({file: id})
    .populate("file")
    .populate("downloadedBy");


/**
 * Gets download by their ID
 * @param id download id
 * @returns {QueryWithHelpers<HydratedDocument<Download, {}, {}> | null, HydratedDocument<Download, {}, {}>, {}, Download, "findOne">}
 */
const getDownloadById = (id) => DownloadModel.findById(id)
    .populate("file")
    .populate("downloadedBy");


/**
 * Create a new download
 * @param values download data to be used to create the download
 * @returns {Promise<Download>}
 */
const createDownload = (values) => new DownloadModel(values).save().then((download) => download);


/**
 * Deletes download with the download's ID
 * @param id ID of the download
 * @returns {QueryWithHelpers<ModifyResult<HydratedDocument<Download, {}, {}>>, HydratedDocument<Download, {}, {}>, {}, Download, "findOneAndDelete">}
 */
const deleteDownloadById = (id) => DownloadModel.findByIdAndDelete(id);

/**
 * Updates the download with the ID of the download
 * @param id ID of the Download
 * @param values Download data to be used for the update
 * @returns {QueryWithHelpers<HydratedDocument<Download, {}, {}> | null, HydratedDocument<Download, {}, {}>, {}, Download, "findOneAndUpdate">}
 */
const updateDownloadById = (id, values) => DownloadModel.findByIdAndUpdate(id, values);


export {
    getDownloads,
    getDownloadByFileId,
    getDownloadByUserId,
    getDownloadById,
    createDownload,
    deleteDownloadById,
    updateDownloadById,
    DownloadModel
};
