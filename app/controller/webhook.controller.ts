import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { telegramBot } from '../common/telegram'
import * as webhookService from '../service/webhook.service'

export class WebhookController {

  async handleMessage(event: APIGatewayProxyEvent, context?: Context): Promise<APIGatewayProxyResult> {
    const eventBody = JSON.parse(event.body)
    let lambdaResponse: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify(null)
    }
    try {
      const webhookResponse = await webhookService.response(event)
      lambdaResponse.body = JSON.stringify(webhookResponse)
    } 
    catch (err) {
      console.log(err)
      lambdaResponse.statusCode = 500
      lambdaResponse.body = JSON.stringify(err)
      telegramBot.sendMessage(eventBody.userMessage.chat.id, "Ups, ocurrió un error")
    }
    finally {
      console.log(`Webhook response: ${lambdaResponse}`)
      return lambdaResponse
    }
  }

  async registerAPI(event: any, context?: Context): Promise<any> {
    const botWebhookUrl =  process.env.API_INVOKE_ID
    const botEnvironment = process.env.stage
    let urlAPIGateway = `https://${botWebhookUrl}.execute-api.us-east-1.amazonaws.com/${botEnvironment}/webhook`
    let response = await telegramBot.setWebHook(urlAPIGateway)
    console.log(`Register bot response: ${response}`)
    return {
      statusCode: 200,
      body: JSON.stringify({message: 'Bot registrado'})
    }
  }
  
}

