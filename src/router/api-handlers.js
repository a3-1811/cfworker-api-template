import { processAndEncodeImage, readFormData, response } from "../utils";

export async function handleHello(context) {
	context.response = response(200, { message: 'Hello, Cloudflare Worker API!' });
}

export async function handleUploadImage(context) {
	const formData = await readFormData(context.request);
	const { avatar } = formData;
	context.response = response(200, { link: await processAndEncodeImage(avatar) });
}
