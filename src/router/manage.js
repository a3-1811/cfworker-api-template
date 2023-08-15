import { readRequestBody, response } from "../utils";

export default class Router {
	constructor() {
		this.routes = new Map();
	}

	addRoute(method, path, ...handlers) {
		const methodRoutes = this.routes.get(method) || new Map();
		methodRoutes.set(path, handlers);
		this.routes.set(method, methodRoutes);
	}

	async route(request) {
		let body = null;
		const { method } = request;

		if (method === 'POST') {
			body = JSON.parse(await readRequestBody(request));
		}
		const url = new URL(request.url);
		const methodRoutes = this.routes.get(method);

		if (methodRoutes) {
			for (const [routePath, handlers] of methodRoutes.entries()) {
				const routeMatch = this.matchRoute(routePath, url.pathname);

				if (routeMatch) {
					const context = { request, response: null, params: routeMatch.params, body };
					await this.runHandlers(context, handlers);
					return context.response || response(404, { error: 'Not Found' });
				}
			}
		}

		return response(404, { error: 'Not Found' });
	}

	async runHandlers(context, handlers) {
		for (const handler of handlers) {
			await handler(context);
			if (context.response) {
				break; // Stop processing if a response has been generated
			}
		}
	}

	matchRoute(routePath, urlPath) {
		const routeSegments = routePath.split('/').filter((segment) => segment !== '');
		const urlSegments = urlPath.split('/').filter((segment) => segment !== '');

		if (routeSegments.length !== urlSegments.length) {
			return null; // Paths have different segment counts
		}

		const params = {};

		for (let i = 0; i < routeSegments.length; i++) {
			const routeSegment = routeSegments[i];
			const urlSegment = urlSegments[i];

			if (routeSegment.startsWith(':')) {
				const paramName = routeSegment.slice(1);
				params[paramName] = urlSegment;
			} else if (routeSegment !== urlSegment) {
				return null; // Segments don't match
			}
		}

		return { params };
	}
}