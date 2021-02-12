
import { DateTime } from "luxon";

import { telegramBot } from '../common/telegram'
import { handleStart } from '../core/start';
import { registerUserLocation } from '../core/location';
import { informPolicePresence } from '../core/police';
import { informStatus } from '../core/status';
import { processTinkuyCall } from '../core/tinkuy';
import { sendInfo } from '../core/info';
import { registerWithOrg } from '../core/org'

export const response = async (event: any) => {
  const body = JSON.parse(event.body)
  const userMessage = body.hasOwnProperty("userMessage") ? body.userMessage : body.edited_userMessage
  const chatId = userMessage.chat.id
  const now = DateTime.local()
  const timestamp = Math.floor(now.toSeconds())
  let text = ""
  let webhookResponse = {}

  if (userMessage.text == '/start') {
    let text = handleStart();
    let tlgApiResponse = await telegramBot.sendMessage(chatId, text)
    webhookResponse = {
      telegramApiResponse: tlgApiResponse
    }
  }

  else if (userMessage.text == '/info') {
    let text = sendInfo()
    let tlgApiResponse = await telegramBot.sendMessage(chatId, text)
    webhookResponse = {
      telegramApiResponse: tlgApiResponse
    }
  }

  else if (userMessage.hasOwnProperty("location")) {
    webhookResponse = await registerUserLocation(chatId, userMessage, timestamp)
  }

  else if (userMessage.text == '/tinkuy') {
    let result = await processTinkuyCall(chatId);
    let tlgApiResponse = {}
    if (result.hasOwnProperty('latitude')) {
      tlgApiResponse = await telegramBot.sendLocation(chatId, result.latitude, result.longitude)
    } 
    else if (result.hasOwnProperty('text')) {
      tlgApiResponse = await telegramBot.sendMessage(chatId, result.text)
    }
    webhookResponse = {
      telegramApiResponse: tlgApiResponse
    }
  }

  else if (userMessage.text == '/poli') {
    let result = await informPolicePresence(chatId);
    let tlgApiResponse = await telegramBot.sendMessage(chatId, result.text)
    webhookResponse = {
      telegramApiResponse: tlgApiResponse
    }
  }

  else if (userMessage.text == '/detencion') {
    let result = await informStatus(chatId, 'detencion');
    let tlgApiResponse = telegramBot.sendMessage(chatId, result.text)
    webhookResponse = {
      telegramApiResponse: tlgApiResponse
    }
  }

  else if (userMessage.text == '/sos') {
    let result = await informStatus(chatId, 'sos');
    let tlgApiResponse = telegramBot.sendMessage(chatId, result.text)
    webhookResponse = {
      telegramApiResponse: tlgApiResponse
    }
  }

  else if (userMessage.text.substring(0, 4) == '/org') {
    const registerInfo = userMessage.text.substring(4, userMessage.text.length).trim()
    let result = await registerWithOrg(chatId, registerInfo, timestamp);
    let tlgApiResponse = telegramBot.sendMessage(chatId, result.text)
    webhookResponse = {
      telegramApiResponse: tlgApiResponse
    }
  }

  else {
    text = "No te entendi";
    let tlgApiResponse = await telegramBot.sendMessage(chatId, text)
    webhookResponse = {
      telegramApiResponse: tlgApiResponse
    }
  }
  return webhookResponse
};