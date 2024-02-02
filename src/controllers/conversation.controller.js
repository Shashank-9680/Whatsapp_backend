import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import {
  createConversation,
  doesConversationExist,
  getUserConversations,
  populateConversation,
} from "../services/conversion.service.js";
import { findUser } from "../services/user.service.js";

export const create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user.user_id;
    const { receiver_id } = req.body;
    //check if there is a reciever id or not
    if (!receiver_id) {
      logger.error(
        "please provide the user id if from which you waana start a conversion with"
      );
      throw createHttpError.BadGateway("Oops...Something went wrong !");
    }
    //check if chats exists
    const existed_conversation = await doesConversationExist(
      sender_id,
      receiver_id
    );
    if (existed_conversation) {
      res.json(existed_conversation);
    } else {
      let reciever_user = await findUser(receiver_id);
      let convoData = {
        name: reciever_user.name,
        isGroup: false,
        users: [sender_id, receiver_id],
      };
      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users",
        "-password"
      );
      res.json(populatedConvo);
    }
  } catch {
    error(next);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch {
    error(next);
  }
};
