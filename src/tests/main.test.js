// import {connectToDatabase} from "../models/database.js";
// import {createUser} from "../models/users.js";
// import {createFile, getFiles} from "../models/files.js";
// import {createAdmin} from "../models/admins.js";
//
//
// await connectToDatabase();
// const userData = {
//     fullname: "John Doe",
//     email: "johndoe@example.com",
//     email_verified: false,
//     authentication: {
//         password: "securepassword",
//         session: {
//             token: "dummytoken123",
//             expires: new Date("2023-12-31")
//         },
//         otp: {
//             code: 1234,
//             expires: new Date("2022-01-01")
//         }
//     }
// };
//
// // const createdUser = await createUser(userData);
// const createdUser = await createAdmin(userData);
//
// console.log(`Created user: ${createdUser}`);
//
// console.log("\n\n\n\n\n\n\n\n\n\n\n\n==============================================");
//
//
// const fileData = {
//     filename: "file2",
//     uploadedBy: createdUser._id,
//     title: "File 2",
//     description: "This is file 2",
//     path: "src/models/files2.js"
// }
// const createdFile = await createFile(fileData);
//
//
// console.log(`Created file: ${createdFile}`);
//
// console.log("\n\n\n\n\n\n\n\n\n\n\n\n==============================================");
//
//
// getFiles().then((files) => console.log(files));


import {deleteFile} from "../helpers/s3client.helper.js";
import {SPACES_BUCKET} from "../config.js";

await deleteFile(SPACES_BUCKET, 'files', "7667eded1636a867a933c192fc4154.png")