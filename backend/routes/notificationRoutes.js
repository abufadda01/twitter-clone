import express from "express"
import auth from "../middleware/auth.js"
import { deleteNotification, deleteNotifications , getNotifications } from "../controllers/notificationsControllers.js"


const notificationRoutes = express.Router()


notificationRoutes.get("/" , auth , getNotifications)

notificationRoutes.delete("/" , auth , deleteNotifications)

notificationRoutes.delete("/:notificationId" , auth , deleteNotification)


export default notificationRoutes
