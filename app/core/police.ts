import { DateTime } from "luxon";
import { DynamoDB } from 'aws-sdk';
import * as provider from '../util/provider';

export async function informPolicePresence(chatId, dynamoDb) {
  const usr_tlg = "BOT#" + chatId.toString()
  const params = {
    Key: {
      "usr_tlg": usr_tlg
    },
    TableName: process.env.TABLE_TINKUY_COORDS
  };
  try {
    const result = await dynamoDb.get(params).promise();
    const item = result.Item;
    const lat = item.latitud.toString()
    const long = item.longitud.toString();

    let now = DateTime.local()
    let timestamp = Math.floor(now.toSeconds())
    const usr_tlg = "BOT#" + chatId.toString() + '-' + timestamp.toString()
    const insert_params: DynamoDB.DocumentClient.PutItemInput = {
      Item: {
        usr_tlg: usr_tlg,
        latitud: lat,
        longitud: long,
        tstamp: timestamp
      },
      TableName: process.env.TABLE_POLICE_COORDS
    };

    await dynamoDb.put(insert_params).promise();

    let text = "Ubicación de policia actualizada. Gracias por colaborar!\n";
    const request = { text: text, chat_id: chatId }
    console.log(process.env.BASE_URL)
    const { data } = await provider.api.post(process.env.BASE_URL, request);
    return data;
  }
  catch (Error) {
    console.log(Error);
    let text = "Envíame tu ubicación para poder saber dónde esta la policia y vuelve a usar el comando /poli.\n";
    const request = { text: text, chat_id: chatId }
    console.log(process.env.BASE_URL)
    const { data } = await provider.api.post(process.env.BASE_URL, request);
    return data;
  }
}


