const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000,
});


const send = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"TaskFlow" <${process.env.SMTP_FROM_ADDRESS}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email send failed to ${to}:`, error.message);
    throw error;
  }
};

// ── Base template wrapper ─────────────────────────────────────────────────────
const wrap = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0d0f14; color: #e8eaf0; }
    .container { max-width: 580px; margin: 40px auto; background: #161920; border: 1px solid #2a2f45; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #6c63ff, #8b85ff); padding: 32px; text-align: center; }
    .logo { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
    .logo span { opacity: 0.7; }
    .body { padding: 32px; }
    h2 { font-size: 22px; font-weight: 700; margin-bottom: 12px; }
    p { color: #9ca3af; line-height: 1.6; margin-bottom: 16px; font-size: 15px; }
    .highlight { color: #e8eaf0; }
    .btn { display: inline-block; background: #6c63ff; color: #fff !important; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 8px 0; }
    .card { background: #1e2130; border: 1px solid #2a2f45; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2a2f45; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .row .label { color: #7c82a0; }
    .row .value { color: #e8eaf0; font-weight: 600; }
    .badge { display: inline-block; background: rgba(108,99,255,0.2); color: #8b85ff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
    .task-item { background: #1e2130; border: 1px solid #2a2f45; border-radius: 10px; padding: 14px 16px; margin: 8px 0; }
    .task-title { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
    .task-meta { font-size: 12px; color: #7c82a0; }
    .urgent { border-left: 3px solid #ef4444; }
    .warning { border-left: 3px solid #f59e0b; }
    .footer { padding: 24px 32px; border-top: 1px solid #2a2f45; text-align: center; }
    .footer p { font-size: 12px; color: #4b5563; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">✦ TaskFlow</div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} TaskFlow · You're receiving this because you have an account with us.</p>
    </div>
  </div>
</body>
</html>`;

// ── Email: Purchase Receipt ───────────────────────────────────────────────────
const sendPurchaseReceipt = async ({ user, payment }) => {
  const planLabel = payment.plan === 'yearly' ? 'Yearly Plan' : 'Monthly Plan';
  const expiry = payment.plan === 'yearly'
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const html = wrap(`
    <h2>🎉 Welcome to Premium, ${user.name}!</h2>
    <p>Your payment was successful. Here's your receipt:</p>

    <div class="card">
      <div class="row"><span class="label">Plan</span><span class="value">${planLabel} <span class="badge">Premium</span></span></div>
      <div class="row"><span class="label">Amount Paid</span><span class="value">NPR ${payment.amountNPR}</span></div>
      <div class="row"><span class="label">Transaction ID</span><span class="value">${payment.transactionId || payment.pidx}</span></div>
      <div class="row"><span class="label">Payment Method</span><span class="value">Khalti</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
      <div class="row"><span class="label">Valid Until</span><span class="value">${expiry.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
    </div>

    <h2 style="margin-top:24px">✨ What you unlocked</h2>
    <div class="card">
      <div class="row"><span class="label">📧 Email Reminders</span><span class="value" style="color:#22c55e">✓ Active</span></div>
      <div class="row"><span class="label">⏰ Due Date Alerts</span><span class="value" style="color:#22c55e">✓ Active</span></div>
      <div class="row"><span class="label">📊 Priority Notifications</span><span class="value" style="color:#22c55e">✓ Active</span></div>
    </div>

    <a href="${process.env.CLIENT_URL}" class="btn">Go to Dashboard →</a>
  `);

  await send({ to: user.email, subject: '🎉 TaskFlow Premium — Payment Receipt', html });
};

// ── Email: Task Due Reminder ──────────────────────────────────────────────────
const sendTaskReminder = async ({ user, tasks }) => {
  const overdueList = tasks.filter(t => new Date(t.dueDate) < new Date());
  const dueSoonList = tasks.filter(t => new Date(t.dueDate) >= new Date());

  const renderTask = (task) => {
    const isOverdue = new Date(task.dueDate) < new Date();
    const dueStr = new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const priorityEmoji = { high: '🔴', medium: '🟡', low: '🟢' }[task.priority];
    return `
      <div class="task-item ${isOverdue ? 'urgent' : 'warning'}">
        <div class="task-title">${priorityEmoji} ${task.title}</div>
        <div class="task-meta">Due: ${dueStr} · Priority: ${task.priority} · Status: ${task.status}</div>
      </div>`;
  };

  const html = wrap(`
    <h2>⏰ Task Reminder</h2>
    <p>Hi <span class="highlight">${user.name}</span>, here's a heads-up on your pending tasks:</p>

    ${overdueList.length > 0 ? `
      <h3 style="color:#ef4444;margin:20px 0 8px;font-size:16px">🚨 Overdue (${overdueList.length})</h3>
      ${overdueList.map(renderTask).join('')}
    ` : ''}

    ${dueSoonList.length > 0 ? `
      <h3 style="color:#f59e0b;margin:20px 0 8px;font-size:16px">⚠️ Due Soon (${dueSoonList.length})</h3>
      ${dueSoonList.map(renderTask).join('')}
    ` : ''}

    <a href="${process.env.CLIENT_URL}" class="btn" style="margin-top:24px">View All Tasks →</a>
    <p style="margin-top:16px;font-size:13px">You're receiving this because you have TaskFlow Premium. 
    You can update reminder settings in your account.</p>
  `);

  await send({
    to: user.email,
    subject: `⏰ You have ${tasks.length} task${tasks.length > 1 ? 's' : ''} that need attention`,
    html,
  });
};

// ── Email: Welcome ────────────────────────────────────────────────────────────
const sendWelcomeEmail = async ({ user }) => {
  const html = wrap(`
    <h2>Welcome to TaskFlow, ${user.name}! 👋</h2>
    <p>Your account has been created. Start organizing your tasks and boost your productivity.</p>
    <div class="card">
      <div class="row"><span class="label">Account</span><span class="value">${user.email}</span></div>
      <div class="row"><span class="label">Plan</span><span class="value">Free</span></div>
    </div>
    <p>Upgrade to <strong style="color:#8b85ff">Premium</strong> to unlock email reminders and due-date notifications.</p>
    <a href="${process.env.CLIENT_URL}" class="btn">Get Started →</a>
  `);

  await send({ to: user.email, subject: '👋 Welcome to TaskFlow!', html });
};

module.exports = { sendPurchaseReceipt, sendTaskReminder, sendWelcomeEmail };
