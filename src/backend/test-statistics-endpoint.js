// Test script for statistics endpoint
import axios from "axios";

const testStatisticsEndpoint = async () => {
  console.log("🧪 Testing Statistics Endpoint");
  console.log("=============================");
  
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
    
    // Test dashboard stats endpoint
    console.log("\n2. 📊 Testing dashboard stats endpoint...");
    const statsResponse = await axios.get("http://localhost:5000/api/stats/dashboard", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("✅ Dashboard stats endpoint working!");
    console.log("Stats data:", {
      totals: statsResponse.data.data.totals,
      today: statsResponse.data.data.today,
      growth: statsResponse.data.data.growth
    });
    
    // Test traffic stats endpoint
    console.log("\n3. 🚦 Testing traffic stats endpoint...");
    const trafficResponse = await axios.get("http://localhost:5000/api/stats/traffic", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("✅ Traffic stats endpoint working!");
    console.log("Traffic data:", trafficResponse.data.data);
    
    console.log("\n🎉 All statistics endpoints are working correctly!");
    
  } catch (error) {
    console.error("❌ Statistics endpoint test failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
};

testStatisticsEndpoint();
