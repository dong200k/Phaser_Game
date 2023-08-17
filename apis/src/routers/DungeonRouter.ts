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

DungeonRouter.post('/create', isAuthenticated, isAuthorized({
    allowRoles: ['admin', 'gamemaster'],
}), DungeonController.createDungeon)

DungeonRouter.post('/edit/:id', isAuthenticated, isAuthorized({
    allowRoles: ['admin', 'gamemaster'],
    allowGameServer: true,
}), DungeonController.editDungeon)

export default DungeonRouter;