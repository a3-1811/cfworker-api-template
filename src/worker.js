// routers
import { router } from './router/paths';

// +++++++++++++++++++++++++++++++++++++++++ MAIN ++++++++++++++++++++++++++++++++++++++++

addEventListener('fetch', (event) => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
	return router.route(request);
}
