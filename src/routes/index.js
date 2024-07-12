import { Router } from "express";
import licoresRouters from "./licores.routes.js";
import cartsRouters from "./carts.routes.js";
import sessionRouters from "./session.routes.js"
const router = Router();



router.use("/licores", licoresRouters);
router.use("/carts", cartsRouters);
router.use("/session", sessionRouters)

export default router;
