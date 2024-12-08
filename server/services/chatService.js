import Message from '../models/Message.js';
import { logger } from '../utils/logger.js';

export const createMessage = async (messageData) => {
  try {
    const message = await Message.create(messageData);
    await message.populate(['sender', 'recipient']);
    logger.info(`Message sent from ${message.sender} to ${message.recipient}`);
    return message;
  } catch (error) {
    logger.error(`Error creating message: ${error.message}`);
    throw error;
  }
};

export const getMessages = async (userId1, userId2, options = {}) => {
  try {
    const { page = 1, limit = 50 } = options;
    const messages = await Message.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 }
      ]
    })
    .populate(['sender', 'recipient'])
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

    const total = await Message.countDocuments({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 }
      ]
    });

    return {
      messages: messages.reverse(),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Error fetching messages: ${error.message}`);
    throw error;
  }
};

export const markMessagesAsRead = async (senderId, recipientId) => {
  try {
    const result = await Message.updateMany(
      { sender: senderId, recipient: recipientId, read: false },
      { read: true }
    );
    logger.info(`Marked ${result.modifiedCount} messages as read`);
    return result;
  } catch (error) {
    logger.error(`Error marking messages as read: ${error.message}`);
    throw error;
  }
};

export const getUnreadMessageCount = async (userId) => {
  try {
    const count = await Message.countDocuments({
      recipient: userId,
      read: false
    });
    return count;
  } catch (error) {
    logger.error(`Error getting unread message count: ${error.message}`);
    throw error;
  }
};