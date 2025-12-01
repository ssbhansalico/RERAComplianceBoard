import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AuthModalProps {
  isOpen: boolean;
  onAuthenticated: (user: { id: string; name: string; email: string; mobile: string }) => void;
}

export default function AuthModal({ isOpen, onAuthenticated }: AuthModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("rera_user", JSON.stringify(data.user));
      toast({
        title: data.isExisting ? "Welcome back!" : "Registration successful",
        description: data.isExisting 
          ? `Logged in as ${data.user.name}` 
          : "You can now use the RERA Board Generator.",
      });
      onAuthenticated(data.user);
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "Please check your details and try again.",
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/[^0-9]/g, ""))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      registerMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent 
        className="sm:max-w-md [&>button]:hidden" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://bnpsca.com/public/assets/upload/images/original/686662b76f81b-Screenshot-250.png" 
              alt="BNPS and Associates LLP" 
              className="h-16 object-contain"
            />
          </div>
          <DialogTitle className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Welcome to RERA Board Generator
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Please provide your details to continue using this tool
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="auth-name">Full Name *</Label>
            <Input
              id="auth-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              data-testid="input-auth-name"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email Address *</Label>
            <Input
              id="auth-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              data-testid="input-auth-email"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="auth-mobile">Mobile Number *</Label>
            <Input
              id="auth-mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="10-digit mobile number"
              data-testid="input-auth-mobile"
            />
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={registerMutation.isPending}
            data-testid="button-auth-submit"
          >
            {registerMutation.isPending ? "Please wait..." : "Continue to Generator"}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree that your information will be stored for usage tracking purposes.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
