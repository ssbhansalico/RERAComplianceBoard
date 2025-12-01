import { useState, useRef } from "react";
import { Download, FileImage, RotateCcw, Users } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import BilingualLabel from "./BilingualLabel";
import QRCodeUpload from "./QRCodeUpload";
import BlockTable, { type BlockEntry } from "./BlockTable";
import BackgroundToggle from "./BackgroundToggle";
import BoardPreview, { type BoardData } from "./BoardPreview";
import DownloadModal from "./DownloadModal";

export default function RERAForm() {
  const { toast } = useToast();
  const boardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [pendingDownloadType, setPendingDownloadType] = useState<"PNG" | "PDF">("PNG");

  const { data: usageStats } = useQuery<{ totalGenerations: number }>({
    queryKey: ["/api/stats/usage"],
    refetchInterval: 30000,
  });

  const [formData, setFormData] = useState<BoardData>({
    reraRegistrationNumber: "",
    projectName: "",
    promoterName: "",
    authorizedPersonName: "",
    authorizedEmail: "",
    authorizedMobile: "",
    projectType: "",
    completionDate: "",
    blocks: [{ id: crypto.randomUUID(), blockName: "", shops: "0", offices: "0", residential: "0" }],
    specifications: "",
    amenities: "",
    bankAccountName: "",
    bankAccountNumber: "",
    hasLoan: false,
    loanBankName: "",
    loanAmount: "",
    loanDate: "",
    qrCodeImage: null,
    backgroundColor: "yellow",
  });

  const saveGenerationMutation = useMutation({
    mutationFn: async (data: { userId: string; boardData: BoardData; downloadType: string }) => {
      const serializedBoardData = {
        ...data.boardData,
        blocks: data.boardData.blocks.map(block => ({
          id: block.id,
          blockName: block.blockName,
          shops: block.shops,
          offices: block.offices,
          residential: block.residential,
        })),
      };
      const response = await apiRequest("POST", "/api/generations", {
        userId: data.userId,
        boardData: serializedBoardData,
        downloadType: data.downloadType,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats/usage"] });
    },
  });

  const updateField = <K extends keyof BoardData>(field: K, value: BoardData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all form data?")) {
      setFormData({
        reraRegistrationNumber: "",
        projectName: "",
        promoterName: "",
        authorizedPersonName: "",
        authorizedEmail: "",
        authorizedMobile: "",
        projectType: "",
        completionDate: "",
        blocks: [{ id: crypto.randomUUID(), blockName: "", shops: "0", offices: "0", residential: "0" }],
        specifications: "",
        amenities: "",
        bankAccountName: "",
        bankAccountNumber: "",
        hasLoan: false,
        loanBankName: "",
        loanAmount: "",
        loanDate: "",
        qrCodeImage: null,
        backgroundColor: "yellow",
      });
      toast({
        title: "Form Reset",
        description: "All fields have been cleared.",
      });
    }
  };

  const handleDownloadClick = (type: "PNG" | "PDF") => {
    setPendingDownloadType(type);
    setShowDownloadModal(true);
  };

  const captureBoard = async (): Promise<HTMLCanvasElement | null> => {
    if (!boardRef.current) return null;
    
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    document.body.appendChild(container);
    
    const clonedBoard = boardRef.current.cloneNode(true) as HTMLElement;
    clonedBoard.style.transform = "none";
    clonedBoard.style.width = "800px";
    container.appendChild(clonedBoard);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const canvas = await html2canvas(clonedBoard, {
        scale: 6,
        useCORS: true,
        backgroundColor: formData.backgroundColor === "yellow" ? "#FDE047" : "#FFFFFF",
        logging: false,
      });
      return canvas;
    } finally {
      document.body.removeChild(container);
    }
  };

  const downloadAsPNG = async (userId: string) => {
    if (!boardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await captureBoard();
      if (!canvas) throw new Error("Failed to capture board");

      const link = document.createElement("a");
      link.download = `RERA_Board_${formData.reraRegistrationNumber || "draft"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      saveGenerationMutation.mutate({
        userId: userId,
        boardData: formData,
        downloadType: "PNG",
      });

      toast({
        title: "Download Complete",
        description: "Board saved as high-resolution PNG image.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not generate the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsPDF = async (userId: string) => {
    if (!boardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await captureBoard();
      if (!canvas) throw new Error("Failed to capture board");

      const imgData = canvas.toDataURL("image/png");
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const aspectRatio = canvasHeight / canvasWidth;
      
      const pdfWidthMM = 1200;
      const pdfHeightMM = Math.round(pdfWidthMM * aspectRatio);
      
      const pdf = new jsPDF({
        orientation: pdfHeightMM > pdfWidthMM ? "portrait" : "landscape",
        unit: "mm",
        format: [pdfWidthMM, pdfHeightMM],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidthMM, pdfHeightMM);
      pdf.save(`RERA_Board_${formData.reraRegistrationNumber || "draft"}.pdf`);

      saveGenerationMutation.mutate({
        userId: userId,
        boardData: formData,
        downloadType: "PDF",
      });

      toast({
        title: "Download Complete",
        description: "Board saved as PDF document (1.2m width).",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not generate the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadWithUserId = (userId: string) => {
    if (pendingDownloadType === "PNG") {
      downloadAsPNG(userId);
    } else {
      downloadAsPDF(userId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Gujarat RERA Information Board Generator
              </h1>
              <p className="text-sm text-muted-foreground" lang="gu" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
                ગુજરાત રેરા માહિતી બોર્ડ જનરેટર - હુકમ ક્ર.૧૧૨
              </p>
            </div>
            {usageStats && (
              <Badge variant="secondary" className="gap-1 hidden sm:flex">
                <Users className="h-3 w-3" />
                {usageStats.totalGenerations} boards generated
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Developed by BNPS and Associates LLP. This tool is provided for convenience and assistance only. 
            We do not assume any liability for errors, omissions, or non-compliance. 
            Verification of the final output against GujRERA Order No. 112 is the sole responsibility of the user.
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
            <div className="flex gap-2 flex-wrap sm:ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1"
                data-testid="button-reset"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadClick("PNG")}
                disabled={isGenerating}
                className="gap-1"
                data-testid="button-download-png"
              >
                <FileImage className="h-4 w-4" />
                PNG
              </Button>
              <Button
                size="sm"
                onClick={() => handleDownloadClick("PDF")}
                disabled={isGenerating}
                className="gap-1"
                data-testid="button-download-pdf"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Accordion type="multiple" defaultValue={["basic", "blocks", "specs", "financial", "loan"]} className="space-y-3">
              <AccordionItem value="basic" className="border rounded-md px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  1. Basic Project Information / મૂળભૂત પ્રોજેક્ટ માહિતી
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <BackgroundToggle
                    value={formData.backgroundColor}
                    onChange={(val) => updateField("backgroundColor", val)}
                  />

                  <div className="space-y-1.5">
                    <BilingualLabel
                      english="RERA Registration Number"
                      gujarati="રેરા રજીસ્ટ્રેશન નંબર"
                      htmlFor="reraNumber"
                      required
                    />
                    <Input
                      id="reraNumber"
                      value={formData.reraRegistrationNumber}
                      onChange={(e) => updateField("reraRegistrationNumber", e.target.value)}
                      placeholder="e.g., PR/GJ/AHMEDABAD/AHMEDABAD CITY/RAAR01234/R1/010120XX"
                      data-testid="input-rera-number"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <BilingualLabel
                      english="Project Name"
                      gujarati="પ્રોજેક્ટનું નામ"
                      htmlFor="projectName"
                      required
                    />
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => updateField("projectName", e.target.value)}
                      placeholder="Enter project name"
                      data-testid="input-project-name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <BilingualLabel
                      english="Promoter Name"
                      gujarati="પ્રમોટરનું નામ"
                      htmlFor="promoterName"
                      required
                    />
                    <Input
                      id="promoterName"
                      value={formData.promoterName}
                      onChange={(e) => updateField("promoterName", e.target.value)}
                      placeholder="Enter promoter/developer name"
                      data-testid="input-promoter-name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <BilingualLabel
                      english="Promoter's Authorized Email ID"
                      gujarati="પ્રમોટરનો અધિક્રુત ઇ-મેઇલ આઇ.ડી."
                      htmlFor="authorizedEmail"
                      required
                    />
                    <Input
                      id="authorizedEmail"
                      type="email"
                      value={formData.authorizedEmail}
                      onChange={(e) => updateField("authorizedEmail", e.target.value)}
                      placeholder="email@example.com"
                      data-testid="input-authorized-email"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <BilingualLabel
                      english="Promoter's Authorized Mobile Number"
                      gujarati="પ્રમોટરનો અધિક્રુત મોબાઈલ નંબર"
                      htmlFor="authorizedMobile"
                      required
                    />
                    <Input
                      id="authorizedMobile"
                      type="tel"
                      value={formData.authorizedMobile}
                      onChange={(e) => updateField("authorizedMobile", e.target.value)}
                      placeholder="+91 9876543210"
                      data-testid="input-authorized-mobile"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <BilingualLabel
                      english="Authorized Signatory Person Name"
                      gujarati="ઑથોરાઇઝ્ડ સીગ્નેટરી વ્યકિતનું નામ"
                      htmlFor="authorizedPerson"
                      required
                    />
                    <Input
                      id="authorizedPerson"
                      value={formData.authorizedPersonName}
                      onChange={(e) => updateField("authorizedPersonName", e.target.value)}
                      placeholder="Enter authorized person's full name"
                      data-testid="input-authorized-person"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <BilingualLabel
                        english="Project Construction Usage"
                        gujarati="પ્રોજેક્ટના બાંધકામનો ઉપયોગ"
                        htmlFor="projectType"
                        required
                      />
                      <Select
                        value={formData.projectType}
                        onValueChange={(val) => updateField("projectType", val)}
                      >
                        <SelectTrigger id="projectType" data-testid="select-project-type">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Residential">Residential / રેસિડેન્શિયલ</SelectItem>
                          <SelectItem value="Commercial">Commercial / કોમર્શિયલ</SelectItem>
                          <SelectItem value="Mix">Mix / મિક્સ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <BilingualLabel
                        english="Proposed Completion Date"
                        gujarati="પૂર્ણ થવાની તારીખ"
                        htmlFor="completionDate"
                        required
                      />
                      <Input
                        id="completionDate"
                        type="date"
                        value={formData.completionDate}
                        onChange={(e) => updateField("completionDate", e.target.value)}
                        data-testid="input-completion-date"
                      />
                    </div>
                  </div>

                  <QRCodeUpload
                    imageUrl={formData.qrCodeImage}
                    onImageChange={(url) => updateField("qrCodeImage", url)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="blocks" className="border rounded-md px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  2. Block Details / બ્લોક વિગતો
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <BlockTable
                    blocks={formData.blocks}
                    onBlocksChange={(blocks) => updateField("blocks", blocks)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="specs" className="border rounded-md px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  3. Project Specifications / પ્રોજેક્ટ સ્પેસિફિકેશન
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <div className="space-y-1.5">
                    <BilingualLabel
                      english="Project Specifications"
                      gujarati="પ્રોજેક્ટના સ્પેસિફિકેશનની વિગતો"
                      htmlFor="specifications"
                      required
                    />
                    <Textarea
                      id="specifications"
                      value={formData.specifications}
                      onChange={(e) => updateField("specifications", e.target.value)}
                      placeholder="Enter construction specifications (e.g., RCC structure, branded fittings, etc.)"
                      rows={4}
                      data-testid="input-specifications"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <BilingualLabel
                      english="Project Amenities"
                      gujarati="પ્રોજેક્ટની એમેનિટીઝની વિગતો"
                      htmlFor="amenities"
                      required
                    />
                    <Textarea
                      id="amenities"
                      value={formData.amenities}
                      onChange={(e) => updateField("amenities", e.target.value)}
                      placeholder="Enter amenities (e.g., Swimming Pool, Gym, Garden, Club House, etc.)"
                      rows={4}
                      data-testid="input-amenities"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="financial" className="border rounded-md px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  4. Financial Information / નાણાકીય માહિતી
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <div className="space-y-1.5">
                    <BilingualLabel
                      english="RERA Collection Bank Account Name"
                      gujarati="રેરા કલેક્શન બેંક એકાઉન્ટ નામ"
                      htmlFor="bankAccountName"
                      required
                    />
                    <Input
                      id="bankAccountName"
                      value={formData.bankAccountName}
                      onChange={(e) => updateField("bankAccountName", e.target.value)}
                      placeholder="e.g., ABC Project - RERA Collection Account"
                      data-testid="input-bank-name"
                    />
                    <p className="text-xs text-muted-foreground">
                      This name will be auto-populated in Important Note #1
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <BilingualLabel
                      english="RERA Collection Bank Account Number"
                      gujarati="રેરા કલેક્શન બેંક એકાઉન્ટ નંબર"
                      htmlFor="bankAccountNumber"
                      required
                    />
                    <Input
                      id="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={(e) => updateField("bankAccountNumber", e.target.value)}
                      placeholder="Enter full account number (only last 4 digits will be shown)"
                      data-testid="input-bank-account"
                    />
                    <p className="text-xs text-muted-foreground">
                      Only the last 4 digits will be displayed on the board for security
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="loan" className="border rounded-md px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  5. Loan Information / લોન માહિતી
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Does the project have a loan?</Label>
                    <RadioGroup
                      value={formData.hasLoan ? "yes" : "no"}
                      onValueChange={(val) => updateField("hasLoan", val === "yes")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="loan-yes" />
                        <Label htmlFor="loan-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="loan-no" />
                        <Label htmlFor="loan-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.hasLoan && (
                    <>
                      <div className="space-y-1.5">
                        <BilingualLabel
                          english="Loan Bank / Financial Institution Name"
                          gujarati="લોન બેંક / નાણા સંસ્થાનું નામ"
                          htmlFor="loanBankName"
                          required
                        />
                        <Input
                          id="loanBankName"
                          value={formData.loanBankName}
                          onChange={(e) => updateField("loanBankName", e.target.value)}
                          placeholder="Enter bank or financial institution name"
                          data-testid="input-loan-bank"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <BilingualLabel
                            english="Loan Amount"
                            gujarati="લોનની રકમ"
                            htmlFor="loanAmount"
                            required
                          />
                          <Input
                            id="loanAmount"
                            value={formData.loanAmount}
                            onChange={(e) => updateField("loanAmount", e.target.value)}
                            placeholder="e.g., 10,00,00,000"
                            data-testid="input-loan-amount"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <BilingualLabel
                            english="Loan Date"
                            gujarati="લોન લીધા તારીખ"
                            htmlFor="loanDate"
                            required
                          />
                          <Input
                            id="loanDate"
                            type="date"
                            value={formData.loanDate}
                            onChange={(e) => updateField("loanDate", e.target.value)}
                            data-testid="input-loan-date"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Live Preview</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    PDF: 1.2m width | QR: 22.5cm
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div 
                  className="overflow-auto border rounded-md"
                  style={{ maxHeight: "calc(100vh - 180px)" }}
                >
                  <div style={{ 
                    width: "640px",
                    overflow: "hidden"
                  }}>
                    <div style={{ 
                      transform: "scale(0.8)", 
                      transformOrigin: "top left",
                    }}>
                      <BoardPreview ref={boardRef} data={formData} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t bg-card py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            B N P S and Associates LLP
          </p>
          <p className="text-sm text-muted-foreground">
            www.bnpsca.com
          </p>
        </div>
      </footer>

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownload={handleDownloadWithUserId}
        downloadType={pendingDownloadType}
      />
    </div>
  );
}
