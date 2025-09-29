import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import medicalHero from "@/assets/admin-hero.jpg";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero image and branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow to-medical-teal"
          style={{
            backgroundImage: `url(${medicalHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        />
        
      </div>

      {/* Right side - Login/Signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <div>
              {/* Replace with your real SignupForm component */}
              <p className="text-center text-muted-foreground">
                Signup form coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
