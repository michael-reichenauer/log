module.exports = async function (context, req) {
    context.log(`## Request: IsReady`);
    context.res = { status: 200, body: JSON.stringify({ ready: true }) };
}