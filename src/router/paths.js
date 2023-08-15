import Router from "./manage";
import { authenticateMiddleware, logMiddleware } from "../middlewares";
import { handleHello, handleUploadImage } from "./api-handlers";

const router = new Router();

router.addRoute('GET', '/api/hello', logMiddleware, handleHello);
router.addRoute('POST', '/api/upload_image', logMiddleware, authenticateMiddleware, handleUploadImage);


export { router };