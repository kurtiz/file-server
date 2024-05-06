import multer from "multer";
import {generateRandomFileName} from "../utils/randomFileName.js";

export const multerAWSUpload = multer({ storage: multer.memoryStorage()});


// export const multerLocalUpload = multer({ dest: "assets/uploads/"});
const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'assets/uploads/');
    },
    filename: (request, file, callback) => {
        const newFileName = generateRandomFileName(file.originalname);
        request.newFileName = newFileName;
        callback(null, newFileName);
    }
});
export const multerLocalUpload = multer({storage});
