import { Router } from "express";
import { getAll } from "../controllers/products.controller.js";

//Inicializar servicios
const router = Router();

// Método asyncrono para obtener todos los productos
router.get("/", getAll);

export default router;
