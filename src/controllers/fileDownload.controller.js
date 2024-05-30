import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {getFileById} from "../models/files.js";
import {createDownload} from "../models/downloads.js";


const downloadFile = (request, response) => {
    const filename = request.params.filename;
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const filePath = join(__dirname, '../../assets/uploads', filename);
    response.download(filePath);
}

const recordDownload = async (request, response) => {
    const fileId = request.params.fileId;

    const file = await getFileById(fileId);

    if(!file){
        return response.status(404).json({error: "File not found"});
    }

    createDownload({
        file: file._id
    }).then(() => {
        return response.redirect(file.path);
    }).catch((error) => {
        console.log(error);
        return response.status(500).json({error: "Internal Server Error"});
    })
}

export {downloadFile, recordDownload}