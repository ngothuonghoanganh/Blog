/**
 * JWT Cookies reader - ExpressJS Middleware
 * ------
 * This middleware attach the JWT Cookies into authorization
 *  header, before passing to handlers. Because we use httpOnly
 *  cookies, it cannot be read by client. The cookies will
 *  automatically be sent along with request, and only us can read
 *  it at server-side.
 *
 *  So, attach this to Authorization header.
 */
module.exports = (req, res, next) => {
    if (req.cookies.jwt) {
        // attach to the authorization header
        req.headers.authorizeation = `Bearer ${req.cookies.jwt}`;
    }

    //pass to the other middleware
    next();
};
