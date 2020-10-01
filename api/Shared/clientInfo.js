var auth = require('../Shared/auth.js');

exports.getInfo = (context, req) => {
    // const clientPrincipal = auth.getClientPrincipal(req)

    // const userAgent = req.headers["user-agent"];
    // const forwardedHost = req.headers["x-forwarded-host"];
    // const host = req.headers["host"];

    return {
        // clientPrincipal: clientPrincipal,
        // userAgent: userAgent,
        // forwardedHost: forwardedHost,
        // host: host,
        req: req,
    }
}