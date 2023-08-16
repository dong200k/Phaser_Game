import DungeonController from "../controllers/DungeonController";
import { isAuthenticated, isAuthorized, isGameServer } from "../middleware";

const express = require('express');
const DungeonRouter = express.Router();

DungeonRouter.get('/:id', isAuthenticated, isAuthorized({
    allowRoles: ['admin', 'gamemaster'],
    allowGameServer: true,
}), DungeonController.getDungeon)

DungeonRouter.get('/', isAuthenticated, isAuthorized({
    allowRoles: ['admin', 'gamemaster'],
    allowGameServer: true,
}), DungeonController.getAllDungeons)

export default DungeonRouter;