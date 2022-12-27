const router = require("express").Router();
const { ObjectId } = require("mongoose");
const Post = require("../modules/post");

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({
            count: posts.length,
            posts,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const creatorID = req.user._id;
        const { title, photo, description } = req.body;
        if (!(title && photo))
            res.status(403).json({
                message: "title and photo are required",
            });

        const newPost = await Post.create({
            title,
            description,
            photo,
            creator: creatorID,
        });

        await newPost.save();
        res.status(201).json({
            message: "successfully created",
            post: newPost,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.get("/user-posts/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const posts = await Post.find({
            creator: userId,
        });
        res.status(200).json({
            count: posts.length,
            posts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/my-following-posts", async (req, res) => {
    try {
        const following = req.user.following;
        const posts = await Post.find({
            creator: { $in: following },
        });
        res.status(200).json({
            count: posts.length,
            posts,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.post("/add-comment", async (req, res) => {
    try {
        const { postID, comment } = req.body;
        const post = await Post.findById(postID);
        if (!post) {
            res.status(404).json({
                message: "Post not found",
                postID,
                comment,
            });
        } else {
            post.comments.push({ message: comment, creator: req.user.firstName });
            await post.save();

            res.status(200).json({
                message: "Successfully added comment",
                postID,
                comment,
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/like", async (req, res) => {
    try {
        const { postID } = req.body;
        const post = await Post.findById(ObjectId(postID));
        if (!post)
            return res.status(404).json({
                message: "Post not found",
                postID,
            });
        if (post.likes.includes(req.user._id)) {
            post.likes.splice(post.likes.indexOf(req.user._id));
        } else {
            post.likes.push(req.user._id);
        }
        await post.save();
        res.status(200).json({
            message: "Successfully liked or disliked post",
            post,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const id = req.params.id;
            const post = await Post.findById(id);

            res.status(200).json({
                post,
            });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    })
    .patch(async (req, res) => {
        try {
            const id = req.params.id;
            const { title, photo, description } = req.body;

            const updatePost = await Post.findByIdAndUpdate(
                id,
                { title, description, photo },
                {
                    new: true,
                    omitUndefined: true,
                }
            );

            res.status(200).json({
                message: "successfully updated",
                post: updatePost,
            });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const id = req.params.id;
            await Post.findByIdAndDelete(id);
            res.status(200).json({
                message: "successfully deleted",
            });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    });

module.exports = router;
