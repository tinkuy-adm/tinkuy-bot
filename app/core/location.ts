import { DynamoDB } from 'aws-sdk'
import dynDb from "../common/dynamo";

export async function registerUserLocation(
  chatId: Number,
  message,
  timestamp: Number
): Promise<any> {
  const lat = message.location.latitude.toString();
  const long = message.location.longitude.toString();
  const userKey = "BOT#" + chatId.toString();
  await updateLocation(userKey, lat, long, timestamp);
  await addToLocationHistory(userKey, lat, long, timestamp);
  return {
    message: "Ubicacion registrada y actualizada",
  };
}

async function updateLocation(
  userKey: String,
  lat: String,
  long: String,
  timestamp: Number
): Promise<any> {
  try {
    const params_update: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.TABLE_TINKUY_COORDS,
      Key: {
        usr_tlg: userKey,
      },
      UpdateExpression: "set latitud = :x, longitud = :y, tstamp = :z",
      ExpressionAttributeValues: {
        ":x": lat,
        ":y": long,
        ":z": timestamp,
      },
    };
    await dynDb.update(params_update).promise();
  } catch {
    const params_put: DynamoDB.DocumentClient.PutItemInput = {
      Item: {
        usr_tlg: userKey,
        latitud: lat,
        longitud: long,
        tstamp: timestamp,
      },
      TableName: process.env.TABLE_TINKUY_COORDS,
    };
    await dynDb.put(params_put).promise();
  }
}

async function addToLocationHistory(
  userKey: String,
  lat: String,
  long: String,
  timestamp: Number,
): Promise<any> {
  const params_put: DynamoDB.DocumentClient.PutItemInput = {
    Item: {
      usr_tlg: userKey,
      tstamp: timestamp,
      latitud: lat,
      longitud: long,
    },
    TableName: process.env.TABLE_TINKUY_COORDS_HIST,
  };
  await dynDb.put(params_put).promise();
}
