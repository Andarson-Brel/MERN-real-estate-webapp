import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
export const getUser = async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error:failed to get user" });
  }
};

export const upDateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId)
    return res.status(403).json({ message: "You are Not Authorzized" });

  let updatedPassword = null;

  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });
    const { password: userPassword, ...rest } = updatedUser;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error:failed to update user" });
  }
};
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId)
    return res.status(403).json({ message: "Not Authorzized" });

  try {
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "User Updated Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error:failed to delete user" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;
  console.log(tokenUserId);
  try {
    const existingSavedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (existingSavedPost) {
      await prisma.savedPost.delete({
        where: {
          id: existingSavedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to save post!" });
  }
};
export const getSavedPosts = async (req, res) => {
  const tokenUserId = req.userId; // Retrieve user ID from the token
  // console.log(tokenUserId);

  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: tokenUserId, // Filter saved posts by user ID
      },
      include: {
        post: {
          include: {
            postDetail: true,
            user: {
              select: {
                userName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(savedPosts);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Server error: Failed to get saved posts" });
  }
};
