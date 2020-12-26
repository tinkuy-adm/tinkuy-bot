import {S3} from "aws-sdk"
import * as provider from '../util/provider';

const s3 = new S3({region: 'us-east-1'});

export async function sendInfo(chatId){
  // let infoResponse = await s3.getObject({Bucket: 'tinkuy-bot-general', Key:'assets/info.txt'}).promise()
  let text = ""

  text += "Información médica 🚑\n\n"
  text += "Si tú o alguien cerca de ti necesita atención médica, contacta a la Brigada Médica. Se encuentran en puntos estratégicos, pero se pueden acercar a ti en casos de emergencia: Acércate a ellos o envía un DM por IG a @brigadamedicalima\n"
  
  text += "\n\nInformación útil por si te detienen ⚖️\n\n"
  text += "1. No estás obligado a declarar\n"
  text += "2. Tienes derecho a ser asistido por un abogado/a de tu libre elección\n"
  text += "3. No firmes actas sin haberlas leído. Si no estás conforme con lo escrito puedes negarte a firmar.\n"
  text += "4. Si eres maltratado, infórmalo y que sea consignado en el acta y en tu declaración.\n"
  text += "5. Al declarar, un fiscal debe estar presente de inicio a fin. Si no está, puedes exigir su presencia junto a tu abogado defensor.\n"
  text += "6. Tu detención debe ser comunicada a tus familiares.\n"
  text += "7. Si tienes testigos, pide que se tome su declaración. Menciónalo en tu declaración y pide que sean llamados a declarar.\n"
  text += "8. Tu abogado puede presentar escritos, incluso redactados a mano.\n"
  text += "9. Trata de identificar a los policías que te intervienen. Pide sus nombres y si se niegan, dilo en tu declaracion.\n"
  text += "10. Sin tu autorizacion o sin orden judicial, no pueden revisar tus conversaciones (celular).\n"
  text += "11. Denuncia cualquier acto de corrupción.\n"
  text += "12. Desde su inicio, pide el nombre del fiscal que está a cargo o el número de la fiscalía. Tu abogado puede llamar a la fiscalía pues la policía debe informar tu detención.\n"
  text += "13. Tienes derecho a ser examinado por medicos legistas. Informa todo: Si te han golpeado, menciónalo .\n"
  text += "14. Es importante acreditar que tu libertar no es un riesgo. Tu familia puede presentar copias simples de:\n"
  text += "- Recibos de agua, luz o telefono del lugar donde vives\n"
  text += "- Documentos que acrediten que trabajas o estudias\n"
  text += "15. Si lo necesitas, existen más de 30 abogadas y egresadas de Derecho de la PUCP que brindan servicios gratuitos de asesoría legal ante denuncias por detenciones arbitrarias. Manda un DM por IG a @analuciapuenter y cuéntale tu caso. Ellas están en diversas comisarías de Lima brindando atención legal.\n"
    
  text += '\n\nComo identificar un terna 👀\n\n'
  text += "1. Si de la nada un x te habla y te dice para romper cosas, pintar, tirar piedra: Es terna\n"
  text += "2. Si amablemente un x te dice para cerrarte la mochila porque 'se te abrió': Terna sembrador. Cuiden sus mochilas, canguros y bolsillos.\n"
  text += "3. Si un x te empieza a decir para atacar a policias o te empieza a hablar mal de ellos solo para jalarte la lengua: Es terna.\n"
  text += "4. Si vas a manifestarte, no hables con nadie que no conozcas, ellos empiezan a gritar y romper cosas, es terna.\n"
  text += "5. Por lo general no tienen aretes, usan el pelo bien corto, no tienen bigotes ni barba.\n"
  text += "6. Mujeres terna: Llevan gorra, cangura y van con audífonos hands free en todo momento.\n"
  text += "7. Si ves que alguien se te pega mucho, te hace muchas preguntas y sospechas que es un terna, alejate por favor.\n"
  text += "8. Si ves a alguien sospechoso acercate a un grupo grande, en las marchas todos somo amigos, menos los policías.\n"
  text += "9. Si los ternas te detienen, como civiles, tienes derecho a defenderte. La resistencia a la autoridad solo viene cuando el policía esta identificado.\n"
  text += "Último consejo: Los ternas por lo general van vestidos con ropa de color 'normal'. Si puedes, ve a manifestarte vestido de negro para diferenciarte.\n"

  const request = { text: text, chat_id: chatId }
  console.log(process.env.BASE_URL)
  return await provider.api.post(process.env.BASE_URL, request);
}