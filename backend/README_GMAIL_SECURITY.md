# Gmail Security Settings for Nodemailer Email Sending

To successfully send emails using Nodemailer with Gmail SMTP, you need to configure your Gmail account security settings properly.

## 1. Enable 2-Step Verification

- Go to your Google Account Security page: https://myaccount.google.com/security
- Under "Signing in to Google," enable 2-Step Verification if not already enabled.

## 2. Generate an App Password

- After enabling 2-Step Verification, go to "App Passwords" section: https://myaccount.google.com/apppasswords
- Select "Mail" as the app.
- Select your device or choose "Other" and name it (e.g., MedicoApp).
- Click "Generate."
- Copy the 16-character app password.

## 3. Update Backend .env File

- Open your backend `.env` file.
- Set the following variables:

```
MAILER_USER=your_email@gmail.com
MAILER_PASSWORD=your_app_password
```

Replace `your_email@gmail.com` with your Gmail address and `your_app_password` with the generated app password.

## 4. Restart Backend Server

- Restart your backend server to load the new environment variables.

## 5. Alternative: Allow Less Secure Apps (Not Recommended)

- If you do not want to enable 2-Step Verification, you can allow less secure apps:
  - Visit: https://myaccount.google.com/lesssecureapps
  - Turn on "Allow less secure apps."
- This method is less secure and not recommended.

## 6. Verify Environment Variables Loaded

- Add console logs in your backend code to verify:

```js
console.log('MAILER_USER:', process.env.MAILER_USER);
console.log('MAILER_PASSWORD:', process.env.MAILER_PASSWORD ? '******' : 'Not Set');
```

## 7. Troubleshooting

- Check backend logs for SMTP errors.
- Ensure network/firewall allows SMTP ports.
- Verify credentials are correct.

---

Following these steps will resolve SMTP authentication errors and enable email sending for OTP verification.
