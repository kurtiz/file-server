import {S3} from "@aws-sdk/client-s3";
import {SPACES_KEY, SPACES_SECRET} from "../config.js";

/**
 * AWS S3 client
 * @type {S3}
 */
const s3Client = new S3({
    endpoint: "https://nyc3.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
        accessKeyId: SPACES_KEY,
        secretAccessKey: SPACES_SECRET
    }
});

/**
 * List the content of the bucket
 * @function
 * @async
 * @name listBucketContent
 * @param bucketName
 * @return {Promise<void>}
 */
async function listBucketContent(bucketName) {
    try {
        const response = await s3Client.listObjectsV2(
            {Bucket: bucketName}
        );
        const objects = response.Contents;
        objects.forEach((object) => {
            console.log(object.Key);
        });
    } catch (error) {
        console.error("Error listing bucket content:", error);
    }
}

/**
 * List the content of the folder
 * @function
 * @async
 * @name listFolderContent
 * @param bucketName
 * @param folderName
 * @return {Promise<void>}
 */
async function listFolderContent(bucketName, folderName) {
    try {
        const response = await s3Client.listObjectsV2({
            Bucket: bucketName,
            Prefix: folderName
        });
        const objects = response.Contents;
        objects.forEach((object) => {
            console.log(object.Key);
        });
    } catch (error) {
        console.error("Error listing folder content:", error);
    }
}

/**
 * Upload a file to S3
 * @function
 * @async
 * @name uploadFile
 * @param bucket_name
 * @param folderName
 * @param filename
 * @param fileContent
 * @return {Promise<{fileUrl: string, message: string}>}
 */
const uploadFile = async (bucket_name, folderName, filename, fileContent) => {
    try {
        const objectKey = `${folderName}/${filename}`;
        const uploadParams = {
            Bucket: bucket_name,
            Key: objectKey,
            Body: fileContent,
            ACL: 'public-read',
            ContentType: fileContent.mimetype, // Assuming fileContent includes mimetype
        };

        // Upload the file using the S3 client
        await s3Client.putObject(uploadParams);

        return {
            message: 'File uploaded successfully!',
            fileUrl: `https://${bucket_name}.nyc3.cdn.digitaloceanspaces.com/${objectKey}`
        };
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error;
    }
};


/** delete file from S3
 * @function
 * @async
 * @name deleteFile
 * @param bucketName
 * @param folderName
 * @param filename
 * @return {Promise<void>}
 */
const deleteFile = async (bucketName, folderName, filename) => {
    try {
        const objectKey = `${folderName}/${filename}`;
        await s3Client.deleteObject({Bucket: bucketName, Key: objectKey});
        console.log('File deleted successfully');
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw error;
    }
};

export {
    s3Client,
    listBucketContent,
    listFolderContent,
    uploadFile,
    deleteFile
};
