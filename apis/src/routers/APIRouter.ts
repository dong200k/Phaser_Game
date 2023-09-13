import AdminRouter from "./AdminRouter";
import AssetRouter from "./AssetRouter";
import DungeonRouter from "./DungeonRouter";
import MonsterRouter from "./MonsterRouter";
import PlayerRouter from "./PlayerRouter";
import RoleRouter from "./RoleRouter";

const express = require('express');
const APIRouter = express.Router();

APIRouter.use("/admin", AdminRouter);
APIRouter.use(PlayerRouter)
APIRouter.use(RoleRouter)
APIRouter.use("/monsters", MonsterRouter);
APIRouter.use("/dungeons", DungeonRouter);
APIRouter.use("/assets", AssetRouter);

export default APIRouter;