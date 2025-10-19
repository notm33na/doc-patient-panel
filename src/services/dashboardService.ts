// Dashboard service for fetching statistics and analytics data
const API_BASE_URL = 'http://localhost:5000/api';

export interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  newUsersToday: number;
  newDoctorsToday: number;
  newPatientsToday: number;
  newAppointmentsToday: number;
  userGrowth: number;
  doctorGrowth: number;
  patientGrowth: number;
  appointmentGrowth: number;
}

export interface TrafficData {
  day: string;
  visitors: number;
  returning: number;
  appointments: number;
}

export interface PatientTrendsData {
  month: string;
  patients: number;
  treatments: number;
}

export interface AppointmentData {
  id: string;
  patient: string;
  location: string;
  checkIn: string;
  status: string;
  avatar?: string;
}

// Fetch dashboard statistics from the new statistics API
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const token = localStorage.getItem('token');
    console.log('🔍 Dashboard Service: Fetching stats with token:', token ? 'Present' : 'Missing');
    
    const response = await fetch(`${API_BASE_URL}/stats/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Dashboard Service: Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Dashboard Service: API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Dashboard Service: API Response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch dashboard statistics');
    }
    
    const data = result.data;
    
    return {
      totalUsers: data.totals.users,
      totalDoctors: data.totals.doctors,
      totalPatients: data.totals.patients,
      totalAppointments: data.totals.appointments,
      newUsersToday: data.today.users,
      newDoctorsToday: data.today.doctors,
      newPatientsToday: data.today.patients,
      newAppointmentsToday: data.today.appointments,
      userGrowth: data.growth.users,
      doctorGrowth: data.growth.doctors,
      patientGrowth: data.growth.patients,
      appointmentGrowth: data.growth.appointments
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Fallback to individual API calls if statistics endpoint fails
    return await fetchDashboardStatsFallback();
  }
};

// Fallback method using individual API calls
const fetchDashboardStatsFallback = async (): Promise<DashboardStats> => {
  try {
    console.log('🔄 Dashboard Service: Using fallback method');
    
    // Fetch all data in parallel
    const [admins, doctors, patients] = await Promise.all([
      fetchAdmins(),
      fetchDoctors(),
      fetchPatients()
    ]);

    console.log('📊 Dashboard Service: Fallback data counts:', {
      admins: admins.length,
      doctors: doctors.length,
      patients: patients.length
    });

    // Calculate totals
    const totalAdmins = admins.length;
    const totalDoctors = doctors.length;
    const totalPatients = patients.length;
    const totalAppointments = 0; // TODO: Implement appointments API

    // Calculate today's new entries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newAdminsToday = admins.filter(admin => 
      new Date(admin.createdAt) >= today
    ).length;
    
    const newDoctorsToday = doctors.filter(doctor => 
      new Date(doctor.createdAt) >= today
    ).length;
    
    const newPatientsToday = patients.filter(patient => 
      new Date(patient.createdAt) >= today
    ).length;
    
    const newAppointmentsToday = 0; // TODO: Implement appointments API

    // Calculate growth percentages (mock calculation for now)
    const adminGrowth = calculateGrowthPercentage(totalAdmins, 7); // 7 days ago
    const doctorGrowth = calculateGrowthPercentage(totalDoctors, 7);
    const patientGrowth = calculateGrowthPercentage(totalPatients, 7);
    const appointmentGrowth = 0; // TODO: Implement appointments API

    const result = {
      totalUsers: totalAdmins, // Map admins to users for compatibility
      totalDoctors,
      totalPatients,
      totalAppointments,
      newUsersToday: newAdminsToday, // Map admins to users for compatibility
      newDoctorsToday,
      newPatientsToday,
      newAppointmentsToday,
      userGrowth: adminGrowth, // Map admin growth to user growth for compatibility
      doctorGrowth,
      patientGrowth,
      appointmentGrowth
    };
    
    console.log('✅ Dashboard Service: Fallback result:', result);
    return result;
  } catch (error) {
    console.error('Error fetching dashboard stats fallback:', error);
    throw error;
  }
};

// Fetch traffic data from the new statistics API
export const fetchTrafficData = async (): Promise<TrafficData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/traffic`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch traffic data');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    // Fallback to mock data
    return await fetchTrafficDataFallback();
  }
};

// Fallback method for traffic data
const fetchTrafficDataFallback = async (): Promise<TrafficData[]> => {
  try {
    const trafficData: TrafficData[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Generate realistic mock data
      const baseVisitors = 80 + Math.floor(Math.random() * 20);
      const returningRatio = 0.2 + Math.random() * 0.3; // 20-50% returning
      const returning = Math.floor(baseVisitors * returningRatio);
      const appointments = Math.floor(baseVisitors * 0.15); // 15% appointments
      
      trafficData.push({
        day: dayName,
        visitors: baseVisitors,
        returning,
        appointments
      });
    }
    
    return trafficData;
  } catch (error) {
    console.error('Error fetching traffic data fallback:', error);
    throw error;
  }
};

