import AssetController from "../controllers/AssetController";
import { isAuthenticated, isAuthorized } from "../middleware";

const express = require('express');
const AssetRouter = express.Router();


AssetRouter.post("/upload",
    isAuthenticated,
    isAuthorized({
        allowRoles: ["admin", "gamemaster"],
    }),
    AssetController.upload
)

AssetRouter.post("/edit/:id", 
    isAuthenticated,
    isAuthorized({
        allowRoles: ["admin", "gamemaster"],
    }),
    AssetController.edit
)

AssetRouter.get("/",
    isAuthenticated,
    isAuthorized({
        allowRoles: ["admin", "gamemaster"],
        allowGameServer: true,
    }),
    AssetController.getAllAssets
)

AssetRouter.post("/restore", 
    AssetController.restoreAsset
)

export default AssetRouter;