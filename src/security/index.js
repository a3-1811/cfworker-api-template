import * as jose from 'jose';

const SECRET_KEY = 'd3f4ult';
const JWT_SECRET_KEY = new TextEncoder().encode(SECRET_KEY);

export async function verifyToken(token) {
	const { payload } = await jose.jwtVerify(token, JWT_SECRET_KEY);
	return payload;
}

export async function generateToken(info) {
	return await new jose.SignJWT(info).setProtectedHeader({ alg: 'HS512', typ: 'JWT' }).setExpirationTime('2h').sign(JWT_SECRET_KEY);
}
