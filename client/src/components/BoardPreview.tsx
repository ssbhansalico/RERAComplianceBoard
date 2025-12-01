import { forwardRef } from "react";
import type { BlockEntry } from "./BlockTable";

export interface BoardData {
  reraRegistrationNumber: string;
  projectName: string;
  promoterName: string;
  authorizedPersonName: string;
  authorizedEmail: string;
  authorizedMobile: string;
  projectType: string;
  completionDate: string;
  blocks: BlockEntry[];
  specifications: string;
  amenities: string;
  bankAccountName: string;
  bankAccountNumber: string;
  hasLoan: boolean;
  loanBankName: string;
  loanAmount: string;
  loanDate: string;
  qrCodeImage: string | null;
  backgroundColor: "yellow" | "white";
}

interface BoardPreviewProps {
  data: BoardData;
}

const BoardPreview = forwardRef<HTMLDivElement, BoardPreviewProps>(({ data }, ref) => {
  const bgColor = data.backgroundColor === "yellow" ? "#FDE047" : "#FFFFFF";
  const maskedAccountNumber = data.bankAccountNumber
    ? "***********" + data.bankAccountNumber.slice(-4)
    : "";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "DD-MM-YYYY";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const loanBankDisplay = data.hasLoan ? data.loanBankName || "વિગત ભરો" : "Not Applicable";
  const loanAmountDisplay = data.hasLoan ? (data.loanAmount ? `₹ ${data.loanAmount}` : "વિગત ભરો") : "Not Applicable";
  const loanDateDisplay = data.hasLoan ? formatDate(data.loanDate) : "Not Applicable";

  const bankNameUppercase = data.bankAccountName ? data.bankAccountName.toUpperCase() : "[BANK NAME]";

  return (
    <div
      ref={ref}
      className="border-4 border-gray-800 text-black overflow-hidden"
      style={{
        width: "800px",
        backgroundColor: bgColor,
        fontFamily: "'Noto Sans Gujarati', 'Noto Sans', sans-serif",
        fontSize: "14px",
        lineHeight: "1.5",
      }}
    >
      <div className="p-4">
        <div className="text-center mb-3 pb-2 border-b-2 border-gray-600">
          <p className="text-[14px] font-bold">
            ગુજરાત રી.એ. ઓથોરીટી હુકમ - ક્ર.૧૧૨, તા.૨૮.૧૧.૨૦૨૫ ના અધિન
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex">
              <span className="w-[200px] flex-shrink-0 font-bold text-[14px]">પ્રોજેક્ટ નું નામ:</span>
              <span className="flex-1 min-w-0 text-[14px] break-words" style={{ color: "#DC2626" }}>
                {data.projectName || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[200px] flex-shrink-0 font-bold text-[14px]">રેરા રજીસ્ટ્રેશન નંબર:</span>
              <span className="flex-1 min-w-0 text-[14px] break-words" style={{ color: "#DC2626" }}>
                {data.reraRegistrationNumber || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[200px] flex-shrink-0 font-bold text-[14px]">પ્રમોટરનું નામ:</span>
              <span className="flex-1 min-w-0 text-[14px] break-words" style={{ color: "#DC2626" }}>
                {data.promoterName || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[200px] flex-shrink-0 font-bold text-[14px]">પ્રમોટરનો અધિક્રુત ઇ-મેઇલ આઇ.ડી.:</span>
              <span className="flex-1 min-w-0 text-[14px] break-words" style={{ color: "#DC2626" }}>
                {data.authorizedEmail || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[200px] flex-shrink-0 font-bold text-[14px]">પ્રમોટરનો અધિક્રુત મોબાઈલ નંબર:</span>
              <span className="flex-1 min-w-0 text-[14px] break-words" style={{ color: "#DC2626" }}>
                {data.authorizedMobile || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[200px] flex-shrink-0 font-bold text-[14px]">ઑથોરાઇઝ્ડ સીગ્નેટરી વ્યકિતનું નામ:</span>
              <span className="flex-1 min-w-0 text-[14px] break-words" style={{ color: "#DC2626" }}>
                {data.authorizedPersonName || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <div className="flex">
                <span className="font-bold text-[14px] mr-2">પ્રોજેક્ટ પૂર્ણ થવાની તારીખ:</span>
                <span className="text-[14px]" style={{ color: "#DC2626" }}>
                  {formatDate(data.completionDate)}
                </span>
              </div>
              <div className="flex">
                <span className="font-bold text-[14px] mr-2">પ્રોજેક્ટના બાંધકામનો ઉપયોગ:</span>
                <span className="text-[14px]" style={{ color: "#DC2626" }}>
                  {data.projectType || "Residential / Commercial / Mix"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col items-center justify-start" style={{ width: "12.5%" }}>
            <div className="text-center w-full mb-1 border border-gray-500 p-1 bg-white/50">
              <p className="text-[9px] font-bold leading-tight">ગુજરાત રેરાની અધિકૃત વેબ સાઈટ:</p>
              <p className="text-[8px] font-bold leading-tight" style={{ color: "#DC2626" }}>
                https://gujrera.gujarat.gov.in
              </p>
            </div>
            <div className="text-center mb-1">
              <p className="text-[8px] font-bold leading-tight">વેબ સાઈટ પરથી પ્રોજેક્ટ</p>
              <p className="text-[8px] leading-tight">સર્ટિફિકેટ માહિતી</p>
              <p className="text-[8px] leading-tight">મેળવવા QR Code</p>
            </div>
            <div
              className="qr-code-container bg-white overflow-hidden aspect-square w-full"
              style={{
                border: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {data.qrCodeImage ? (
                <img 
                  src={data.qrCodeImage} 
                  alt="QR Code" 
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "fill",
                    display: "block",
                    margin: 0,
                    padding: 0,
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-dashed border-gray-400">
                  <span className="text-[8px] text-gray-500 text-center">QR Code<br/>Upload</span>
                </div>
              )}
            </div>
            <p className="text-[7px] mt-0.5 font-medium text-gray-600">15cm x 15cm</p>
          </div>
        </div>

        <div className="mt-3 border-2 border-gray-600">
          <div className="text-center py-1 bg-gray-200 border-b-2 border-gray-600">
            <p className="text-[13px] font-bold">
              બ્લોક અને ઉપયોગ મુજબ યુનીટની સંખ્યા
            </p>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b-2 border-gray-600 bg-gray-100">
                <th className="border-r-2 border-gray-600 p-1.5 text-left font-bold">બ્લોક નંબર</th>
                <th className="border-r-2 border-gray-600 p-1.5 text-center font-bold">દુકાનની સંખ્યા</th>
                <th className="border-r-2 border-gray-600 p-1.5 text-center font-bold">ઓફીસની સંખ્યા</th>
                <th className="p-1.5 text-center font-bold">રહેઠાણની સંખ્યા</th>
              </tr>
            </thead>
            <tbody>
              {data.blocks.length > 0 ? (
                data.blocks.map((block, index) => (
                  <tr key={block.id} className={index < data.blocks.length - 1 ? "border-b border-gray-400" : ""}>
                    <td className="border-r-2 border-gray-600 p-1.5" style={{ color: "#DC2626" }}>
                      {block.blockName || "-"}
                    </td>
                    <td className="border-r-2 border-gray-600 p-1.5 text-center" style={{ color: "#DC2626" }}>
                      {block.shops || "0"}
                    </td>
                    <td className="border-r-2 border-gray-600 p-1.5 text-center" style={{ color: "#DC2626" }}>
                      {block.offices || "0"}
                    </td>
                    <td className="p-1.5 text-center" style={{ color: "#DC2626" }}>
                      {block.residential || "0"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-2 text-center text-gray-500">
                    Add blocks using the form
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 space-y-2">
          <div className="border-2 border-gray-600 p-2">
            <p className="text-[13px] font-bold mb-1">પ્રોજેક્ટના સ્પેસિફિકેશનની વિગતો:</p>
            <p className="text-[12px] break-words" style={{ color: "#DC2626" }}>
              {data.specifications || "વિગત ભરો / Fill Details"}
            </p>
          </div>

          <div className="border-2 border-gray-600 p-2">
            <p className="text-[13px] font-bold mb-1">પ્રોજેક્ટની એમેનિટીઝની વિગતો:</p>
            <p className="text-[12px] break-words" style={{ color: "#DC2626" }}>
              {data.amenities || "વિગત ભરો / Fill Details"}
            </p>
          </div>
        </div>

        <div className="mt-3 border-2 border-gray-600 p-2 space-y-1.5">
          <div className="flex flex-wrap">
            <span className="w-[240px] flex-shrink-0 text-[13px] font-bold">પ્રોજેક્ટ ના રેરા કલેક્શન બેંક એકાઉન્ટ નામ:</span>
            <span className="flex-1 min-w-0 text-[13px] break-words" style={{ color: "#DC2626" }}>
              {data.bankAccountName || "વિગત ભરો / Fill Details"}
            </span>
          </div>
          <div className="flex flex-wrap">
            <span className="w-[240px] flex-shrink-0 text-[13px] font-bold">પ્રોજેક્ટ ના રેરા કલેક્શન બેંક એકાઉન્ટ નંબર:</span>
            <span className="text-[13px]" style={{ color: "#DC2626" }}>
              {maskedAccountNumber || "***********XXXX"}
            </span>
            <span className="text-[11px] text-gray-600 ml-2">(ના નંબર છેલ્લા ૪ અંક જ દર્શાવો)</span>
          </div>
        </div>

        <div className="mt-3 border-2 border-gray-600 p-2">
          <p className="text-[13px] font-bold border-b border-gray-400 pb-1 mb-2">
            પ્રોજેક્ટ લોનની વિગતો
          </p>
          <div className="flex flex-wrap mb-1">
            <span className="w-[280px] flex-shrink-0 text-[13px] font-bold">પ્રોજેક્ટ લોન આપનાર બેંક / નાણા સંસ્થાનું નામ:</span>
            <span className="flex-1 min-w-0 text-[13px] break-words" style={{ color: "#DC2626" }}>
              {loanBankDisplay}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            <div className="flex">
              <span className="text-[13px] font-bold mr-2">પ્રોજેક્ટ લોનની રકમ:</span>
              <span className="text-[13px]" style={{ color: "#DC2626" }}>
                {loanAmountDisplay}
              </span>
            </div>
            <div className="flex">
              <span className="text-[13px] font-bold mr-2">પ્રોજેક્ટ લોન લીધા તારીખ:</span>
              <span className="text-[13px]" style={{ color: "#DC2626" }}>
                {loanDateDisplay}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 border-2 border-gray-600 p-2">
          <p className="text-[14px] font-bold mb-2 text-center border-b border-gray-400 pb-1">એલોટીઓને જાહેર સુચના</p>
          <ol className="text-[12px] space-y-2 list-decimal pl-4">
            <li>
              આ પ્રોજેક્ટમાં બુકીંગ કરાવનાર વ્યકિતએ બુકીંગ પેટે આપવાના થતા નાણા{" "}
              <span style={{ color: "#DC2626" }} className="font-bold">
                "{bankNameUppercase}"
              </span>{" "}
              ના નામના ચેકથી જ આપવાના રહેશે.
            </li>
            <li style={{ color: "#DC2626" }}>
              આ પ્રોજેક્ટમાં બુકીંગ કરાવનાર વ્યકિતએ, જ્યારે યુનીટની કિંમતના ૧૦% નાણાથી વધારે નાણા ચુકવેલ હોય, તો પ્રમોટરે અને એલોટીએ, વધુ નાણાની ચુકવણી અગાઉ, રેરાની વેબ સાઈટ ઉપર પ્રસિદ્ધ કરવામાં આવેલ નિયત મુસદ્દા અનુસાર, રજીસ્ટર્ડ એગ્રીમેન્ટ ફોર સેલ (AFS) અચૂક કરવાનો રહેશે.
            </li>
            <li>
              ઉપર જણાવેલ તમામ વિગતો પ્રમોટર દ્વારા ગુજરાત રેરા સમક્ષ રજૂ કરેલ દસ્તાવેજો મુજબની જ છે, તેમ છતાં કોઇ ગ્રાહક આ વિગતોની ચકાસણી કરવા ઇચ્છુક હોય તો, ઉપર દર્શાવેલ ક્યુ.આર. કોડ સ્કેન કરવાથી, અથવા ગુજરાત રેરાની અધિક્રુત વેબ સાઇટ ઉપરથી માહીતિ મેળવી શક્શે.
            </li>
            <li>
              આ પ્રોજેક્ટની પ્રગતી બાબતે પ્રમોટરે ગુજરાત રેરાની વેબ સાઇટ ઉપર અપલોડ કરેલ વિગતો ઉપર દર્શાવેલ ક્યુ.આર. કોડ સ્કેન કરવાથી, અથવા ગુજરાત રેરાની અધિક્રુત વેબ સાઇટ ઉપરથી જાણી શકાશે.
            </li>
            <li>
              આ પ્રોજેક્ટની પ્રગતી, બુકીંગ કરાવેલ યુનીટની વિગતો, બુકીંગ પેટે આપેલા નાણા, કે અન્ય કોઇ બાબતે જે તે એલોટીને ફરીયાદ હોય તો, ગુજરાત રેરાની અધિક્રુત વેબ સાઇટ ઉપર જઇને, નિયત ફી ભરીને, નિયત મુસદા અનુસાર વિગતો/પુરાવા રજૂ કરીને ફરીયાદ દાખલ કરી શકશે.
            </li>
          </ol>
        </div>

        <div className="mt-4 pt-2 border-t border-gray-400 text-center space-y-1">
          <p className="text-[10px] text-gray-600 italic">
            Generated by tool developed by BNPS and Associates LLP | www.bnpsca.com
          </p>
          <p className="text-[9px] text-gray-500">
            This tool is provided for convenience only. Verification against GujRERA Order No. 112 is the user's responsibility.
          </p>
        </div>
      </div>
    </div>
  );
});

BoardPreview.displayName = "BoardPreview";

export default BoardPreview;
