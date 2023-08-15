export async function readRequestBody(request) {
	if (request.method === 'GET' || request.method === 'HEAD') {
		return null;
	}
	const contentType = request.headers.get('content-type');
	if (contentType.includes('application/json')) {
		return JSON.stringify(await request.json());
	} else if (contentType.includes('application/text')) {
		return request.text();
	} else if (contentType.includes('text/html')) {
		return request.text();
	} else {
		// Perhaps some other type of data was submitted in the form
		// like an image, or some other binary data.
		return JSON.stringify({ type: 'a file' });
	}
}

export async function readFormData(request) {
	const contentType = request.headers.get('content-type');
	if (contentType.includes('form')) {
		const formData = await request.formData();
		const body = {};
		for (const entry of formData.entries()) {
			body[entry[0]] = entry[1];
		}
		return body;
	}
	return null;
}

export function response(status = 400, data = {}) {
	return new Response(JSON.stringify({ ...data }), {
		status: status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export async function processAndEncodeImage(avatar) {
	// Implement image processing and encoding logic here
	// For demonstration purposes, we'll return a placeholder base64-encoded image link
	const base64Image = await convertFileToBase64(avatar);
	return `data:image/jpeg;base64,${base64Image}`;
}

async function convertFileToBase64(file) {
	const arrayBuffer = await file.arrayBuffer();
	return arrayBufferToBase64(arrayBuffer);
}

function arrayBufferToBase64(buffer) {
	let binary = '';
	const bytes = new Uint8Array(buffer);

	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}

	return btoa(binary);
}