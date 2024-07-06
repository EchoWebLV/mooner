require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Function to test Cloudinary configuration
async function testCloudinaryConfig() {
  try {
    // Configure Cloudinary with the URL from .env
    cloudinary.config({
      url: process.env.CLOUDINARY_URL,
    });

    // Try to fetch account details
    const result = await cloudinary.api.ping();
    console.log("Cloudinary configuration is valid.");
    console.log("Account details:", result);
  } catch (error) {
    console.error("Error: Cloudinary configuration is invalid.");
    console.error("Error details:", error.message);
  }
}

// Run the test
testCloudinaryConfig();
