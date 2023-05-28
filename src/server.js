const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const cors = require('cors');

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://notesapp-v1.dicodingacademy.com']
            }
        }
    });

    server.route({
        method: 'OPTIONS',
        path: '/{any*}',
        handler: function (request, h) {
            return h.response().code(204);
        }
    });

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
        if (response.isBoom && response.output.statusCode === 404) {
            return h.response({
                status: 'fail',
                message: 'Resource not found'
            }).code(404);
        }
        return h.continue;
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
