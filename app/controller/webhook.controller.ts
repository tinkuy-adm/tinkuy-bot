import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import * as webhookService from '../service/webhook.service';
import { MessageUtil } from '../util/message';
import * as provider from '../util/provider';

export class WebhookController {

  async handleMessage(event: APIGatewayProxyEvent, context?: Context): Promise<any> {
    console.log('functionName', context.functionName);
    try {
      const result = await webhookService.response(event)
      return MessageUtil.success(result)
    } catch (err) {
      console.log(err)
    }
  }

  async registerAPI(event: any, context?: Context): Promise<any> {
    console.log(event)
    console.log(context)
    let urlAPIGateway = event.url
    let setWebhookUrl = `${process.env.SET_WEBHOOK}?url=${urlAPIGateway}`
    let response = await provider.api.post(setWebhookUrl, {})
    console.log(response)
    return {
      statusCode: 200,
      body: JSON.stringify({})
    }
  }
  
}