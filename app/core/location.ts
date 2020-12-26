import { DynamoDB } from 'aws-sdk';

export async function handleLocation(chatId: Number, message, timestamp: Number, 
  dynamoDb:DynamoDB.DocumentClient): Promise<any> {
  const lat = message.location.latitude.toString();
  const long = message.location.longitude.toString();
  const userKey = "BOT#" + chatId.toString();
  await updateLocation(userKey, lat, long, timestamp, dynamoDb);
  await addToLocationHistory(userKey, lat, long, timestamp, dynamoDb);
  return {
    statusCode: 200,
    body: 'Ubicacion actualizada'
  }
}

async function updateLocation(userKey: String, lat: String, long: String,
  timestamp: Number, dynamoDb: DynamoDB.DocumentClient): Promise<any> {
  try {
    const params_update: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.TABLE_TINKUY_COORDS,
      Key: {
        "usr_tlg": userKey
      },
      UpdateExpression: "set latitud = :x, longitud = :y, tstamp = :z",
      ExpressionAttributeValues: {
        ":x": lat,
        ":y": long,
        ":z": timestamp
      }
    };
    await dynamoDb.update(params_update).promise();
  }
  catch {
    const params_put: DynamoDB.DocumentClient.PutItemInput = {
      Item: {
        usr_tlg: userKey,
        latitud: lat,
        longitud: long,
        tstamp: timestamp
      },
      TableName: process.env.TABLE_TINKUY_COORDS
    };
    await dynamoDb.put(params_put).promise();
  }
}

async function addToLocationHistory(userKey: String, lat: String, long: String, 
  timestamp: Number, dynamoDb: DynamoDB.DocumentClient): Promise<any> {

  const params_put: DynamoDB.DocumentClient.PutItemInput = {
    Item: {
      usr_tlg: userKey,
      tstamp: timestamp,
      latitud: lat,
      longitud: long
    },
    TableName: process.env.TABLE_TINKUY_COORDS_HIST
  };
  await dynamoDb.put(params_put).promise();
}


