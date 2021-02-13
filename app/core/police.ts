import { DateTime } from "luxon";
import { DynamoDB } from 'aws-sdk';
import dynDb from '../common/dynamo'

export async function informPolicePresence(chatId) {
  const usr_tlg = "BOT#" + chatId.toString()
  const params: DynamoDB.DocumentClient.GetItemInput = {
    Key: {
      "usr_tlg": usr_tlg
    },
    TableName: process.env.TABLE_TINKUY_COORDS
  }

  try {
    const result = await dynDb.get(params).promise();
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

    await dynDb.put(insert_params).promise();

    return { text: "Ubicación de policia actualizada. Gracias por colaborar!\n" }
  }
  catch (Error) {
    console.log(Error);
    return { text: "Envíame tu ubicación para poder saber dónde esta la policia y vuelve a usar el comando /poli.\n" }
  }
}


