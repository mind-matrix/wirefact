import AWS from "aws-sdk";
import uniqid from "uniqid";

AWS.config.update({
    region: 'ap-south-1',
    signatureVersion: 'v4'
})

export class MailService {

    static async sendTemplated(recipient: string | string[], template: string, parameters: { [k: string]: any }) {
        const ses = new AWS.SES()
        let result = await ses.sendTemplatedEmail({
            Template: template,
            Source: "no-reply@wirefact.com",
            Destination: {
                ToAddresses: Array.isArray(recipient) ? recipient : [recipient]
            },
            TemplateData: JSON.stringify(parameters)
        }).promise()
        console.log(result.$response)
    }

    static async send(recipient: string | string[], data: { subject: string, html: string, text: string }) {
        const ses = new AWS.SES()
        await ses.sendEmail({
            Source: "no-reply@wirefact.com",
            Destination: {
                ToAddresses: Array.isArray(recipient) ? recipient : [recipient]
            },
            Message: {
                Subject: {
                    Data: data.subject
                },
                Body: {
                    Html: {
                        Data: data.html
                    },
                    Text: {
                        Data: data.text
                    }
                }
            }
        }).promise()
    }

}
