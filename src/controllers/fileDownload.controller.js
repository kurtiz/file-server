import {join, dirname} from 'path';
import {fileURLToPath} from 'url';


const downloadFile = (request, response) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const filename = request.params.filename;
    const filePath = join(__dirname, '../../assets/uploads', filename);
    response.download(filePath);
}

export {downloadFile}