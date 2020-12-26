import { DateTime } from "luxon";
import * as provider from '../util/provider';

export async function handleTinkuy(chatId, dynamoDb) {
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
    const lat_from = item.latitud.toString()
    const long_from = item.longitud.toString();
    const lastLocationUpdate = DateTime.fromMillis(item.tstamp * 1000);

    let now = DateTime.local()
    if (now.diff(lastLocationUpdate, 'minutes').toObject().minutes > 15) {
      let text = "Han pasado más de 15 minutos desde tu última actualización. Envíame tu ubicación y luego vuelve a escribir /tinkuy \n";
      const request = { text: text, chat_id: chatId }
      console.log(process.env.BASE_URL)
      const { data } = await provider.api.post(process.env.BASE_URL, request);
      return data;
    }
    else {
      const nearest = await getNearestCluster(lat_from, long_from, dynamoDb);
      console.log('nearest' + nearest.toString())
      console.log(process.env.LOCATION_URL)
      const request = { latitude: nearest.lat_to, longitude: nearest.long_to, chat_id: chatId }
      const { data } = await provider.api.post(process.env.LOCATION_URL, request);
      return data;
    }
  }
  catch (Error) {
    console.log(Error.message);
    let text = "Envíame tu ubicación. Luego vuelve a escribir /tinkuy \n";
    const request = { text: text, chat_id: chatId }
    console.log(process.env.BASE_URL)
    const { data } = await provider.api.post(process.env.BASE_URL, request);
    return data;
  }
}

async function getNearestCluster(latitud: number, longitud: number, dynamoDb) {

  let currentHour = (new Date().getUTCHours() + 24 - 5) % 24;
  let clusterId = (currentHour < 14) ? "inactivo" : "activo"
  let params = {
    Key: {
      "cluster_id": clusterId
    },
    TableName: process.env.TABLE_TINKUY_CLUSTER

  }
  let result = await dynamoDb.get(params).promise();
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
  result = { lat_to: min_distance_lat, long_to: min_distance_long }
  result = { lat_to: min_distance_lat, long_to: min_distance_long }

  return result;
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


