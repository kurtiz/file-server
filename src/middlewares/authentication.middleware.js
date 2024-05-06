import {getAdminBySessionToken} from "../models/admins.js";

export const isAuthenticatedAsAdmin = async (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).send('Unauthorized');
    }

    const admin_session_token = authHeader.split(' ')[1];

    if (admin_session_token) {
        const admin = await getAdminBySessionToken(admin_session_token);
        if (admin) {
            request.locals = admin;
            next();
        } else {
            return response.status(401).send('Unauthorized');
        }
    } else {
        return response.status(401).send('Unauthorized');
    }
}