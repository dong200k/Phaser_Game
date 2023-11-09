import express from 'express'
import { isAuthenticated, isAuthorized } from '../middleware'
import JsonDBController from '../controllers/JsonDBController'

const JsonDBRouter = express.Router()

JsonDBRouter.post("/move-assets",
    isAuthenticated, 
    isAuthorized({
        allowRoles: ["admin", "gamemaster"],
    }),
    JsonDBController.portJsonDBToFirebase
)

export default JsonDBRouter