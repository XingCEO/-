import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface BookingEmailData {
  name: string;
  email: string;
  phone?: string | null;
  serviceName?: string | null;
  preferredDate?: Date | null;
  message: string;
}

export async function sendBookingNotification(data: BookingEmailData) {
  const { name, email, phone, serviceName, preferredDate, message } = data;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        新預約通知
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">姓名</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="mailto:${email}">${email}</a>
          </td>
        </tr>
        ${phone ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">電話</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="tel:${phone}">${phone}</a>
          </td>
        </tr>
        ` : ''}
        ${serviceName ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">服務項目</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${serviceName}</td>
        </tr>
        ` : ''}
        ${preferredDate ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">偏好日期</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${new Date(preferredDate).toLocaleDateString('zh-TW', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </td>
        </tr>
        ` : ''}
      </table>

      <div style="margin-top: 20px;">
        <h3 style="color: #333; margin-bottom: 10px;">訊息內容</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
          ${message}
        </div>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
        <p>此郵件由系統自動發送，請勿直接回覆。</p>
        <p>收到時間: ${new Date().toLocaleString('zh-TW')}</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.NOTIFICATION_EMAIL || process.env.GMAIL_USER,
    subject: `[新預約] ${name} - ${serviceName || '一般諮詢'}`,
    html: htmlContent,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking notification email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending booking notification email:', error);
    return { success: false, error };
  }
}
