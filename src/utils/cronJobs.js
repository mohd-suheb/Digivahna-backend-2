const User = require("../models/User");
const UserDeletion = require("../models/UserDeletion");
const QRAssignment = require("../models/QRAssignment");

/**
 * Cron Job Utilities
 * Handles scheduled tasks for the application
 */

/**
 * Process pending user deletions
 * This function should be called daily to process users whose deletion date has arrived
 */
const processPendingDeletions = async () => {
  try {
    console.log("Starting pending deletions processing...");
    
    const currentDate = new Date();
    
    // Find users pending deletion
    const pendingDeletions = await UserDeletion.findPendingDeletions(currentDate);
    
    console.log(`Found ${pendingDeletions.length} pending deletions to process`);
    
    let processedCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const deletion of pendingDeletions) {
      try {
        console.log(`Processing deletion for user: ${deletion.user_id}`);
        
        const user = await User.findByEmailOrPhone(deletion.user_id);
        
        if (!user) {
          console.log(`User not found: ${deletion.user_id}, marking deletion as completed`);
          await deletion.complete();
          processedCount++;
          continue;
        }

        if (deletion.deletion_type === "all") {
          // Delete all user data except QR IDs
          await deleteUserData(user);
          console.log(`User data deleted for: ${deletion.user_id}`);
        } else {
          // Only update status to deleted
          await user.completeDeletion();
          console.log(`User status updated to deleted for: ${deletion.user_id}`);
        }

        // Mark deletion as completed
        await deletion.complete();
        processedCount++;

      } catch (error) {
        console.error(`Error processing deletion for user ${deletion.user_id}:`, error);
        errorCount++;
        errors.push({
          user_id: deletion.user_id,
          error: error.message
        });
      }
    }

    console.log(`Deletion processing completed. Processed: ${processedCount}, Errors: ${errorCount}`);
    
    if (errors.length > 0) {
      console.error("Errors during deletion processing:", errors);
    }

    return {
      success: true,
      processed: processedCount,
      errors: errorCount,
      errorDetails: errors
    };

  } catch (error) {
    console.error("Error in processPendingDeletions:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete all user data except QR IDs
 * @param {Object} user - User object
 */
const deleteUserData = async (user) => {
  try {
    // Update user status to deleted
    await user.completeDeletion();

    // Clear user data but keep the user record for QR reference
    await User.findByIdAndUpdate(user._id, {
      $unset: {
        "basic_details.profile_pic_url": 1,
        "public_details": 1,
        "old_passwords": 1,
        "live_tracking": 1,
        "notifications": 1,
        "my_orders": 1,
        "address_book": 1,
        "chat_box": 1,
        "emergency_contacts": 1,
        "garage": 1,
      },
      $set: {
        "basic_details.first_name": "Deleted",
        "basic_details.last_name": "User",
        "basic_details.email": `deleted_${user._id}@deleted.com`,
        "basic_details.phone_number": `deleted_${user._id}`,
        "basic_details.password": "deleted",
        "is_active": false,
        "is_logged_in": false,
        "suspended_until": null,
        "suspension_reason": "",
      }
    });

    // Note: QR assignments are kept but marked as inactive
    // This allows tracking of QR codes even after user deletion

  } catch (error) {
    console.error("Error in deleteUserData:", error);
    throw error;
  }
};

/**
 * Clean up old deletion records
 * Remove deletion records older than 30 days
 */
const cleanupOldDeletionRecords = async () => {
  try {
    console.log("Starting cleanup of old deletion records...");
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const result = await UserDeletion.deleteMany({
      status: "COMPLETED",
      completed_at: { $lt: thirtyDaysAgo }
    });
    
    console.log(`Cleaned up ${result.deletedCount} old deletion records`);
    
    return {
      success: true,
      deletedCount: result.deletedCount
    };

  } catch (error) {
    console.error("Error in cleanupOldDeletionRecords:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get deletion statistics
 * Returns statistics about pending and completed deletions
 */
const getDeletionStats = async () => {
  try {
    const stats = await UserDeletion.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const currentDate = new Date();
    const pendingToday = await UserDeletion.countDocuments({
      status: "PENDING_DELETION",
      deletion_date: { $lte: currentDate }
    });

    return {
      success: true,
      stats: stats,
      pendingToday: pendingToday
    };

  } catch (error) {
    console.error("Error in getDeletionStats:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  processPendingDeletions,
  deleteUserData,
  cleanupOldDeletionRecords,
  getDeletionStats,
};
