'use Static';

const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');


const HTTP_PORT = 3000;
const HTTP_PATH = './public/';

const FAYE_ENABLED = true;
const FAYE_PATH = '/faye';



const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, HTTP_PATH)
            }
        }
    }
});
server.connection({ port: HTTP_PORT });

if (FAYE_ENABLED){
    const faye = require('faye');
    const bayeux = new faye.NodeAdapter({mount: FAYE_PATH});
    bayeux.attach(server.listener);
}

server.register(Inert, () => {});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
});