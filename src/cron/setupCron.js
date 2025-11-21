const { processPendingDeletions, cleanupOldDeletionRecords } = require("../utils/cronJobs");

/**
 * Cron Job Setup
 * This file sets up scheduled tasks for the application
 * In production, you would use a proper cron job scheduler like node-cron or a cloud scheduler
 */

/**
 * Process pending deletions daily
 * This should be called once per day to process users whose deletion date has arrived
 */
const runDailyDeletionProcess = async () => {
  console.log("🕐 Running daily deletion process...");
  
  try {
    const result = await processPendingDeletions();
    
    if (result.success) {
      console.log(`✅ Daily deletion process completed successfully`);
      console.log(`📊 Processed: ${result.processed}, Errors: ${result.errors}`);
    } else {
      console.error(`❌ Daily deletion process failed: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error in daily deletion process:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Clean up old deletion records weekly
 * This should be called once per week to remove old deletion records
 */
const runWeeklyCleanup = async () => {
  console.log("🧹 Running weekly cleanup...");
  
  try {
    const result = await cleanupOldDeletionRecords();
    
    if (result.success) {
      console.log(`✅ Weekly cleanup completed successfully`);
      console.log(`🗑️ Cleaned up ${result.deletedCount} old records`);
    } else {
      console.error(`❌ Weekly cleanup failed: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error in weekly cleanup:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Manual trigger for testing
 * This can be called manually for testing purposes
 */
const manualTrigger = async (type = "deletion") => {
  console.log(`🔧 Manual trigger: ${type}`);
  
  switch (type) {
    case "deletion":
      return await runDailyDeletionProcess();
    case "cleanup":
      return await runWeeklyCleanup();
    default:
      console.error("❌ Invalid trigger type. Use 'deletion' or 'cleanup'");
      return { success: false, error: "Invalid trigger type" };
  }
};

// Export functions for use in other parts of the application
module.exports = {
  runDailyDeletionProcess,
  runWeeklyCleanup,
  manualTrigger,
};

// If this file is run directly, execute the manual trigger
if (require.main === module) {
  const args = process.argv.slice(2);
  const type = args[0] || "deletion";
  
  manualTrigger(type)
    .then((result) => {
      console.log("Manual trigger result:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Manual trigger error:", error);
      process.exit(1);
    });
}
