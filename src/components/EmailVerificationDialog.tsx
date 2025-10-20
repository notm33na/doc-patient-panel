import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Clock, RefreshCw } from "lucide-react";
import axios from "axios";

interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedAdmin: any) => void;
  newEmail: string;
  currentEmail: string;
}

export default function EmailVerificationDialog({
  isOpen,
  onClose,
  onSuccess,
  newEmail,
  currentEmail,
}: EmailVerificationDialogProps) {
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [otpSent, setOtpSent] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && otpSent) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, otpSent]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Send OTP when dialog opens
  useEffect(() => {
    if (isOpen && !otpSent) {
      sendOTP();
    }
  }, [isOpen]);

  const sendOTP = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/admins/request-email-verification',
        { newEmail },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setOtpSent(true);
      setTimeLeft(600); // Reset timer
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${newEmail}`,
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      toast({
        title: "Failed to send OTP",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const resendOTP = async () => {
    try {
      setResendLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      await axios.post(
        'http://localhost:5000/api/admins/resend-email-verification',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setTimeLeft(600); // Reset timer
      
      toast({
        title: "OTP Resent",
        description: `New verification code sent to ${newEmail}`,
      });
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
      setError(errorMessage);
      toast({
        title: "Failed to resend OTP",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/admins/complete-email-change',
        { newEmail, otp },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Email Changed Successfully",
        description: `Your email has been updated to ${newEmail}`,
      });

      onSuccess(response.data.admin);
      onClose();
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to verify OTP';
      setError(errorMessage);
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOtp("");
    setError(null);
    setOtpSent(false);
    setTimeLeft(600);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Verify Email Change
          </DialogTitle>
          <DialogDescription>
            We've sent a 6-digit verification code to <strong>{newEmail}</strong>.
            Enter the code below to complete your email change.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>

          {otpSent && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resendOTP}
                disabled={resendLoading || timeLeft > 0}
                className="h-auto p-1"
              >
                {resendLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-1">Resend</span>
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Current email:</strong> {currentEmail}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>New email:</strong> {newEmail}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={verifyOTP} 
            disabled={loading || !otp || otp.length !== 6}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Change'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
