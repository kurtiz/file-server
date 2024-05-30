import {getAdminBySessionToken} from "../models/admins.js";
import {getUserBySessionToken} from "../models/users.js";

const isAuthenticatedAsAdmin = async (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).send('Unauthorized');
    }

    const admin_session_token = authHeader.split(' ')[1];

    if (admin_session_token) {
        const admin = await getAdminBySessionToken(admin_session_token);
        if (admin) {
            if (admin.authentication.session.expires < Date.now()) {
                return response.status(401).json({error: 'Unauthorized'});
            }
            request.locals = admin;
            next();
        } else {
            return response.status(401).json({error: 'Unauthorized'});
        }
    } else {
        return response.status(401).json({error: 'Unauthorized'});
    }
}


const isAuthenticatedAsUser = async (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).send('Unauthorized');
    }

    const user_session_token = authHeader.split(' ')[1];

    if (user_session_token) {
        const user = await getUserBySessionToken(user_session_token);
        if (user) {
            if (user.authentication.session.expires < Date.now()) {
                return response.status(401).json({error: 'Unauthorized'});
            }
            request.locals = user;
            next();
        } else {
            return response.status(401).json({error: 'Unauthorized'});
        }
    } else {
        return response.status(401).json({error: 'Unauthorized'});
    }
}

export {isAuthenticatedAsAdmin, isAuthenticatedAsUser}