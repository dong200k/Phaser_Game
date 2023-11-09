import AdminRouter from "./AdminRouter";
import AssetRouter from "./AssetRouter";
import CollectionRouter from "./CollectionRouter";
import DungeonRouter from "./DungeonRouter";
import JsonDBRouter from "./JsonDBRouter";
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
APIRouter.use("/col", CollectionRouter);
APIRouter.use("/json", JsonDBRouter);

export default APIRouter;