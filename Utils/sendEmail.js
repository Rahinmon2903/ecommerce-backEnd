import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, content, isHtml = false) => {
  await tranEmailApi.sendTransacEmail({
    sender: {
      email: "no-reply@yourapp.com",
      name: "E-Commerce",
    },
    to: [{ email: to }],
    subject,
    ...(isHtml
      ? { htmlContent: content }
      : { textContent: content }),
  });
};

export default sendEmail;
