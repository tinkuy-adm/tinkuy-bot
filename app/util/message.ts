import * as lambda from 'aws-lambda';

export class MessageUtil {
  static success(data: object) : lambda.APIGatewayProxyResult {
   // const result = new Result(StatusCode.success, 0, 'success', data);
    return { statusCode :200 , body : JSON.stringify({input : data})};
  }
  
  static error(err: any) : lambda.APIGatewayProxyResult{
     console.log("error");
     console.log(err.status);
    return {statusCode: err.status , body : JSON.stringify(err.data)};
  }

  static auth(data: object) : lambda.APIGatewayProxyResult{
    // const result = new Result(StatusCode.success, 0, 'success', data);
     return {statusCode:200 , body : JSON.stringify(data)};
   }

   static errorWithStatus(status: number ,err: Error): lambda.APIGatewayProxyResult {
      return {statusCode: status, body : JSON.stringify({msg: err.message})}
   }

}
