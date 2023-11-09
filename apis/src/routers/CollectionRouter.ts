import express from 'express'
import CollectionController from '../controllers/CollectionController'
import { isAuthenticated, isAuthorized } from '../middleware'

const CollectionRouter = express.Router()

CollectionRouter.post("/:colName/:id",
    isAuthenticated, 
    isAuthorized({
        allowRoles: ["admin", "gamemaster"],
    }),
    CollectionController.createDocument
)

CollectionRouter.get("/:colName/:id",
    isAuthenticated, 
    isAuthorized({
        allowRoles: ["admin", "gamemaster"],
    }),
    CollectionController.getDocument
)

CollectionRouter.get("/:colName",
    isAuthenticated, 
    isAuthorized({
        allowRoles: ["admin", "gamemaster"],
        allowGameServer: true
    }),
    CollectionController.getAllDocuments
)

CollectionRouter.post("/:colName", 
    isAuthenticated,
    isAuthorized({
        allowRoles: ["admin"],
        allowGameServer: false
    }),
    CollectionController.restoreCollection,
)

CollectionRouter.delete("/:colName/:id",
    isAuthenticated, 
    isAuthorized({
        allowRoles: ["admin", "gamemaster"],
    }),
    CollectionController.deleteDocument
)

CollectionRouter.put("/:colName/:id/save",
    isAuthenticated, 
    isAuthorized({
        allowRoles: ["admin", "gamemaster"],
    }),
    CollectionController.saveDocument
)

export default CollectionRouter