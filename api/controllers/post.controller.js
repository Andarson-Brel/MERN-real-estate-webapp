import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;
  //   console.log(query);
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 10000000,
        },
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error:failed to get Posts" });
  }
};

// export const getPosts = async (req, res) => {
//   const query = req.query;
//   //   console.log(query);
//   try {
//     let where = {};

//     if (query.city !== undefined && query.city !== "null") {
//       where.city = query.city;
//     }

//     if (query.type !== undefined && query.type !== "null") {
//       where.type = query.type;
//     }

//     if (query.property !== undefined && query.property !== "null") {
//       where.property = query.property;
//     }

//     if (query.bedroom !== undefined && query.bedroom !== "null") {
//       where.bedroom = parseInt(query.bedroom);
//     }

//     if (query.minPrice || query.maxPrice) {
//       where.price = {
//         gte: parseInt(query.minPrice) || 0,
//         lte: parseInt(query.maxPrice) || 10000000,
//       };
//     }

//     const posts = await prisma.post.findMany({
//       where: Object.keys(where).length !== 0 ? where : undefined,
//     });

//     res.status(200).json(posts);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "server error:failed to get Posts" });
//   }
// };

export const getPost = async (req, res) => {
  const id = req.params.id;
  //   console.log(id);
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            userName: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res
            .status(200)
            .json({ ...post, isSaved: saved ? true : false });
        }
        // Handle error here if necessary
        // res.status(403).json({ message: 'Unauthorized' });
      });
    } else {
      res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,

        postDetail: { create: body.postDetail },
      },
    });
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error:failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(200).json({ message: "post found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error:failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete associated SavedPost entries
    await prisma.savedPost.deleteMany({ where: { postId: id } });

    // Check if there's a PostDetail associated with the post
    const postDetail = await prisma.postDetail.findUnique({
      where: { postId: id },
    });

    // If there's a PostDetail, delete it
    if (postDetail) {
      await prisma.postDetail.delete({ where: { postId: id } });
    }

    // Delete the post itself
    await prisma.post.delete({ where: { id } });

    res
      .status(200)
      .json({ message: "Post and associated data deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error: Failed to delete post and associated data",
    });
  }
};

export const getUserPosts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userPosts = await prisma.post.findMany({
      where: { userId },
      include: {
        postDetail: true,
        user: {
          select: {
            userName: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json(userPosts);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error: Failed to get user posts" });
  }
};

export const savePost = async (req, res) => {
  const { postId, userId, isSaved } = req.body;
  //   const userId = req.params.userId;
  console.log(userId);

  try {
    // Check if the post is already saved by the user
    const existingSavedPost = await prisma.savedPost.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (isSaved && !existingSavedPost) {
      // Save the post if it's not already saved
      await prisma.savedPost.create({
        data: { postId, userId },
      });
    } else if (!isSaved && existingSavedPost) {
      // Unsave the post if it's already saved
      await prisma.savedPost.delete({
        where: { id: existingSavedPost.id },
      });
    }

    res.status(200).json({ message: "Post saved/unsaved successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error: Failed to save post" });
  }
};
