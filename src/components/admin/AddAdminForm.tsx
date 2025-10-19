import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import PhoneInput from "@/components/ui/PhoneInput";
import { toast } from "@/hooks/use-toast";
import { UserPlus, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

const addAdminSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(11, "Phone number must be in format 0xxxxxxxxx").max(11, "Phone number must be in format 0xxxxxxxxx"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["Admin", "Super Admin"]),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

type AddAdminForm = z.infer<typeof addAdminSchema>;

export const AddAdminForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasCapitalLetter: false,
    isValid: false
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const form = useForm<AddAdminForm>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "Admin",
      permissions: [],
      isActive: true,
    },
  });

  const validatePassword = (password: string) => {
    const validation = {
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      hasCapitalLetter: /[A-Z]/.test(password),
      isValid: false
    };
    
    validation.isValid = validation.length && validation.hasNumber && 
                       validation.hasSpecialChar && validation.hasCapitalLetter;
    
    setPasswordValidation(validation);
  };

  const handlePasswordChange = (value: string) => {
    form.setValue("password", value);
    validatePassword(value);
  };

  const checkEmailExists = async (email: string) => {
    if (!email || email.length < 5) {
      setEmailError(null);
      return false;
    }
    
    try {
      const response = await axios.get(`http://localhost:5000/api/admins/check-email/${encodeURIComponent(email)}`);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const checkPhoneExists = async (phone: string) => {
    if (!phone || phone.length < 10) {
      setPhoneError(null);
      return false;
    }
    
    try {
      const response = await axios.get(`http://localhost:5000/api/admins/check-phone/${encodeURIComponent(phone)}`);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking phone:", error);
      return false;
    }
  };

  const handleEmailChange = async (value: string) => {
    form.setValue("email", value);
    setEmailError(null);
    
    if (value && value.length > 5) {
      const exists = await checkEmailExists(value);
      if (exists) {
        setEmailError("This email is already in use");
      }
    }
  };

  const handlePhoneChange = async (value: string) => {
    form.setValue("phone", value);
    setPhoneError(null);
    
    if (value && value.length >= 10) {
      const exists = await checkPhoneExists(value);
      if (exists) {
        setPhoneError("This phone number is already in use");
      }
    }
  };

  const onSubmit = async (data: AddAdminForm) => {
    // Check password validation before submitting
    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid Password",
        description: "Your password needs to be stronger. Please make sure it has at least 8 letters, includes a number, a special symbol like ! or @, and at least one capital letter.",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate email and phone before submitting
    const emailExists = await checkEmailExists(data.email);
    const phoneExists = await checkPhoneExists(data.phone);
    
    if (emailExists || phoneExists) {
      if (emailExists) {
        setEmailError("This email is already in use");
      }
      if (phoneExists) {
        setPhoneError("This phone number is already in use");
      }
      toast({
        title: "Duplicate Information",
        description: "Email or phone number is already in use. Please use different credentials.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Keep firstName and lastName separately
      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        permissions: data.permissions || [],
        isActive: data.isActive,
      };

      // POST to backend
      const token = localStorage.getItem('token');
      const res = await axios.post("http://localhost:5000/api/admins", payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast({
        title: "Admin Added Successfully",
        description: `${payload.firstName} ${payload.lastName} has been added as an admin.`,
      });

      form.reset();
      setPasswordValidation({
        length: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasCapitalLetter: false,
        isValid: false
      });
      setEmailError(null);
      setPhoneError(null);
    } catch (error: any) {
      console.error("Add admin error:", error);
      toast({
        title: "Error adding admin",
        description: error.response?.data?.message || error.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl border border-border/20 shadow-medium bg-card">
      <CardHeader className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-medium">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-xl font-semibold text-card-foreground">Add New Admin</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Enter email address" 
                    {...field}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={emailError ? "border-red-500" : ""}
                  />
                </FormControl>
                {emailError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {emailError}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    onValidationChange={(isValid, error) => {
                      if (error) {
                        setPhoneError(error);
                      } else {
                        setPhoneError(null);
                      }
                    }}
                    required
                    showFormatHint={true}
                  />
                </FormControl>
                {phoneError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {phoneError}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select admin role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Password */}
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter password" 
                      value={field.value}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={field.value && !passwordValidation.isValid ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
                
                {/* Password Requirements */}
                {field.value && (
                  <div className="mt-2 space-y-1">
                    <div className={`flex items-center gap-2 text-sm ${passwordValidation.length ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValidation.length ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      At least 8 letters long
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValidation.hasNumber ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      Has a number (0-9)
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValidation.hasSpecialChar ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      Has a special symbol (!@#$)
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${passwordValidation.hasCapitalLetter ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValidation.hasCapitalLetter ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      Has a capital letter (A-Z)
                    </div>
                    {passwordValidation.isValid && (
                      <div className="flex items-center gap-2 text-sm text-green-600 font-medium mt-2">
                        <CheckCircle className="h-4 w-4" />
                        Great! Your password is strong and secure.
                      </div>
                    )}
                  </div>
                )}
              </FormItem>
            )} />


            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || (form.watch("password") && !passwordValidation.isValid)} 
                className="flex-1"
              >
                {isSubmitting ? "Adding Admin..." : "Add Admin"}
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                form.reset();
                setPasswordValidation({
                  length: false,
                  hasNumber: false,
                  hasSpecialChar: false,
                  hasCapitalLetter: false,
                  isValid: false
                });
              }}>
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
