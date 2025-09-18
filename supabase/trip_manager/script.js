// Enhanced Tourist Safety System - Shared Script
// Version: 2.0
// Author: Tourist Safety Team

// ===========================
// CONFIGURATION
// ===========================
const SUPABASE_URL = "https://martdbudgoflarqthipw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcnRkYnVkZ29mbGFycXRoaXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzg0NzcsImV4cCI6MjA3MzcxNDQ3N30.XxB8CbFakk_SJBvIC873k8vTh9z82VC1OKG-xQtRMWE";
const GOOGLE_MAPS_API_KEY = "AIzaSyB9JtaoGZvW33eY4XrbXYHpKZGrl3YyFBY";

// Initialize Supabase client
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===========================
// GLOBAL STATE MANAGEMENT
// ===========================
let currentUser = null;
let currentSession = null;
let isInitialized = false;

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Display notification to user
 * @param {string} message - The message to display
 * @param {string} type - Type of notification (success, error, info, warning)
 * @param {number} duration - Duration in milliseconds (default: 5000)
 */
function showNotification(message, type = 'info', duration = 5000) {
  // Try to find existing notification element
  let notificationEl = document.getElementById('notification');
  
  // Create notification element if it doesn't exist
  if (!notificationEl) {
    notificationEl = document.createElement('div');
    notificationEl.id = 'notification';
    notificationEl.className = 'notification';
    document.body.insertBefore(notificationEl, document.body.firstChild);
  }

  // Set notification content and style
  notificationEl.className = `notification ${type}`;
  notificationEl.textContent = message;
  notificationEl.classList.remove('hidden');
  notificationEl.classList.add('show');
  
  // Auto-hide notification
  setTimeout(() => {
    notificationEl.classList.remove('show');
    setTimeout(() => {
      if (notificationEl.classList.contains('show') === false) {
        notificationEl.classList.add('hidden');
      }
    }, 300);
  }, duration);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
function validatePassword(password) {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 100) {
    return { isValid: false, message: 'Password is too long' };
  }

  // Optional: Add more complex validation
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumbers = /\d/.test(password);
  // const hasNonalphas = /\W/.test(password);
  
  return { isValid: true, message: 'Password is valid' };
}

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>'"]/g, '');
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
function formatDate(date, options = {}) {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===========================
// AUTHENTICATION FUNCTIONS
// ===========================

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {object} metadata - Additional user metadata
 * @returns {object} Signup result
 */
async function signup(email, password, metadata = {}) {
  try {
    // Validate inputs
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    // Attempt signup
    const { data, error } = await db.auth.signUp({
      email: sanitizeInput(email),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: metadata
      }
    });

    if (error) {
      throw error;
    }

    console.log('Signup successful:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific error cases
    if (error.message.includes('User already registered')) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    } else if (error.message.includes('Password should be at least')) {
      throw new Error('Password must be at least 6 characters long');
    } else {
      throw new Error(`Signup failed: ${error.message}`);
    }
  }
}

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} Login result
 */
