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


export default AdminRouter;