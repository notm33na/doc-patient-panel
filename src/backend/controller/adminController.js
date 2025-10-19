import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { logAdminActivity, getClientIP, getUserAgent } from "../utils/adminActivityLogger.js";

//JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// @desc   Register new admin
// @route  POST /api/admins/register
export const registerAdmin = async (req, res) => {
  const { firstName, lastName, email, password, role, phone, permissions } = req.body;

  try {
    // Check for existing admin by email or phone
    const adminExists = await Admin.findOne({ 
      $or: [
        { email: email },
        { phone: phone }
      ]
    });
    
    if (adminExists) {
      if (adminExists.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (adminExists.phone === phone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'Admin',
      phone,
      permissions: permissions || [],
      isActive: true,
      loginAttempts: 0,
      accountLocked: false
    });

    res.status(201).json({
      _id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      phone: admin.phone,
      permissions: admin.permissions,
      isActive: admin.isActive,
      token: generateToken(admin.id),
    });
  } catch (error) {
    console.error("Register admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Login admin
// @route  POST /api/admins/login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Normalize email: trim whitespace and convert to lowercase
    const normalizedEmail = email?.trim().toLowerCase();
    
    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!admin.isActive) {
      return res.status(400).json({ message: "Account is deactivated" });
    }

    if (admin.accountLocked) {
      return res.status(400).json({ message: "Account is locked" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      // Increment login attempts
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= 5) {
        admin.accountLocked = true;
      }
      await admin.save();
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Reset login attempts on successful login
    admin.loginAttempts = 0;
    admin.lastLogin = new Date();
    admin.lastActivity = new Date();
    await admin.save();

    // Log admin login activity
    await logAdminActivity({
      adminId: admin._id,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminRole: admin.role,
      action: 'LOGIN',
      details: 'Admin logged in successfully',
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        loginTime: new Date(),
        sessionId: admin._id.toString()
      }
    });

    res.json({
      _id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      phone: admin.phone,
      permissions: admin.permissions,
      isActive: admin.isActive,
      token: generateToken(admin.id),
    });
  } catch (error) {
    console.error("Login admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Get all admins
// @route  GET /api/admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-password');
    res.json(admins);
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

// @desc   Add new admin
// @route  POST /api/admins
export const addAdmin = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      password, 
      role,
      permissions,
      isActive
    } = req.body;

    console.log("Incoming Admin Data:", req.body);

    // Check for existing admin by email or phone
    const existing = await Admin.findOne({ 
      $or: [
        { email: email },
        { phone: phone }
      ]
    });
    
    if (existing) {
      if (existing.email === email) {
        return res.status(400).json({ error: "Email already exists" });
      }
      if (existing.phone === phone) {
        return res.status(400).json({ error: "Phone number already exists" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminData = {
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phone: phone || "",
      password: hashedPassword,
      role: role || "Admin",
      permissions: permissions || [],
      isActive: isActive !== undefined ? isActive : true,
      loginAttempts: 0,
      accountLocked: false
    };

    const newAdmin = new Admin(adminData);
    await newAdmin.save();
    
    console.log("Admin saved successfully:", newAdmin);

    // Log admin creation activity
    await logAdminActivity({
      adminId: newAdmin._id,
      adminName: `${newAdmin.firstName} ${newAdmin.lastName}`,
      adminRole: newAdmin.role,
      action: 'CREATE_ADMIN',
      details: `Created new admin account for ${newAdmin.firstName} ${newAdmin.lastName}`,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        createdAdminEmail: newAdmin.email,
        createdAdminRole: newAdmin.role,
        permissions: newAdmin.permissions
      }
    });

    res.status(201).json(newAdmin);
  } catch (err) {
    console.error("Error saving admin:", err);
    res.status(400).json({ error: err.message });
  }
};

// @desc   Delete an admin
// @route  DELETE /api/admins/:id
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the admin being deleted before deletion
    const adminToDelete = await Admin.findById(id);
    if (!adminToDelete) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const deleted = await Admin.findByIdAndDelete(id);
    
    // Log admin deletion activity
    await logAdminActivity({
      adminId: req.admin.id,
      adminName: `${req.admin.firstName} ${req.admin.lastName}`,
      adminRole: req.admin.role,
      action: 'DELETE_ADMIN',
      details: `Deleted admin account for ${adminToDelete.firstName} ${adminToDelete.lastName}`,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        deletedAdminId: adminToDelete._id,
        deletedAdminName: `${adminToDelete.firstName} ${adminToDelete.lastName}`,
        deletedAdminRole: adminToDelete.role,
        deletedAdminEmail: adminToDelete.email
      }
    });

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ error: "Failed to delete admin" });
  }
};

