import { Router } from "express";

export const routerIndex = Router();

routerIndex.get('/', (req, res) => {
    res.status(200);
    res.json({
        status: 1,
        response: "API Online"
    });
});