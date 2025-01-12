import { Request, Response } from "express";
const commentSchema = require("../models/comment");
const userSchema = require("../models/user");
const postSchema = require("../models/post");

export const addComment = async (req: Request, res: Response) => {
  const { text, image, idUser,idPost} = req.body;
  const user = await userSchema.findOne({_id:idUser})
  const post = await postSchema.findOne({_id:idPost})
  let comment = await new commentSchema();
  try{
  if ((text.length || image.length) && idUser.length && idPost.length) {
    comment.author = user._id
    comment.avatar = user.image
    comment.name = user.name
    comment.IdPost = post._id
    comment.text = text;
    comment.image = image;
    comment.enabled = true;
    const newComent = await comment.save();
    console.log(newComent)
    post.comments = post.comments.concat(newComent)
    await post.save()
    res.status(200).send("new comment");
  }}catch(e){
    res.status(400).send(e)
  }
};

export const getComment = async (_req: Request, res: Response) => {
  try {
    const comments = await commentSchema.find({});
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      msj: "An error ocurred 😡",
      error,
    });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const commentUpdated = await commentSchema.findOneAndUpdate(
      { _id: id },
      {
        text,
      },
      {
        new: true,
      }
    );

    res.status(200).json(commentUpdated);
  } catch (error) {
    res.status(500).json({
      msj: "An error ocurred 😡",
      error,
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await commentSchema.findByIdAndDelete(id);

    res.status(200).json({
      msg: "comment delete successfully",
    });
  } catch (error) {
    res.status(500).json({
      msj: "An error ocurred 😡",
      error,
    });
  }
};
