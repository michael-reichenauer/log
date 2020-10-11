var log = require('../Shared/Store.js');
var auth = require('../Shared/auth.js');

module.exports = async function (context, req) {
    context.log(`## Request: ClearLogs`);
    const clientPrincipal = auth.getClientPrincipal(req)

    log.clearLogs(clientPrincipal)
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: ""
    };

};