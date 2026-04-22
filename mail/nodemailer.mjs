import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

let notificationMsgText = ``;

const today = new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });

const addTextToNotificationMsg = async string => {
  notificationMsgText += string;
  notificationMsgText += "\n\n"
};

// 1. SMTPトランスポーターの設定
const transporter = nodemailer.createTransport({
  host: process.env.AWS_SES_HOST, // リージョンに合わせて変更
  port: process.env.AWS_SES_PORT,
  secure: false, // STARTTLSを使用
  auth: {
    user: process.env.AWS_SES_SMTP_USER, // SESで取得したユーザー名
    pass: process.env.AWS_SES_SMTP_USER_PASSWORD // SESで取得したパスワード
  }
});

// 2. メール送信
const sendEmail = async _ => {
  let info = await transporter.sendMail({
    from: `"Nikkei225 App Alexandre PA" <${process.env.AWS_SES_VERIFIED_ID}>`,
    to: "alexandreassano@me.com",
    subject: `Update Notification ${today}`,
    text: notificationMsgText
  });
  console.log("Message sent: %s", info.messageId);
}

export {
  addTextToNotificationMsg,
  sendEmail 
};