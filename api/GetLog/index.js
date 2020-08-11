module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: JSON.stringify({ text: "Hello " + (req.query.name || req.body.name) })
        };
    }
    else {
        context.res = {
            status: 400,
            body: JSON.stringify({ text: "Please pass a name on the query string or in the request body" })
        };
    }
};