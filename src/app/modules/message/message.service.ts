import mongoose from 'mongoose'
import { IMessage } from './message.interface'
import { Message } from './message.model'
import { Chat } from '../chat/chat.model'
import { JwtPayload } from 'jsonwebtoken'
import QueryBuilder from '../../builder/QueryBuilder'
import { checkMongooseIDValidation } from '../../../shared/checkMongooseIDValidation'
import unlinkFile from '../../../shared/unlinkFile'

// send message to DB
const sendMessageToDB = async (payload: any): Promise<IMessage> => {
  // save to DB
  const response = await Message.create(payload)
  if (!response) {
    throw new Error('Message not created')
  }

  //@ts-ignore
  const io = global.io
  if (io && payload.chatId) {
    // send message to specific chatId Room
    io.emit(`getMessage::${payload?.chatId}`, response)
  }

  return response
}

// get message from DB
const getMessageFromDB = async (
  id: string,
  user: JwtPayload,
  query: Record<string, any>,
): Promise<{ messages: IMessage[]; pagination: any; participant: any }> => {
  checkMongooseIDValidation(id, 'Chat')
  const isExistChat = await Chat.findById(id)
  if (!isExistChat) {
    throw new Error('Chat not found')
  }
  if (!isExistChat.participants.includes(user.authId)) {
    throw new Error('You are not participant of this chat')
  }

  const result = new QueryBuilder(
    Message.find({ chatId: id }).sort({ createdAt: 1 }),
    query,
  ).paginate()
  const messages = await result.modelQuery.exec()
  const pagination = await result.getPaginationInfo()

  const participant = await Chat.findById(id).populate({
    path: 'participants',
    select: '_id name image',
    match: {
      _id: { $ne: new mongoose.Types.ObjectId(user.id) },
    },
  })

  return { messages, pagination, participant: participant?.participants[0] }
}

// update message
const updateMessage = async (
  id: string,
  user: JwtPayload,
  payload: Partial<IMessage>,
): Promise<IMessage | null> => {
  checkMongooseIDValidation(id, 'Message')
  const isExistMessage = await Message.findById(id)
  if (!isExistMessage) {
    throw new Error('Message not found')
  }
  
  if (isExistMessage.sender.toString() !== user.authId) {
    throw new Error('You are not sender of this message')
  }

  const result = await Message.findByIdAndUpdate(id, payload, { new: true })
  if (!result) {
    throw new Error('Message not updated')
  }

 //@ts-ignore
  const io = global.io
  if (io && result.chatId) {
    // send message to specific chatId Room
    io.emit(`getMessage::${result?.chatId}`, result)
  }

  return result
}

// delete message
const deleteMessage = async (id: string, user: JwtPayload): Promise<string | null> => {
  checkMongooseIDValidation(id, 'Message')
  const isExistMessage = await Message.findById(id)
  if (!isExistMessage) {
    throw new Error('Message not found')
  }
  if (isExistMessage.sender.toString() !== user.authId) {
    throw new Error('You are not sender of this message')
  }
  // unlink file if exist
  if (isExistMessage.image) {
    unlinkFile(isExistMessage.image)
  }
  await Message.findByIdAndDelete(id)
  return "Message Delete Successfully"
}

export const MessageService = {
  sendMessageToDB,
  getMessageFromDB,
  updateMessage,
  deleteMessage,
}
