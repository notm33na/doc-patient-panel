/**
 * Test script to simulate the exact frontend admin creation request
 * This will help identify the exact 400 error
 */

import axios from 'axios';

async function testFrontendAdminCreation() {
  try {
    console.log("🔍 Testing frontend admin creation request...");

    // Simulate the exact payload from the frontend
    const payload = {
      firstName: "Test",
      lastName: "Admin",
      email: "test-frontend-request@example.com",
      phone: "03001234567",
      password: "TestPassword123!",
      role: "Admin",
      permissions: [],
      isActive: true
    };

    console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post("http://localhost:5000/api/admins", payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token' // Add auth header if needed
        }
      });

      console.log("✅ Request successful!");
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

    } catch (error) {
      console.log("❌ Request failed!");
      console.log("Error status:", error.response?.status);
      console.log("Error message:", error.response?.data);
      console.log("Full error:", error.message);
      
      if (error.response?.data) {
        console.log("\n📋 Detailed error response:");
        console.log(JSON.stringify(error.response.data, null, 2));
      }
    }

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testFrontendAdminCreation();
