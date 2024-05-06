import crypto from "crypto";

export const generateRandomFileName = (name) => {
    // Ensure name is a string and not empty
    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('Invalid filename: must be a non-empty string');
    }

    // Split name at the last dot
    const parts = name.split('.');

    // Generate a random alphanumeric string if no extension provided.
    const randomString = crypto.randomBytes(15).toString('hex');
    const extension = parts.length === 1 ? "" : `.${parts[parts.length - 1]}`;

    // Combine the elements for the filename.
    return `${randomString}${extension}`;
}
