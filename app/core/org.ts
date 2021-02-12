import { DynamoDB } from 'aws-sdk';
import { dynamoDbInstance } from '../common/db'

export async function registerWithOrg(chatId: Number, registerInfo: String,
  timestamp: Number) {

  const regArray = registerInfo.split(" ");
  const organizationName = regArray[0].toLowerCase();
  const numberId = regArray[1];
  const userName = regArray.slice(2).join(" ");
  const usrTlg = `BOT#${chatId}`;
  const params_put: DynamoDB.DocumentClient.PutItemInput = {
    Item: {
      usr_tlg: usrTlg,
      tstamp: timestamp,
      group_usr: numberId,
      name: userName,
      group: organizationName
    },
    TableName: process.env.TABLE_TINKUY_COORDS
  };
  await dynamoDbInstance.put(params_put).promise();
  const responseText = `Te has registrado con ${organizationName}. En caso te hayas equivocado al colocar tus datos, puedes volver a ingresarlos.`;
  return { text: responseText }
}