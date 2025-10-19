import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SuspensionData, getDoctorSuspensionCount } from "@/services/doctorService";
import { AlertTriangle, Trash2 } from "lucide-react";

interface SuspensionFormProps {
  doctorId: string;
  doctorName: string;
  onSubmit: (data: SuspensionData) => void;
  onCancel: () => void;
  onDoctorDeleted?: (message: string) => void;
  loading?: boolean;
}

export function SuspensionForm({ doctorId, doctorName, onSubmit, onCancel, onDoctorDeleted, loading = false }: SuspensionFormProps) {
  const [form, setForm] = useState<SuspensionData>({
    suspensionType: "temporary",
    severity: "major",
    reasons: [""],
    duration: 30,
    impact: {
      patientAccess: false,
      appointmentScheduling: false,
      prescriptionWriting: false,
      systemAccess: false
    },
    suspendedBy: "000000000000000000000000" // Default admin ID
  });

  const [suspensionCount, setSuspensionCount] = useState<{
    suspensionCount: number;
    isAtWarningThreshold: boolean;
    nextSuspensionWillDelete: boolean;
  } | null>(null);

  // Load suspension count on component mount
  useEffect(() => {
    const loadSuspensionCount = async () => {
      try {
        const countData = await getDoctorSuspensionCount(doctorId);
        setSuspensionCount({
          suspensionCount: countData.suspensionCount,
          isAtWarningThreshold: countData.isAtWarningThreshold,
          nextSuspensionWillDelete: countData.nextSuspensionWillDelete
        });
      } catch (error) {
        console.error("Error loading suspension count:", error);
      }
    };

    loadSuspensionCount();
  }, [doctorId]);

  const handleReasonChange = (index: number, value: string) => {
    const newReasons = [...form.reasons];
    newReasons[index] = value;
    setForm(prev => ({ ...prev, reasons: newReasons }));
  };

  const addReason = () => {
    setForm(prev => ({ ...prev, reasons: [...prev.reasons, ""] }));
  };

  const removeReason = (index: number) => {
    if (form.reasons.length > 1) {
      const newReasons = form.reasons.filter((_, i) => i !== index);
      setForm(prev => ({ ...prev, reasons: newReasons }));
    }
  };

  const handleImpactChange = (field: keyof typeof form.impact, checked: boolean) => {
    // If System Access is checked, automatically check all other options
    if (field === 'systemAccess' && checked) {
      setForm(prev => ({
        ...prev,
        impact: {
          patientAccess: true,
          appointmentScheduling: true,
          prescriptionWriting: true,
          systemAccess: true
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        impact: {
          ...prev.impact,
          [field]: checked
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty reasons
    const filteredReasons = form.reasons.filter(reason => reason.trim() !== "");
    if (filteredReasons.length === 0) {
      alert("Please provide at least one reason for suspension");
      return;
    }
    
    const submissionData = {
      ...form,
      reasons: filteredReasons
    };
    
    // Check if this is the 6th suspension and show confirmation
    if (suspensionCount?.nextSuspensionWillDelete) {
      const confirmed = window.confirm(
        `WARNING: This is the 6th suspension for ${doctorName}. This will result in automatic deletion of their account and all associated data. Are you sure you want to proceed?`
      );
      
      if (!confirmed) {
        return;
      }
    }
    
    onSubmit(submissionData);
    
    // If this is the 6th suspension, automatically close the popup after a short delay
    if (suspensionCount?.nextSuspensionWillDelete && onDoctorDeleted) {
      setTimeout(() => {
        onDoctorDeleted(`Doctor ${doctorName} has been automatically deleted due to 6th suspension`);
        onCancel();
      }, 1000);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-red-600">Suspend Doctor: {doctorName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Suspension Count Warnings */}
          {suspensionCount && (
            <>
              {suspensionCount.isAtWarningThreshold && !suspensionCount.nextSuspensionWillDelete && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Warning:</strong> This doctor has been suspended {suspensionCount.suspensionCount} times. 
                    They are approaching the automatic deletion threshold.
                  </AlertDescription>
                </Alert>
              )}
              
              {suspensionCount.nextSuspensionWillDelete && (
                <Alert className="border-red-200 bg-red-50">
                  <Trash2 className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>CRITICAL WARNING:</strong> This doctor has been suspended {suspensionCount.suspensionCount} times. 
                    <br />
                    <strong>Suspending them again will result in automatic deletion of their account and all associated data.</strong>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {/* Suspension Type */}
          <div>
            <Label htmlFor="suspensionType">Suspension Type</Label>
            <Select 
              value={form.suspensionType} 
              onValueChange={(value: "temporary" | "investigation") => 
                setForm(prev => ({ ...prev, suspensionType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temporary">Temporary</SelectItem>
                <SelectItem value="investigation">Under Investigation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Severity */}
          <div>
            <Label htmlFor="severity">Severity Level</Label>
            <Select 
              value={form.severity} 
              onValueChange={(value: "minor" | "moderate" | "major" | "critical") => 
                setForm(prev => ({ ...prev, severity: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reasons */}
          <div>
            <Label>Reasons for Suspension</Label>
            <div className="space-y-2">
              {form.reasons.map((reason, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={reason}
                    onChange={(e) => handleReasonChange(index, e.target.value)}
                    placeholder="Enter reason for suspension"
                    required={index === 0}
                  />
                  {form.reasons.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeReason(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addReason}
              >
                Add Another Reason
              </Button>
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration">Suspension Duration</Label>
            <Select 
              value={form.duration === -1 ? "indefinite" : form.duration.toString()} 
              onValueChange={(value) => {
                const duration = value === "indefinite" ? -1 : parseInt(value);
                setForm(prev => ({ ...prev, duration }));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">365 days</SelectItem>
                <SelectItem value="indefinite">Indefinite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Impact */}
          <div>
            <Label>System Access Impact</Label>
            <p className="text-xs text-muted-foreground mb-3">
              Checking "Restrict System Access" will automatically select all other restrictions
            </p>
            <div className="space-y-3 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="patientAccess"
                  checked={form.impact.patientAccess}
                  onCheckedChange={(checked) => handleImpactChange('patientAccess', checked as boolean)}
                />
                <Label htmlFor="patientAccess">Restrict Patient Access</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="appointmentScheduling"
                  checked={form.impact.appointmentScheduling}
                  onCheckedChange={(checked) => handleImpactChange('appointmentScheduling', checked as boolean)}
                />
                <Label htmlFor="appointmentScheduling">Restrict Appointment Scheduling</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prescriptionWriting"
                  checked={form.impact.prescriptionWriting}
                  onCheckedChange={(checked) => handleImpactChange('prescriptionWriting', checked as boolean)}
                />
                <Label htmlFor="prescriptionWriting">Restrict Prescription Writing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="systemAccess"
                  checked={form.impact.systemAccess}
                  onCheckedChange={(checked) => handleImpactChange('systemAccess', checked as boolean)}
                />
                <Label htmlFor="systemAccess">Restrict System Access</Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading}
            >
              {loading ? "Suspending..." : "Suspend Doctor"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
