import generateRandomFileName from "../../utils/randomFileName.js";
import {deleteFile, uploadFile} from "../../helpers/s3client.helper.js";
import {SPACES_BUCKET} from "../../config.js";
import {createFile, deleteFileById, getFileById} from "../../models/files.js";
import Joi from "joi";
import {formatFileSize} from "../../helpers/file.helper.js";
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';
import {getDownloadById, getDownloads, getDownloadsCount} from "../../models/downloads.js";


const awsFileUpload = async (request, response) => {
    try {
        const file = request.file;
        const fileContent = file.buffer;
        const newFileName = generateRandomFileName(file.originalname);
        const currentAdmin = request.locals;

        const requestSchema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string()
        });

        const {error, _} = requestSchema.validate(request.body);
        if (error) {
            return response.status(400).json({error: error.details[0].message});
        } else if (!file) {
            return response.status(400).json({error: "Invalid file"});
        } else if (!currentAdmin) {
            return response.status(401).json({error: "Unauthorized"});
        }

        await uploadFile(
            SPACES_BUCKET,
            'files',
            newFileName,
            fileContent
        ).then(
            async (results) => {
                const fileData = {
                    filename: newFileName,
                    uploadedBy: currentAdmin._id,
                    title: request.body.title,
                    description: request.body.description,
                    fileSize: formatFileSize(request.file.size),
                    path: results.fileUrl
                }

                const createdFile = await createFile(fileData);
                return response.status(200).json({data: createdFile});
            }
        ).catch(async (error) => {
            console.error("Aws Error:", error);
            if (error.errorResponse.code === 11000) {
                await deleteFile(SPACES_BUCKET, 'files', newFileName);
                response.status(409).json({
                    error: `The ${Object.keys(error.errorResponse.keyValue)} already exist(s)`
                });
            } else {
                response.status(500).json({error: "Internal Server Error"});
            }
        });

    } catch (error) {
        console.log("Error:", error);
        response.status(500).json({error: "Internal Server Error"});
    }
}


const localFileUpload = async (request, response) => {
    try {
        const file = request.file;

        const currentAdmin = request.locals;

        const requestSchema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string()
        });

        const {error, _} = requestSchema.validate(request.body);
        if (error) {
            return response.status(400).json({error: error.details[0].message});
        } else if (!file) {
            return response.status(400).json({error: "Invalid file"});
        } else if (!currentAdmin) {
            return response.status(401).json({error: "Unauthorized"});
        }

        const fileSize = file.size;
        const fileData = {
            filename: request.newFileName,
            uploadedBy: currentAdmin._id,
            title: request.body.title,
            description: request.body.description,
            fileSize: formatFileSize(request.file.size),
            path: `${request.protocol}://${request.get('host')}/file/download/${request.newFileName}`
        };

        const createdFile = await createFile(fileData);
        return response.status(200).json({data: createdFile});

    } catch (error) {
        request.log.error("local upload error:", error);

        if (error.errorResponse.code === 11000) {
            await _localFileDelete(request.newFileName);
            response.status(409).json({
                error: `The ${Object.keys(error.errorResponse.keyValue)} already exist(s)`
            });
        } else {
            response.status(500).json({error: "Internal Server Error"});
        }
    }
}

const fileDelete = async (request, response) => {
    const fileData = request.params;
    const requestSchema = Joi.object({
        fileId: Joi.string().required()
    });

    const {error, _} = requestSchema.validate(fileData);
    if (error) {
        return response.status(400).json({error: error.details[0].message});
    }

    const file = await getFileById(fileData.fileId);

    if (!file) {
        return response.status(404).json({error: "File not found"});
    }

    if (file.path.includes("digitaloceanspaces")) {
        deleteFile(
            SPACES_BUCKET,
            'files',
            file.filename
        ).then(async () => {
            await deleteFileById(fileData.fileId);
            return response.status(200).json({message: "File deleted successfully"});
        }).catch((error) => {
            console.log(error);
            return response.status(500).json({error: "Internal Server Error"})
        });
    } else {
        _localFileDelete(file.filename).then(
            async () => {
                await deleteFileById(fileData.fileId);
                return response.status(200).json({message: "File deleted successfully"})
            }
        ).catch(
            (error) => {
                request.log.error("File delete error:",error);
                return response.status(500).json({error: "Internal Server Error"})
            }
        );
    }
}

const getAllDownloads = async (request, response) => {
    try {
        const downloads = await getDownloads();
        if (downloads) {
            return response.status(200).json({data: downloads});
        } else {
            return response.status(404).json({error: "No downloads found"});
        }
    } catch (error) {
        request.log.error(error);
        return response.status(500).json({error: "Internal Server Error"});
    }
}


const getAllDownloadsCount = async (request, response) => {
    try {
        const numberOfDownloads = await getDownloadsCount();
        if (numberOfDownloads) {
            return response.status(200).json({data: {count: numberOfDownloads}});
        } else {
            return response.status(404).json({error: "No downloads found"});
        }
    } catch (error) {
        request.log.error(error);
        return response.status(500).json({error: "Internal Server Error"});
    }
}

const getDownload = async (request, response) => {
    try {
        const requestSchema = Joi.object({
            downloadId: Joi.string().required()
        });
        const {error, _} = requestSchema.validate(request.params);
        if (error) {
            return response.status(400).json({error: error.details[0].message});
        }

        const downloadId = request.params.downloadId;

        const download = await getDownloadById(downloadId);
        if (download) {
            return response.status(200).json({data: download});
        } else {

            return response.status(404).json({error: "Download not found"});
        }
    } catch (error) {
        request.log.error(error);
        return response.status(500).json({error: "Internal Server Error"});
    }
}

const _localFileDelete = async (filename) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const filePath = join(__dirname, '../../../assets/uploads', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return false;
        } else {
            return true;
        }
    });
}

export {
    awsFileUpload,
    localFileUpload,
    fileDelete,
    getAllDownloads,
    getAllDownloadsCount,
    getDownload
};