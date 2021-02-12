import { DynamoDB } from "aws-sdk";
import { dynamoDbInstance } from '../common/db'
import { DateTime } from "luxon";


export async function processTinkuyCall(chatId) {
  const usr_tlg = "BOT#" + chatId.toString()
  const params: DynamoDB.DocumentClient.GetItemInput = {
    Key: {
      "usr_tlg": usr_tlg
    },
    TableName: process.env.TABLE_TINKUY_COORDS
  };

  try {
    const result = await dynamoDbInstance.get(params).promise();
    const item = result.Item;
    const userLatitude = item.latitud.toString()
    const userLongitude = item.longitud.toString();
    const lastLocationUpdateTime = DateTime.fromMillis(item.tstamp * 1000);

    let now = DateTime.local()
    if (now.diff(lastLocationUpdateTime, 'minutes').toObject().minutes > 15) {
      return { text: "Han pasado más de 15 minutos desde tu última actualización. Envíame tu ubicación y luego vuelve a escribir /tinkuy \n" }
    }
    else {
      const nearestCluster = await getCurrentNearestCluster(userLatitude, userLongitude, dynamoDbInstance);
      console.log('Nearest' + nearestCluster.toString())
      return {
        latitude: nearestCluster.latitude,
        longitude: nearestCluster.longitude
      }
    }
  }
  catch (err) {
    console.log(err.message);
    return { text: "Envíame tu ubicación. Luego vuelve a escribir /tinkuy \n" }
  }
}

async function getCurrentNearestCluster(latitud: number, longitud: number, dynamoDbInstance: DocumentClient) {
  let params: DynamoDB.DocumentClient.GetItemInput = {
    Key: {
      "cluster_id": "activo"
    },
    TableName: process.env.TABLE_TINKUY_CLUSTER

  }
  let result = await dynamoDbInstance.get(params).promise();
  let item = result.Item;
  console.log(item);
  let clusters_list = item.points;

  let min_distance = 100000;
  let min_distance_lat = 0;
  let min_distance_long = 0;

  for (let i = 0; i < clusters_list.length; i++) {
    let curr_dist = distance(latitud, longitud, clusters_list[i].values[0], clusters_list[i].values[1], 'K');
    console.log(curr_dist);
    if (curr_dist < min_distance) {
      min_distance = curr_dist;
      min_distance_lat = clusters_list[i].values[0];
      min_distance_long = clusters_list[i].values[1];
    }
  }
  let nearestCluster = { latitude: min_distance_lat, longitude: min_distance_long }

  return nearestCluster;
}

function distance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist;
  }
}


