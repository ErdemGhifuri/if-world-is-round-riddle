"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLayer = void 0;
const AuthLayer = (req, res, next) => {
    try {
        const authHeaders = req.headers.authorization;
        if ((authHeaders === null || authHeaders === void 0 ? void 0 : authHeaders.replace("Basic ", "")) !== process.env.AUTH_HEADER)
            return res.sendStatus(401);
        else
            next();
    }
    catch (error) {
        console.log("error in AuthLayer:", error);
        return res.sendStatus(401);
    }
};
exports.AuthLayer = AuthLayer;
