import {getFiles, getFilesCount} from "../models/files.js";

const filesFeed = async (request, response) => {
    try {
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 10;

        const skip = (page - 1) * limit;

        const files = await getFiles(skip, limit);
        const totalCount = await getFilesCount();

        response.status(200).json({
            data: {
                files: files,
                totalCount: totalCount,
                page: page,
                limit: limit,
            }
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({error: "Internal server error"});
    }
}

export {filesFeed}