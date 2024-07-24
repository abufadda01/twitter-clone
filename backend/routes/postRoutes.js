import express from "express"
import auth from "../middleware/auth.js"
import { createPost , likeUnlikePost , commentOnPost , deletePost, getAllPosts, getLikedPosts} from "../controllers/postControllers.js"


const postRoutes = express.Router()


postRoutes.get("/" , auth , getAllPosts)

postRoutes.post("/create" , auth , createPost)

postRoutes.post("/like/:postId" , auth , likeUnlikePost)

postRoutes.post("/comment/:postId" , auth , commentOnPost)

postRoutes.delete("/:postId" , auth , deletePost)

postRoutes.get("/liked" , auth , getLikedPosts)



export default postRoutes