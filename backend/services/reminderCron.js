const cron = require('node-cron');
const User = require('../models/User');
const Task = require('../models/Task');
const { sendTaskReminder } = require('./emailService');

const startReminderCron = () => {
  // Runs every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('🔔 Running daily task reminder cron...');

    try {
      // Find all premium users with email reminders enabled
      const premiumUsers = await User.find({
        isPremium: true,
        'notifications.emailReminders': true,
        premiumExpiry: { $gt: new Date() },
      });

      console.log(`📧 Found ${premiumUsers.length} premium users to notify`);

      for (const user of premiumUsers) {
        const hoursAhead = user.notifications.reminderHoursBefore || 24;
        const windowEnd = new Date(Date.now() + hoursAhead * 60 * 60 * 1000);
        const windowStart = new Date(); // now

        // Find tasks that are:
        // 1. Overdue (dueDate < now, not completed)
        // 2. Due within the reminder window (not completed)
        const tasks = await Task.find({
          user: user._id,
          status: { $ne: 'completed' },
          dueDate: { $ne: null, $lte: windowEnd },
        }).sort({ dueDate: 1 });

        if (tasks.length === 0) continue;

        try {
          await sendTaskReminder({ user, tasks });
          console.log(`  ✉️  Reminder sent to ${user.email} (${tasks.length} tasks)`);
        } catch (emailErr) {
          console.error(`  ❌ Failed to send to ${user.email}:`, emailErr.message);
        }
      }

      console.log('✅ Daily reminder cron complete');
    } catch (err) {
      console.error('❌ Reminder cron error:', err.message);
    }
  });

  console.log('⏰ Task reminder cron scheduled (daily at 8:00 AM)');
};

module.exports = { startReminderCron };
