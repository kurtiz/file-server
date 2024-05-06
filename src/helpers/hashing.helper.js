import bcrypt from "bcrypt";

/**
 * Hashes a password using bcrypt
 * @param password
 * @returns {Promise<unknown>}
 */
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function (err, hash) {
            if (hash) {
                resolve(hash);
            } else {
                reject(err);
            }
        });
    });
}

/**
 * Compares a password with a hashed password
 * @param password
 * @param hashedPassword
 * @returns {*}
 */
const hashCompare = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}

export {
    hashPassword,
    hashCompare
}