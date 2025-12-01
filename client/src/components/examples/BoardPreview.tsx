import BoardPreview from "../BoardPreview";

export default function BoardPreviewExample() {
  const sampleData = {
    reraRegistrationNumber: "PR/GJ/AHMEDABAD/AHMEDABAD CITY/RAAR01234/R1/010120XX",
    projectName: "Sunrise Heights",
    promoterName: "ABC Developers Pvt. Ltd.",
    authorizedPersonName: "Mr. Rajesh Patel",
    authorizedEmail: "info@abcdevelopers.com",
    authorizedMobile: "+91 9876543210",
    projectType: "Residential",
    completionDate: "2027-12-31",
    blocks: [
      { id: "1", blockName: "A", shops: "5", offices: "0", residential: "40" },
      { id: "2", blockName: "B", shops: "0", offices: "0", residential: "36" },
    ],
    specifications: "RCC frame structure, Vitrified tiles in all rooms, UPVC windows, Concealed wiring with modular switches, Branded sanitary fittings",
    amenities: "Swimming Pool, Gymnasium, Club House, Landscaped Garden, Children's Play Area, 24/7 Security, Power Backup",
    bankAccountName: "Sunrise Heights RERA Collection Account",
    bankAccountNumber: "12345678901234",
    hasLoan: true,
    loanBankName: "State Bank of India",
    loanAmount: "15,00,00,000",
    loanDate: "2024-06-15",
    qrCodeImage: null,
    backgroundColor: "yellow" as const,
  };

  return (
    <div className="p-4 bg-background">
      <div className="max-w-2xl mx-auto">
        <BoardPreview data={sampleData} />
      </div>
    </div>
  );
}
