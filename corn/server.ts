import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function to delete old messages
async function deleteOldMessages() {
  console.log("Running the delete old messages job...");

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const result = await prisma.message.deleteMany({
      where: {
        createdAt: {
          lt: twentyFourHoursAgo,
        },
      },
    });
    console.log(`Deleted ${result.count} old messages`);
  } catch (error) {
    console.error("Error deleting old messages:", error);
  }
}

async function disconnect() {
  await prisma.$disconnect();
}

// Schedule the job to run every hour
cron.schedule("0 * * * *", () => {
  deleteOldMessages().catch((error) => console.error("Cron job error:", error));
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down...");
  void disconnect();
  process.exit(0);
});

console.log("Cron job scheduled: delete old messages every hour");

// Keep the script running
process.stdin.resume();
