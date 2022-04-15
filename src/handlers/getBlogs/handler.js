const middy = require("@middy/core");
const httpErrorHandlerMiddleware = require(`/opt/nodejs/resources/middlewares/httpErrorHandler.middleware`);
const { handler } = require(`/opt/nodejs/handlers/getBlogs`);

exports.handler = middy(handler).use(httpErrorHandlerMiddleware());