// Fetch patient trends data
export const fetchPatientTrends = async (): Promise<PatientTrendsData[]> => {
  try {
    const token = localStorage.getItem('token');
    console.log('🔍 Dashboard Service: Fetching patient trends with token:', token ? 'Present' : 'Missing');
    
    const response = await fetch(`${API_BASE_URL}/stats/patient-trends`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Dashboard Service: Patient trends response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Dashboard Service: Patient trends API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Dashboard Service: Patient trends API Response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch patient trends');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching patient trends:', error);
    // Fallback to mock data
    return await fetchPatientTrendsFallback();
  }
};

// Fallback method for patient trends data
const fetchPatientTrendsFallback = async (): Promise<PatientTrendsData[]> => {
  try {
    console.log('🔄 Dashboard Service: Using patient trends fallback method');
    
    // Generate realistic mock data for the last 7 months
    const trendsData: PatientTrendsData[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Generate more realistic and varied patient and treatment counts
      // Use the month index to create some variation
      const basePatients = 45 + Math.floor(Math.random() * 25) + (i * 2); // Slight upward trend
      const baseTreatments = Math.floor(basePatients * (0.65 + Math.random() * 0.25)); // 65-90% of patients get treatments
      
      trendsData.push({
        month: monthName,
        patients: basePatients,
        treatments: baseTreatments
      });
    }
    
    console.log('✅ Dashboard Service: Patient trends fallback result:', trendsData);
    return trendsData;
  } catch (error) {
    console.error('Error fetching patient trends fallback:', error);
    throw error;
  }
};

// Fetch appointment overview data
export const fetchAppointmentOverview = async (): Promise<AppointmentData[]> => {
  try {
    const token = localStorage.getItem('token');
    console.log('🔍 Dashboard Service: Fetching appointments with token:', token ? 'Present' : 'Missing');
    
    const response = await fetch(`${API_BASE_URL}/stats/appointments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Dashboard Service: Appointments response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Dashboard Service: Appointments API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Dashboard Service: Appointments API Response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch appointments');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    // Fallback to mock data
    return await fetchAppointmentOverviewFallback();
  }
};

// Fallback method for appointment overview data
const fetchAppointmentOverviewFallback = async (): Promise<AppointmentData[]> => {
  try {
    console.log('🔄 Dashboard Service: Using appointments fallback method');
    
    // Generate realistic mock appointment data
    const appointments: AppointmentData[] = [
      {
        id: "1",
        patient: "Leslie Watson",
        location: "Main Clinic",
        checkIn: "09:27 AM",
        status: "Completed"
      },
      {
        id: "2",
        patient: "Darlene Robertson",
        location: "Branch Office",
        checkIn: "10:15 AM",
        status: "Re-Scheduled"
      },
      {
        id: "3",
        patient: "Jacob Jones",
        location: "Main Clinic",
        checkIn: "10:24 AM",
        status: "Completed"
      },
      {
        id: "4",
        patient: "Kathryn Murphy",
        location: "Branch Office",
        checkIn: "09:10 AM",
        status: "Completed"
      },
      {
        id: "5",
        patient: "Leslie Alexander",
        location: "Main Clinic",
        checkIn: "09:15 AM",
        status: "Completed"
      },
      {
        id: "6",
        patient: "Ronald Richards",
        location: "Branch Office",
        checkIn: "09:29 AM",
        status: "Completed"
      },
      {
        id: "7",
        patient: "Jenny Wilson",
        location: "Main Clinic",
        checkIn: "11:50 AM",
        status: "Re-Scheduled"
      }
    ];
    
    console.log('✅ Dashboard Service: Appointments fallback result:', appointments);
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments fallback:', error);
    throw error;
  }
};

// Fetch recent activities
export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    // For now, return mock data. In a real implementation, you would:
    // 1. Track all user actions in your database
    // 2. Create an activity log service
    // 3. Return real activity data
    
    const activities: RecentActivity[] = [
      {
        type: 'user',
        action: 'registered',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        details: 'New user registered: john.doe@example.com'
      },
      {
        type: 'doctor',
        action: 'approved',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        details: 'Doctor Dr. Smith approved for Cardiology'
      },
      {
        type: 'patient',
        action: 'created',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        details: 'New patient profile created: Jane Wilson'
      },
      {
        type: 'appointment',
        action: 'scheduled',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        details: 'Appointment scheduled for tomorrow at 2:00 PM'
      }
    ];
    
    return activities;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

// Helper function to calculate growth percentage
const calculateGrowthPercentage = (current: number, daysAgo: number): number => {
  // Mock calculation - in real implementation, you would compare with historical data
  const previous = Math.max(0, current - Math.floor(Math.random() * 10));
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

// Helper function to fetch admins (using existing admin API)
const fetchAdmins = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admins`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
};

// Helper function to fetch doctors (using existing doctor service)
const fetchDoctors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

// Helper function to fetch patients (using existing patient service)
const fetchPatients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};