// @desc   Update an admin
// @route  PUT /api/admins/:id
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Get the admin being updated
    const adminToUpdate = await Admin.findById(id);
    if (!adminToUpdate) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Check if role is being changed
    const roleChanged = updateData.role && updateData.role !== adminToUpdate.role;
    
    const updated = await Admin.findByIdAndUpdate(id, updateData, { new: true });
    
    // Log admin activity if role was changed
    if (roleChanged) {
      await logAdminActivity({
        adminId: req.admin.id,
        adminName: `${req.admin.firstName} ${req.admin.lastName}`,
        adminRole: req.admin.role,
        action: 'UPDATE_ADMIN',
        details: `Changed role of ${adminToUpdate.firstName} ${adminToUpdate.lastName} from ${adminToUpdate.role} to ${updateData.role}`,
        ipAddress: getClientIP(req),
        userAgent: getUserAgent(req),
        metadata: {
          targetAdminId: adminToUpdate._id,
          targetAdminName: `${adminToUpdate.firstName} ${adminToUpdate.lastName}`,
          oldRole: adminToUpdate.role,
          newRole: updateData.role
        }
      });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating admin:", err);
    res.status(500).json({ error: "Failed to update admin" });
  }
};

// @desc   Get admin profile
// @route  GET /api/admins/me
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Update admin profile
// @route  PUT /api/admins/me
export const updateMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { firstName, lastName, email, phone, profileImage } = req.body;
    
    // Validate email format
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== admin.email) {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Update fields
    admin.firstName = firstName || admin.firstName;
    admin.lastName = lastName || admin.lastName;
    admin.email = email || admin.email;
    admin.phone = phone || admin.phone;
    admin.profileImage = profileImage || admin.profileImage;
    admin.lastActivity = new Date();

    const updatedAdmin = await admin.save();
    
    // Log the profile update activity
    await logAdminActivity({
      adminId: req.admin.id,
      adminName: `${req.admin.firstName} ${req.admin.lastName}`,
      adminRole: req.admin.role,
      action: 'UPDATE_ADMIN',
      details: 'Updated profile information',
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        updatedFields: Object.keys(req.body)
      }
    });

    // Return admin without password
    const adminResponse = await Admin.findById(updatedAdmin._id).select('-password');
    res.json(adminResponse);
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Change admin password
// @route  PUT /api/admins/change-password
export const changePassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    admin.lastActivity = new Date();

    await admin.save();

    // Log the password change activity
    await logAdminActivity({
      adminId: req.admin.id,
      adminName: `${req.admin.firstName} ${req.admin.lastName}`,
      adminRole: req.admin.role,
      action: 'UPDATE_ADMIN',
      details: 'Changed password',
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      metadata: {
        action: 'password_change'
      }
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Check if email exists
// @route  GET /api/admins/check-email/:email
export const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.params;
    const admin = await Admin.findOne({ email: email });
    res.json({ exists: !!admin });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc   Check if phone exists
// @route  GET /api/admins/check-phone/:phone
export const checkPhoneExists = async (req, res) => {
  try {
    const { phone } = req.params;
    const admin = await Admin.findOne({ phone: phone });
    res.json({ exists: !!admin });
  } catch (error) {
    console.error("Check phone error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
