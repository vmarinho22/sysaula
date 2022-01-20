import { Router } from "express";

export const routerIndex = Router();

routerIndex.get('/', (req, res) => {
    res.send('API Escola - [ONLINE]');
});