async function login(email, password) {
  try {
    // Validate inputs
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    // Attempt login
    const { data, error } = await db.auth.signInWithPassword({
      email: sanitizeInput(email),
      password
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Login failed - no user data received');
    }

    // Store user data
    currentUser = data.user;
    currentSession = data.session;
    localStorage.setItem('userId', data.user.id);

    console.log('Login successful:', data.user);
    return { success: true, user: data.user, session: data.session };

  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific error cases
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    } else if (error.message.includes('Email not confirmed')) {
      throw new Error('Please check your email and confirm your account before signing in.');
    } else if (error.message.includes('Too many requests')) {
      throw new Error('Too many login attempts. Please wait a few minutes and try again.');
    } else {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}

/**
 * Reset user password
 * @param {string} email - User email
 * @returns {object} Reset result
 */
async function resetPassword(email) {
  try {
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    const { error } = await db.auth.resetPasswordForEmail(sanitizeInput(email), {
      redirectTo: window.location.origin
    });

    if (error) {
      throw error;
    }

    console.log('Password reset email sent to:', email);
    return { success: true };

  } catch (error) {
    console.error('Password reset error:', error);
    
    if (error.message.includes('For security purposes')) {
      throw new Error('For security purposes, password reset is temporarily limited. Please try again later.');
    } else {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }
}

/**
 * Update user password (for authenticated users)
 * @param {string} newPassword - New password
 * @returns {object} Update result
 */
async function updatePassword(newPassword) {
  try {
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    const { error } = await db.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }

    console.log('Password updated successfully');
    return { success: true };

  } catch (error) {
    console.error('Password update error:', error);
    throw new Error(`Password update failed: ${error.message}`);
  }
}

/**
 * Sign out current user
 * @returns {object} Logout result
 */
async function logout() {
  try {
    const { error } = await db.auth.signOut();

    if (error) {
      throw error;
    }

    // Clear local state
    currentUser = null;
    currentSession = null;
    localStorage.removeItem('userId');
    
    console.log('Logout successful');
    return { success: true };

  } catch (error) {
    console.error('Logout error:', error);
    
    // Clear local state even on error
    currentUser = null;
    currentSession = null;
    localStorage.removeItem('userId');
    
    throw new Error(`Logout failed: ${error.message}`);
  }
}

/**
 * Get current user session
 * @returns {object} Session data or null
 */
async function getCurrentUser() {
  try {
    const { data, error } = await db.auth.getUser();

    if (error) {
      throw error;
    }

    currentUser = data.user;
    return data.user;

  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Get current session
 * @returns {object} Session data or null
 */
async function getCurrentSession() {
  try {
    const { data, error } = await db.auth.getSession();

    if (error) {
      throw error;
    }

    currentSession = data.session;
    currentUser = data.session?.user || null;
    
    return data.session;

  } catch (error) {
    console.error('Get current session error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated and redirect if not
 * @param {string} redirectTo - URL to redirect to if not authenticated
 * @returns {object} User data or null
 */
async function requireAuth(redirectTo = './index.html') {
  try {
    const session = await getCurrentSession();
    
    if (!session || !session.user) {
      showNotification('Please log in to access this page', 'error');
      
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 2000);
      
      return null;
    }
    
    return session.user;

  } catch (error) {
    console.error('Auth check error:', error);
    
    setTimeout(() => {
      window.location.href = redirectTo;
    }, 2000);
    
    return null;
  }
}

// ===========================
// PROFILE MANAGEMENT
// ===========================

/**
 * Create tourist profile
 * @param {object} profileData - Profile data object
 * @returns {object} Creation result
 */
async function createTouristProfile(profileData) {
  try {
    const user = await requireAuth();
    if (!user) return null;

    // Validate required fields
    const requiredFields = ['full_name', 'dob', 'kyc_number'];
    const missingFields = requiredFields.filter(field => !profileData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Sanitize input data
    const sanitizedProfile = {
      id: user.id,
      full_name: sanitizeInput(profileData.full_name),
      phone: sanitizeInput(profileData.phone || ''),
      nationality: sanitizeInput(profileData.nationality || ''),
      passport_number: sanitizeInput(profileData.passport_number || ''),
      dob: profileData.dob,
      kyc_number: sanitizeInput(profileData.kyc_number),
      emergency_contact: sanitizeInput(profileData.emergency_contact || ''),
      created_at: new Date().toISOString()
    };

    // Insert profile
    const { error: profileError } = await db
      .from('tourist_profiles')
      .insert(sanitizedProfile);

    if (profileError) {
      throw profileError;
    }

    // Create digital ID
    await createDigitalId(user.id);

    console.log('Tourist profile created successfully');
    return { success: true, profile: sanitizedProfile };

  } catch (error) {
    console.error('Profile creation error:', error);
    throw new Error(`Profile creation failed: ${error.message}`);
  }
}

/**
 * Get tourist profile by user ID
 * @param {string} userId - User ID (optional, uses current user if not provided)
 * @returns {object} Profile data or null
 */
async function getTouristProfile(userId = null) {
  try {
    const user = userId ? { id: userId } : await getCurrentUser();
    if (!user) return null;

    const { data, error } = await db
      .from('tourist_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return null;
      }
      throw error;
    }

    return data;

  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
}

/**
 * Update tourist profile
 * @param {object} updateData - Data to update
 * @returns {object} Update result
 */
async function updateTouristProfile(updateData) {
  try {
    const user = await requireAuth();
    if (!user) return null;

    // Sanitize update data
    const sanitizedUpdate = {};
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        sanitizedUpdate[key] = typeof updateData[key] === 'string' 
          ? sanitizeInput(updateData[key]) 
          : updateData[key];
      }
    });

    const { error } = await db
      .from('tourist_profiles')
      .update(sanitizedUpdate)
      .eq('id', user.id);

    if (error) {
      throw error;
    }

    console.log('Profile updated successfully');
    return { success: true };

  } catch (error) {
    console.error('Profile update error:', error);
    throw new Error(`Profile update failed: ${error.message}`);
  }
}

// ===========================
// DIGITAL ID MANAGEMENT
// ===========================

/**
 * Create digital ID for user
 * @param {string} profileId - Profile ID
 * @returns {object} Creation result
 */
async function createDigitalId(profileId) {
  try {
    const digitalId = {
      tourist_profile_id: profileId,
      public_hash: `TEMP-${profileId}-${Date.now()}`,
      valid_from: new Date().toISOString(),
      status: 'active',
      created_at: new Date().toISOString()
    };

    const { error } = await db
      .from('digital_ids')
      .insert(digitalId);

    if (error) {
      throw error;
    }

    console.log('Digital ID created successfully');
    return { success: true };

  } catch (error) {
    console.error('Digital ID creation error:', error);
    // Don't throw error - digital ID creation is not critical
    console.warn('Digital ID creation failed, but profile creation will continue');
    return { success: false, error: error.message };
  }
}

/**
 * Update Digital ID with real blockchain hash
 * @param {string} profileId - Profile ID
 * @param {string} realHash - Real blockchain hash
 * @param {string} blockchainTx - Blockchain transaction ID
 * @param {string} validUntil - Valid until date (optional)
 * @returns {object} Update result
 */
async function updateDigitalId(profileId, realHash, blockchainTx, validUntil = null) {
  try {
    const updates = {
      public_hash: realHash,
      blockchain_tx: blockchainTx,
      status: "active",
      updated_at: new Date().toISOString()
    };

    if (validUntil) {
      updates.valid_until = validUntil;
    }

    const { error } = await db
      .from("digital_ids")
      .update(updates)
      .eq("tourist_profile_id", profileId);

    if (error) {
      throw error;
    }

    console.log("Digital ID updated successfully");
    return { success: true };

  } catch (error) {
    console.error("Digital ID update error:", error);
    throw new Error(`Digital ID update failed: ${error.message}`);
  }
}

// ===========================
// TRIP MANAGEMENT
// ===========================

/**
 * Create a new trip
 * @param {object} tripData - Trip data object
 * @returns {object} Creation result
 */
async function createTrip(tripData) {
  try {
    const user = await requireAuth();
    if (!user) return null;

    // Validate required fields
    if (!tripData.start_date || !tripData.end_date) {
      throw new Error('Start date and end date are required');
    }

    // Validate dates
    const startDate = new Date(tripData.start_date);
    const endDate = new Date(tripData.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      throw new Error('Start date cannot be in the past');
    }

    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    // Sanitize trip data
    const sanitizedTrip = {
      profile_id: user.id,
      trip_name: sanitizeInput(tripData.trip_name || ''),
      destination: sanitizeInput(tripData.destination || ''),
      start_date: tripData.start_date,
      end_date: tripData.end_date,
      created_at: new Date().toISOString()
    };

    const { data, error } = await db
      .from('trips')
      .insert(sanitizedTrip)
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('Trip created successfully:', data);
    return { success: true, trip: data };

  } catch (error) {
    console.error('Trip creation error:', error);
    throw new Error(`Trip creation failed: ${error.message}`);
  }
}

/**
 * Get user trips
 * @param {string} userId - User ID (optional, uses current user if not provided)
 * @returns {array} Array of trips
 */
async function getUserTrips(userId = null) {
  try {
    const user = userId ? { id: userId } : await getCurrentUser();
    if (!user) return [];

    const { data, error } = await db
      .from('trips')
      .select('*')
      .eq('profile_id', user.id)
      .order('start_date', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];

  } catch (error) {
    console.error('Get trips error:', error);
    return [];
  }
}

/**
 * Delete a trip
 * @param {string} tripId - Trip ID to delete
 * @returns {object} Deletion result
 */
async function deleteTrip(tripId) {
  try {
    const user = await requireAuth();
    if (!user) return null;

    // First, delete associated trip locations
    const { error: locationsError } = await db
      .from('trip_locations')
      .delete()
      .eq('trip_id', tripId);

    if (locationsError) {
      console.warn('Error deleting trip locations:', locationsError);
    }

    // Then delete the trip
    const { error } = await db
      .from('trips')
      .delete()
      .eq('id', tripId)
      .eq('profile_id', user.id); // Ensure user owns the trip

    if (error) {
      throw error;
    }

    console.log('Trip deleted successfully');
    return { success: true };

  } catch (error) {
    console.error('Trip deletion error:', error);
    throw new Error(`Trip deletion failed: ${error.message}`);
  }
}

// ===========================
// DEVICE MANAGEMENT
// ===========================

/**
 * Register user device
 * @param {string} userId - User ID
 * @returns {string} Device ID
 */
async function registerDevice(userId) {
  try {
    // Try to get existing device ID from localStorage
    let deviceId = localStorage.getItem("deviceId");
    
    if (deviceId) {
      // Verify device exists in database
      const { data, error } = await db
        .from("devices")
        .select("id")
        .eq("id", deviceId)
        .single();
      
      if (data && !error) {
        // Update last_seen
        await db
          .from("devices")
          .update({ last_seen: new Date().toISOString() })
          .eq("id", deviceId);
        
        return deviceId;
      }
    }

    // Create new device
    const os = navigator.userAgent.includes("Android") ? "Android" :
              navigator.userAgent.includes("iPhone") ? "iOS" : "Web";

    const deviceData = {
      profile_id: userId,
      device_id: crypto.randomUUID(),
      os: os,
      last_seen: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await db
      .from("devices")
      .insert(deviceData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    deviceId = data.id;
    localStorage.setItem("deviceId", deviceId);
    
    console.log('Device registered successfully:', deviceId);
    return deviceId;

  } catch (error) {
    console.error("Device registration error:", error);
    throw new Error(`Device registration failed: ${error.message}`);
  }
}

// ===========================
// LOCATION MANAGEMENT
// ===========================

/**
 * Log location for trip
 * @param {object} locationData - Location data object
 * @returns {object} Logging result
 */
async function logLocation(locationData) {
  try {
    const requiredFields = ['trip_id', 'device_id', 'latitude', 'longitude'];
    const missingFields = requiredFields.filter(field => !locationData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const sanitizedLocation = {
      trip_id: locationData.trip_id,
      device_id: locationData.device_id,
      latitude: parseFloat(locationData.latitude),
      longitude: parseFloat(locationData.longitude),
      speed: locationData.speed ? parseFloat(locationData.speed) : null,
      location_name: sanitizeInput(locationData.location_name || ''),
      safety_response: locationData.safety_response || 1,
      recorded_at: locationData.recorded_at || new Date().toISOString()
    };

    const { error } = await db
      .from('trip_locations')
      .insert(sanitizedLocation);

    if (error) {
      throw error;
    }

    console.log('Location logged successfully');
    return { success: true };

  } catch (error) {
    console.error('Location logging error:', error);
    throw new Error(`Location logging failed: ${error.message}`);
  }
}

/**
 * Get trip locations
 * @param {string} tripId - Trip ID
 * @param {number} limit - Maximum number of locations to retrieve
 * @returns {array} Array of locations
 */
async function getTripLocations(tripId, limit = 50) {
  try {
    const { data, error } = await db
      .from('trip_locations')
      .select('*')
      .eq('trip_id', tripId)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];

  } catch (error) {
    console.error('Get trip locations error:', error);
    return [];
  }
}

// ===========================
// SESSION MANAGEMENT
// ===========================

/**
 * Initialize session management for pages other than index.html
 */
async function initializeSession() {
  // Skip if we're on the index page (it handles its own session logic)
  if (window.location.pathname === '/' || 
      window.location.pathname.endsWith('index.html') || 
      window.location.pathname === '') {
    return;
  }

  try {
    const session = await getCurrentSession();

    if (session && session.user) {
      console.log("User session found:", session.user);
      localStorage.setItem("userId", session.user.id);

      // Update UI if elements exist
      const authDiv = document.getElementById("auth");
      const dashboardDiv = document.getElementById("dashboard");
      
      if (authDiv && dashboardDiv) {
        authDiv.style.display = "none";
        dashboardDiv.style.display = "block";
        
        const userInfoElement = document.getElementById("user-info");
        if (userInfoElement) {
          userInfoElement.textContent = `Logged in as: ${session.user.email}`;
        }
      }
      
    } else {
      console.log("No session found");
      
      // Check if we're on a protected page
      const protectedPages = ['user_info.html', 'trip_manager.html', 'location.html'];
      const currentPage = window.location.pathname.split('/').pop();
      
      if (protectedPages.includes(currentPage)) {
        showNotification('Please log in to access this page', 'error');
        setTimeout(() => {
          window.location.href = "./index.html";
        }, 2000);
        return;
      }
      
      // Show auth form if elements exist
      const authDiv = document.getElementById("auth");
      const dashboardDiv = document.getElementById("dashboard");
      
      if (authDiv && dashboardDiv) {
        authDiv.style.display = "block";
        dashboardDiv.style.display = "none";
      }
    }
    
  } catch (error) {
    console.error("Session initialization error:", error);
    
    // Show auth form on error
    const authDiv = document.getElementById("auth");
    const dashboardDiv = document.getElementById("dashboard");
    
    if (authDiv && dashboardDiv) {
      authDiv.style.display = "block";
      dashboardDiv.style.display = "none";
    }
  }
}

// ===========================
// INITIALIZATION
// ===========================

/**
 * Initialize the application
 */
async function initializeApp() {
  if (isInitialized) return;

  try {
    // Set up auth state change listener
    db.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      currentSession = session;
      currentUser = session?.user || null;
      
      if (session) {
        localStorage.setItem('userId', session.user.id);
      } else {
        localStorage.removeItem('userId');
      }
    });

    // Initialize session for non-index pages
    await initializeSession();

    isInitialized = true;
    console.log('Tourist Safety System initialized successfully');

  } catch (error) {
    console.error('App initialization error:', error);
  }
}

// ===========================
// EVENT LISTENERS
// ===========================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle page visibility changes (for session refresh)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && isInitialized) {
    // Refresh session when page becomes visible
    getCurrentSession().catch(console.error);
  }
});

// ===========================
// EXPORTS (for compatibility with existing code)
// ===========================

// Export functions for backward compatibility
window.TouristSafety = {
  // Authentication
  signup,
  login,
  logout,
  resetPassword,
  updatePassword,
  getCurrentUser,
  getCurrentSession,
  requireAuth,
  
  // Profile Management
  createTouristProfile,
  getTouristProfile,
  updateTouristProfile,
  
  // Digital ID
  createDigitalId,
  updateDigitalId,
  
  // Trip Management
  createTrip,
  getUserTrips,
  deleteTrip,
  
  // Device Management
  registerDevice,
  
  // Location Management
  logLocation,
  getTripLocations,
  
  // Utilities
  showNotification,
  validateEmail,
  validatePassword,
  sanitizeInput,
  formatDate,
  debounce
};