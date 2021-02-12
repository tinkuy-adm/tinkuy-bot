import { DateTime } from "luxon";
import { DynamoDB } from 'aws-sdk'
import { dynamoDbInstance } from '../common/db'

const reply_message = {
  detencion: {
    noLocation: "Envíame tu ubicación para saber dónde enviar el apoyo legal y vuelve a usar el comando /detencion\n",
    resendLocation: "Han pasado más de 15 minutos desde tu última actualización. Envíame tu ubicación y luego vuelve a escribir /detencion\n",
    successReply: "Si te encuentras en una zona de protesta, estaremos enviando apoyo legal!\n"
  },
  sos: {
    noLocation: "Envíame tu ubicación para saber dónde enviar el apoyo médico y vuelve a usar el comando /sos\n",
    resendLocation: "Han pasado más de 15 minutos desde tu última actualización. Envíame tu ubicación y luego vuelve a escribir /sos\n",
    successReply: "Si te encuentras en una zona de protesta, estaremos enviando apoyo médico!\n"
  }
}

export async function informStatus(chatId, status) {
  const usr_tlg = "BOT#" + chatId.toString()
  const params: DynamoDB.DocumentClient.GetItemInput = {
    Key: {
      "usr_tlg": usr_tlg
    },
    TableName: process.env.TABLE_TINKUY_COORDS
  }

  try {
    const result = await dynamoDbInstance.get(params).promise();
    const item = result.Item;
    const lat = item.latitud.toString()
    const long = item.longitud.toString();
    const lastLocationUpdate = DateTime.fromMillis(item.tstamp * 1000);

    let now = DateTime.local()

    if (now.diff(lastLocationUpdate, 'minutes').toObject().minutes > 15) {
      let textResponse = reply_message[status].resendLocation;
      return { text: textResponse }
    }

    let timestamp = Math.floor(now.toSeconds())
    const usr_tlg = "BOT#" + chatId.toString()
    let text = ''
    try {
      const params_update: DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: process.env.TABLE_TINKUY_COORDS,
        Key: {
          "usr_tlg": usr_tlg
        },
        UpdateExpression: "set latitud = :w, longitud = :x, #status = :y, tstamp = :z",
        ExpressionAttributeNames: {
          "#status": "status"
        },
        ExpressionAttributeValues: {
          ":w": lat,
          ":x": long,
          ":y": status,
          ":z": timestamp
        }
      };
      await dynamoDbInstance.update(params_update).promise();
    }
    catch (Error) {
      const params_put = {
        Item: {
          usr_tlg: usr_tlg,
          latitud: lat,
          longitud: long,
          status: status,
          tstamp: timestamp
        },
        TableName: process.env.TABLE_TINKUY_COORDS
      };

      await dynamoDbInstance.put(params_put).promise();
    }

    text += ' ' + reply_message[status].successReply;

    return { text: text }
  }
  catch (Error) {
    console.log(Error.message);
    let text = reply_message[status].noLocation;
    return { text: text }
  }
}


