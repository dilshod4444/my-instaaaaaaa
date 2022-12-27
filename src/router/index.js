const router = require("express").Router();
const userController = require("../controllers/user");
const postController = require("../controllers/post");
const authMiddleware = require("../middlewares/auth");

router.use("/user", userController);
router.use("/post", authMiddleware, postController);

module.exports = router;
