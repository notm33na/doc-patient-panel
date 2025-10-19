import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import medicalHero from "@/assets/admin-hero.jpg";

export default function ResetPassword() {
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

      {/* Right side - Reset password form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
