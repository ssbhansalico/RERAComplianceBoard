import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (userId: string) => void;
  downloadType: "PNG" | "PDF";
}

export default function DownloadModal({ isOpen, onClose, onDownload, downloadType }: DownloadModalProps) {
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
      queryClient.invalidateQueries({ queryKey: ["/api/stats/usage"] });
      toast({
        title: "Download starting...",
        description: `Your ${downloadType} is being generated.`,
      });
      onDownload(data.user.id);
      onClose();
      setFormData({ name: "", email: "", mobile: "" });
    },
    onError: () => {
      toast({
        title: "Failed to process",
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

  const handleClose = () => {
    onClose();
    setFormData({ name: "", email: "", mobile: "" });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Download {downloadType}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Please provide your details to download the board
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="download-name">Full Name *</Label>
            <Input
              id="download-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              data-testid="input-download-name"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="download-email">Email Address *</Label>
            <Input
              id="download-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              data-testid="input-download-email"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="download-mobile">Mobile Number *</Label>
            <Input
              id="download-mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="10-digit mobile number"
              data-testid="input-download-mobile"
            />
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={registerMutation.isPending}
              data-testid="button-download-submit"
            >
              {registerMutation.isPending ? "Processing..." : `Download ${downloadType}`}
            </Button>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-center text-muted-foreground">
              <strong>Disclaimer:</strong> The data submitted is not stored permanently. 
              Contact details are collected for research purposes only and will not be shared with third parties.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
