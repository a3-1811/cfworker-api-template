import { verifyToken } from "../security";
import { response } from "../utils";

export function logMiddleware(context) {
	console.log(`Request received: ${context.request.url}`);
}

export async function authenticateMiddleware(context) {
	const { request } = context;
	const token = request.headers.get('Authorization').replace('Bearer ', '');
	if (!token) {
		context.response = response(401, { error: 'Unauthorized' });
	}

	try {
		const decoded = await verifyToken(token);
		request.user = decoded;
		return null; // Authentication successful
	} catch (error) {
		context.response = response(401, { error: 'Unauthorized' });
	}
}
