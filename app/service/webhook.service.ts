import { DynamoDB } from 'aws-sdk';
import { DateTime } from "luxon";

import * as provider from '../util/provider';
import { handleStart } from '../core/start';
import { handleLocation } from '../core/location';
import { informPolicePresence } from '../core/police';
import { informStatus } from '../core/status';
import { handleTinkuy } from '../core/tinkuy';
import { sendInfo } from '../core/info';
import { registerWithOrg } from '../core/org'

export const response = async (event: any) => {

  const body = JSON.parse(event.body)
  let message = body.hasOwnProperty("message") ? body.message : body.edited_message
  const chatId = message.chat.id
  const now = DateTime.local()
  const timestamp = Math.floor(now.toSeconds())
  let text = ""
  const dynamoDb = new DynamoDB.DocumentClient({ region: process.env.SERVERLESS_REGION })
  try {

    if (message.text == '/start') {
      const data = await handleStart(chatId);
      return data;
    }
    else if (message.text == '/info') {
      await sendInfo(chatId)
    }
    else if (message.hasOwnProperty("location")) {
      const response = await handleLocation(chatId, message, timestamp, dynamoDb)
      return response;
    }
    else if (message.text == '/tinkuy') {
      const { data } = await handleTinkuy(chatId, dynamoDb);
      return data;
    }
    else if (message.text == '/poli') {
      const { data } = await informPolicePresence(chatId, dynamoDb);
      return data;
    }
    else if (message.text == '/detencion') {
      const { data } = await informStatus(chatId, dynamoDb, 'detencion');
      return data;
    }
    else if (message.text == '/sos') {
      const { data } = await informStatus(chatId, dynamoDb, 'sos');
      return data;
    }
    else if (message.text.substring(0, 4) == '/org') {
      const registerInfo = message.text.substring(4, message.text.length).trim()
      const { data } = await registerWithOrg(chatId, registerInfo, timestamp, dynamoDb);
      return data;
    }
    else {
      text = "No te entendi";
      const request = { text: text, chat_id: chatId }
      console.log(process.env.BASE_URL)
      const { data } = await provider.api.post(process.env.BASE_URL, request);
      return data;
    }
  }
  catch (err) {
    console.log(err)
    return {
      'statusCode': 500,
      'body': `Internal server error`
    };
  }
};