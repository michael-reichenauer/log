//import preval from 'preval.macro'
//const version = preval`module.exports = new Date().toLocaleString();`;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const ver = process.env.REACT_APP_GIT_SHA
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify({ version: ver })
    };
};