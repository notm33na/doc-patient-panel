// Test script for new statistics endpoints
import axios from "axios";

const testNewStatisticsEndpoints = async () => {
  console.log("🧪 Testing New Statistics Endpoints");
  console.log("==================================");
  
  try {
    // First, login to get a token
    console.log("\n1. 🔐 Logging in...");
    const loginResponse = await axios.post("http://localhost:5000/api/admins/login", {
      email: "superadmin@tabeeb.com",
      password: "admin123"
    });
    
    if (!loginResponse.data.token) {
      throw new Error("No token received from login");
    }
    
    console.log("✅ Login successful!");
    const token = loginResponse.data.token;
    
    // Test patient trends endpoint
    console.log("\n2. 📈 Testing patient trends endpoint...");
    const trendsResponse = await axios.get("http://localhost:5000/api/stats/patient-trends", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("✅ Patient trends endpoint working!");
    console.log("Trends data:", trendsResponse.data.data);
    
    // Test appointments endpoint
    console.log("\n3. 📅 Testing appointments endpoint...");
    const appointmentsResponse = await axios.get("http://localhost:5000/api/stats/appointments", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("✅ Appointments endpoint working!");
    console.log("Appointments data:", appointmentsResponse.data.data);
    
    console.log("\n🎉 All new statistics endpoints are working correctly!");
    
  } catch (error) {
    console.error("❌ New statistics endpoints test failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
};

testNewStatisticsEndpoints();
