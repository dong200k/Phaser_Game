import MonsterController from "../controllers/MonsterController";
import { isAuthenticated, isAuthorized } from "../middleware";


const express = require('express');
const MonsterRouter = express.Router();

MonsterRouter.post('/create', isAuthenticated, isAuthorized({
    allowRoles: ['admin', 'gamemaster'],
}), MonsterController.createMonster)

MonsterRouter.post('/edit/:id', isAuthenticated, isAuthorized({
    allowRoles: ['admin', 'gamemaster'],
}), MonsterController.editMonster)

MonsterRouter.post('/delete/:id', isAuthenticated, isAuthorized({
    allowRoles: ['admin'],
}), MonsterController.deleteMonster)

MonsterRouter.get('/:id', isAuthenticated, isAuthorized({
    allowRoles: ['admin', 'gamemaster'],
    allowGameServer: true,
}), MonsterController.getMonster)

MonsterRouter.get('/', isAuthenticated, isAuthorized({
    allowRoles: ['admin', 'gamemaster'],
    allowGameServer: true,
}), MonsterController.getAllMonsters)


export default MonsterRouter;
