# Setting Up MAILER_USER and MAILER_PASSWORD Environment Variables for Email Sending

To enable email sending functionality in the backend using nodemailer with Gmail service, you need to set the following environment variables in your backend `.env` file:

```
MAILER_USER=your_email@gmail.com
MAILER_PASSWORD=your_app_password
```

## Steps to Set Up

1. **Use a Gmail Account**

   Use a Gmail account that will be used to send emails from your application.

2. **Generate an App Password**

   For security reasons, Gmail requires you to use an App Password instead of your regular account password if you have 2-Step Verification enabled.

   - Go to your Google Account settings: https://myaccount.google.com/security
   - Under "Signing in to Google," select "App Passwords."
   - You may need to sign in again.
   - Select "Mail" as the app and your device or "Other" and name it (e.g., MedicoApp).
   - Click "Generate."
   - Copy the 16-character app password.

3. **Update `.env` File**

   In your backend project directory, open or create the `.env` file and add:

   ```
   MAILER_USER=your_email@gmail.com
   MAILER_PASSWORD=your_app_password
   ```

   Replace `your_email@gmail.com` with your Gmail address and `your_app_password` with the generated app password.

4. **Restart Backend Server**

   After updating the `.env` file, restart your backend server to load the new environment variables.

## Notes

- Do NOT commit your `.env` file to version control as it contains sensitive information.
- If you do not have 2-Step Verification enabled, you may need to enable it or allow "Less secure app access" in your Google Account settings, but this is not recommended for security reasons.

## Troubleshooting

- If emails are still not sent, check the backend server logs for errors.
- Verify that the environment variables are loaded correctly by adding a console log in your backend code:

  ```js
  console.log('MAILER_USER:', process.env.MAILER_USER);
  console.log('MAILER_PASSWORD:', process.env.MAILER_PASSWORD ? '******' : 'Not Set');
  ```

- Ensure your network or firewall does not block SMTP ports.

---

Following these steps will resolve the SMTP authentication error and enable email sending for OTP verification.
