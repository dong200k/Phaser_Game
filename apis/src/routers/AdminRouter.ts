import AdminController from "../controllers/AdminController";
import { isAuthenticated, isAuthorized } from "../middleware";


const express = require('express');
const AdminRouter = express.Router();


AdminRouter.post("/assignrole", 
    isAuthenticated, 
    isAuthorized({
        allowRoles: ["admin"],
    }),
    AdminController.assignRole
)

AdminRouter.post("/removerole",
    isAuthenticated,
    isAuthorized({
        allowRoles: ["admin"],
    }),
    AdminController.removeRole
)

AdminRouter.get("/getrole/:id",
    isAuthenticated,
    isAuthorized({
        allowRoles: ["admin"],
    }),
    AdminController.getRole
)

export default AdminRouter;