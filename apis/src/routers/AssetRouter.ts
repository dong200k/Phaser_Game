import AssetController from "../controllers/AssetController";
import { isAuthenticated, isAuthorized } from "../middleware";

const express = require('express');
const AssetRouter = express.Router();


AssetRouter.post("/upload",
    isAuthenticated,
    isAuthorized({
        allowRoles: ["admin", "gamemaster"],
        allowGameServer: true,
    }),
    AssetController.upload
)

AssetRouter.get("/",
    isAuthenticated,
    isAuthorized({
        allowRoles: ["admin", "gamemaster"],
        allowGameServer: true,
    }),
    AssetController.getAllAssets
)

// AssetRouter.get("/",
//     isAuthenticated,
//     isAuthorized({
//         allowRoles: ["admin", "gamemaster"],
//         allowGameServer: true,
//     }),
//     AssetController.getAllAssets
// )

export default AssetRouter;