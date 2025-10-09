import { ICreateAccount, IResetPassword } from '../interfaces/emailTemplate'

const createAccount = (values: ICreateAccount) => {
  console.log(values, 'values')
  const data = {
    to: values.email,
    subject: `Verify your account, ${values.name}`,
    html: `
<body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0"
             style="max-width:640px; margin:40px auto; background-color:#ffffff; border-radius:14px;
                    overflow:hidden; box-shadow:0 5px 25px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td align="center" style="background-color:#f1f8f4; padding:35px 20px; border-top:1px solid #e6f4ea;">
            <img src="https://i.ibb.co.com/mCpCVJP4/LOGO-C.png" alt="Go.Roqit"
                 style="width:210px; height:auto; filter:drop-shadow(0 0 6px rgba(0,0,0,0.3));">
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:45px;">
            <h1 style="color:#1b4332; font-size:26px; font-weight:700; margin-bottom:15px; text-align:center;">
              Verify Your Email 🚀
            </h1>

            <p style="color:#3a5a40; font-size:16px; line-height:1.6; margin-bottom:25px; text-align:center;">
              Hey <strong>${values.name}</strong>, welcome aboard! 🎉<br>
              Please verify your email to activate your account.
            </p>

            <!-- OTP Box -->
            <div style="background:linear-gradient(145deg,#d8f3dc,#b7e4c7); border:2px solid #52b788; 
                        border-radius:12px; padding:25px 0; text-align:center; margin:30px auto; max-width:300px;">
              <span style="font-size:40px; font-weight:700; color:#1b4332; letter-spacing:6px;">
                ${values.otp}
              </span>
            </div>

            <p style="color:#3a5a40; font-size:15px; line-height:1.6; text-align:center;">
              This code will expire in <strong>5 minutes</strong>.<br>
              If you didn’t request this, you can safely ignore it.
            </p>

            <!-- Tip -->
            <div style="margin-top:35px; background-color:#fff8e1; border-left:6px solid #ffd54f; 
                        border-radius:8px; padding:15px 18px;">
              <p style="margin:0; color:#4a4a4a; font-size:14px;">
                🔒 For security reasons, never share this code with anyone.
              </p>
            </div>

            <!-- Button -->
            <div style="text-align:center; margin-top:45px;">
              <a href="https://goroqit.com/otp-verify" 
                 style="background-color:#2d6a4f; color:#ffffff; padding:14px 32px; font-size:16px; 
                        font-weight:600; border-radius:10px; text-decoration:none; display:inline-block; 
                        box-shadow:0 4px 12px rgba(45,106,79,0.3); transition:all 0.3s;">
                Open Go.Roqit 🚀
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="background-color:#f1f8f4; padding:25px 20px; border-top:1px solid #e6f4ea;">
            <p style="margin:0; color:#52796f; font-size:13px;">
              © ${new Date().getFullYear()} <strong>Go.Roqit</strong>. All rights reserved.
            </p>
            <p style="margin:6px 0 0; color:#3a5a40; font-size:13px;">
              Powered by <strong style="color:#1b4332;">Go.Roqit API</strong> 🚀
            </p>
          </td>
        </tr>

      </table>
    </body>
    `,
  }
  return data
}

const resetPassword = (values: IResetPassword) => {
  console.log(values, 'values')
  const data = {
    to: values.email,
    subject: `Reset your password, ${values.name}`,
    html: `
    <body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0"
             style="max-width:640px; margin:40px auto; background-color:#ffffff; border-radius:14px;
                    overflow:hidden; box-shadow:0 5px 25px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td align="center" style="background-color:#f1f8f4; padding:35px 20px; border-top:1px solid #e6f4ea;">
            <img src="https://i.ibb.co.com/mCpCVJP4/LOGO-C.png" alt="Go.Roqit"
                 style="width:210px; height:auto; filter:drop-shadow(0 0 6px rgba(0,0,0,0.3));">
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:45px;">
            <h1 style="color:#1b4332; font-size:26px; font-weight:700; margin-bottom:15px; text-align:center;">
              Password Reset Request 🔐
            </h1>

            <p style="color:#3a5a40; font-size:16px; line-height:1.6; margin-bottom:25px; text-align:center;">
              Hi <strong>${values.name}</strong>, 👋<br>
              We received a request to reset your password for your <strong>Go.Roqit</strong> account.<br>
              Use the verification code below to complete the process:
            </p>

            <!-- OTP Box -->
            <div style="background:linear-gradient(145deg,#d8f3dc,#b7e4c7); border:2px solid #52b788;
                        border-radius:12px; padding:25px 0; text-align:center; margin:30px auto; max-width:300px;">
              <span style="font-size:40px; font-weight:700; color:#1b4332; letter-spacing:6px;">
                ${values.otp}
              </span>
            </div>

            <p style="color:#3a5a40; font-size:15px; line-height:1.6; text-align:center;">
              This code is valid for <strong>5 minutes</strong>.<br>
              If you didn’t request this, please ignore this email — your account is safe and unchanged.
            </p>

            <!-- Tip -->
            <div style="margin-top:35px; background-color:#fff8e1; border-left:6px solid #ffd54f;
                        border-radius:8px; padding:15px 18px;">
              <p style="margin:0; color:#4a4a4a; font-size:14px;">
                ⚠️ <strong>Security Tip:</strong> Never share your reset code or link with anyone. Go.Roqit will never ask for it.
              </p>
            </div>

            <!-- Button -->
            <div style="text-align:center; margin-top:45px;">
              <a href="https://goroqit.com/otp-verify" target="_blank"
                 style="background-color:#2d6a4f; color:#ffffff; padding:14px 32px; font-size:16px;
                        font-weight:600; border-radius:10px; text-decoration:none; display:inline-block;
                        box-shadow:0 4px 12px rgba(45,106,79,0.3); transition:all 0.3s;">
                🔑 Reset Password
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="background-color:#f1f8f4; padding:25px 20px; border-top:1px solid #e6f4ea;">
            <p style="margin:0; color:#52796f; font-size:13px;">
              © ${new Date().getFullYear()} <strong>Go.Roqit</strong>. All rights reserved.
            </p>
            <p style="margin:6px 0 0; color:#3a5a40; font-size:13px;">
              Powered by <strong style="color:#1b4332;">Go.Roqit API</strong> 🚀
            </p>
          </td>
        </tr>

      </table>
    </body>
    `,
  }

  return data
}

