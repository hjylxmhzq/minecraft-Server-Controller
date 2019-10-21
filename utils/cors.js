function allowCors(ctx) {
    const corsUrl = ctx.headers['origin'] || '*';
    ctx.set('Access-Control-Allow-Origin', corsUrl);
    ctx.set("Access-Control-Allow-Credentials", "true");
    return ctx;
}

function disallowCors(ctx) {
    ctx.set('Access-Control-Allow-Origin', '');
    ctx.set('Access-Control-Allow-Credentials', '');
    return ctx;
}

module.exports = {
    allowCors,
    disallowCors
}