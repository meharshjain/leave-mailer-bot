# leave-mailer

A simple Node.js utility to send templated email notifications (leave requests, approvals, and welcome emails) using Nodemailer.

## Installation

```bash
npm install leave-mailer
```

## Environment Variables

Set your Gmail credentials:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Usage
```
const { sendEmailNotification, sendWelcomeEmail } = require("leave-mailer");

(async () => {
  await sendWelcomeEmail({
    name: "John Doe",
    email: "john@example.com",
    employeeId: "EMP123",
    role: "Developer"
  });
})();

```