const resendOtp = (values: {
  email: string
  name: string
  otp: string
  type: 'resetPassword' | 'createAccount'
}) => {
  console.log(values, 'values')
  const isReset = values.type === 'resetPassword'

  const data = {
    to: values.email,
    subject: `${isReset ? 'Password Reset' : 'Account Verification'} - New Code`,
    html: `
   <body style="margin:0; padding:0;  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; margin:40px auto; background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 5px 25px rgba(0,0,0,0.08);">

    <!-- Header -->
    <tr>
      <td align="center" style="background-color:#f1f8f4; padding:35px 20px; border-top:1px solid #e6f4ea;">
        <img src="https://i.ibb.co.com/mCpCVJP4/LOGO-C.png" alt="Go.Roqit"
             style="width:210px; height:auto; filter:drop-shadow(0 0 6px rgba(0,0,0,0.3));">
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:45px;">
        <h1 style="color:#1b4332; font-size:26px; font-weight:700; margin-bottom:15px; text-align:center;">
          ${isReset ? 'Reset Your Password 🔐' : 'Verify Your Account 🚀'}
        </h1>

        <p style="color:#3a5a40; font-size:16px; line-height:1.6; margin-bottom:25px; text-align:center;">
          Hi <strong>${values.name}</strong>, 👋<br>
          ${
            isReset
              ? 'You recently requested to reset your password for your Go.Roqit account.'
              : 'Thanks for joining <strong>Go.Roqit</strong> — we’re thrilled to have you onboard!'
          }<br>
          Please use the code below to complete the process:
        </p>

        <!-- OTP Box -->
        <div style="background:linear-gradient(145deg,#d8f3dc,#b7e4c7); border:2px solid #52b788; border-radius:12px; padding:25px 0; text-align:center; margin:30px auto; max-width:300px;">
          <span style="font-size:40px; font-weight:700; color:#1b4332; letter-spacing:6px;">
            ${values.otp}
          </span>
        </div>

        <p style="color:#3a5a40; font-size:15px; line-height:1.6; text-align:center;">
          This code will expire in <strong>5 minutes</strong>.<br>
          If you didn’t request this, just ignore this email — your account is safe.
        </p>

        <!-- Tip -->
        <div style="margin-top:35px; background-color:#fff8e1; border-left:6px solid #ffd54f; border-radius:8px; padding:15px 18px;">
          <p style="margin:0; color:#4a4a4a; font-size:14px;">
            🔒 <strong>Security Tip:</strong> Keep your OTP confidential. Go.Roqit will never ask for it.
          </p>
        </div>

        <!-- Button -->
        <div style="text-align:center; margin-top:45px;">
          <a href="https://goroqit.com/otp-verify" 
             style="background-color:#2d6a4f; color:#ffffff; padding:14px 32px; font-size:16px; font-weight:600; border-radius:10px; text-decoration:none; display:inline-block; box-shadow:0 4px 12px rgba(45,106,79,0.3); transition:all 0.3s;">
            ${isReset ? 'Reset Password' : 'Open Go.Roqit 🚀'}
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="background-color:#f1f8f4; padding:25px 20px; border-top:1px solid #e6f4ea;">
        <p style="margin:0; color:#52796f; font-size:13px;">
          © ${new Date().getFullYear()} <strong>Go.Roqit</strong>. All rights reserved.
        </p>
        <p style="margin:6px 0 0; color:#3a5a40; font-size:13px;">
          Powered by <strong style="color:#1b4332;">Go.Roqit API</strong> 🚀
        </p>
      </td>
    </tr>

  </table>
</body>

    `,
  }

  return data
}

export const emailTemplate = {
  createAccount,
  resetPassword,
  resendOtp,
}
