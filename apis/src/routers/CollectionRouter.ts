import express from 'express'
import CollectionController from '../controllers/CollectionController'

const CollectionRouter = express.Router()

CollectionRouter.post("/:colName/:id",
    CollectionController.createDocument
)

CollectionRouter.get("/:colName/:id",
    CollectionController.getDocument
)

CollectionRouter.get("/:colName",
    CollectionController.getAllDocuments
)

CollectionRouter.delete("/:colName/:id",
    CollectionController.deleteDocument
)

CollectionRouter.put("/:colName/:id/save",
    CollectionController.saveDocument
)

export default CollectionRouter