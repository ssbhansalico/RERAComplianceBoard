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

  return (
    <div
      ref={ref}
      className="w-full border-2 border-gray-800 text-black"
      style={{
        backgroundColor: bgColor,
        fontFamily: "'Noto Sans', 'Noto Sans Gujarati', sans-serif",
        fontSize: "10px",
        lineHeight: "1.4",
      }}
    >
      <div className="p-3">
        <div className="text-center mb-2 pb-1 border-b border-gray-600">
          <p className="text-[9px] font-semibold">
            ગુજરાત રી.એ. ઓથોરીટી હુકમ - ક્ર.૧૧૨, તા.૨૮.૧૧.૨૦૨૫ ના અધિન
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <div className="flex">
              <span className="w-[160px] font-semibold text-[9px]">પ્રોજેક્ટ નું નામ:</span>
              <span className="flex-1 text-[9px]" style={{ color: "#DC2626" }}>
                {data.projectName || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[160px] font-semibold text-[9px]">રેરા રજીસ્ટ્રેશન નંબર:</span>
              <span className="flex-1 text-[9px]" style={{ color: "#DC2626" }}>
                {data.reraRegistrationNumber || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[160px] font-semibold text-[9px]">પ્રમોટરનું નામ:</span>
              <span className="flex-1 text-[9px]" style={{ color: "#DC2626" }}>
                {data.promoterName || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[160px] font-semibold text-[9px]">પ્રમોટરનું અધિકૃત email ઈ.ડી.:</span>
              <span className="flex-1 text-[9px]" style={{ color: "#DC2626" }}>
                {data.authorizedEmail || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[160px] font-semibold text-[9px]">પ્રમોટરનું અધિકૃત મોબાઈલ નંબર:</span>
              <span className="flex-1 text-[9px]" style={{ color: "#DC2626" }}>
                {data.authorizedMobile || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex">
              <span className="w-[160px] font-semibold text-[9px]">પ્રોજેક્ટ ઓથોરાઈઝડ વ્યક્તિનું નામ:</span>
              <span className="flex-1 text-[9px]" style={{ color: "#DC2626" }}>
                {data.authorizedPersonName || "વિગત ભરો / Fill Details"}
              </span>
            </div>

            <div className="flex gap-4">
              <div className="flex">
                <span className="font-semibold text-[9px] mr-2">પ્રોજેક્ટ પૂર્ણ થવાની તારીખ:</span>
                <span className="text-[9px]" style={{ color: "#DC2626" }}>
                  {formatDate(data.completionDate)}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-[9px] mr-2">પ્રોજેક્ટ નો પ્રકાર:</span>
                <span className="text-[9px]" style={{ color: "#DC2626" }}>
                  {data.projectType || "Residential / Commercial / Mix"}
                </span>
              </div>
            </div>
          </div>

          <div className="w-[120px] flex flex-col items-center justify-start">
            <div className="text-right w-full mb-2 border border-gray-500 p-1.5 bg-white/50">
              <p className="text-[8px] font-semibold">ગુજરાત રેરાની અધિકૃત વેબ સાઈટ:</p>
              <p className="text-[8px] font-semibold" style={{ color: "#DC2626" }}>
                https://gujrera.gujarat.gov.in
              </p>
            </div>
            <div className="text-center mb-1">
              <p className="text-[7px] font-semibold">વેબ સાઈટ પરથી પ્રોજેક્ટ</p>
              <p className="text-[7px]">સર્ટિફિકેટ માહિતી</p>
              <p className="text-[7px]">મેળવવા QR Code</p>
            </div>
            <div
              className="w-[70px] h-[70px] border border-gray-600 bg-white flex items-center justify-center overflow-hidden"
            >
              {data.qrCodeImage ? (
                <img src={data.qrCodeImage} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <span className="text-[7px] text-gray-500 text-center p-1">QR Code<br/>Upload Required</span>
              )}
            </div>
            <p className="text-[6px] mt-0.5">Minimum 15cm x 15cm</p>
          </div>
        </div>

        <div className="mt-2 border border-gray-600">
          <div className="text-center py-0.5 bg-gray-200 border-b border-gray-600">
            <p className="text-[8px] font-semibold">
              બ્લોક નંબર અને તેમાં યુનિટની સંખ્યા
            </p>
          </div>
          <table className="w-full text-[8px]">
            <thead>
              <tr className="border-b border-gray-600 bg-gray-100">
                <th className="border-r border-gray-600 p-1 text-left">બ્લોક નો નંબર</th>
                <th className="border-r border-gray-600 p-1 text-center">શોપ્સની સંખ્યા</th>
                <th className="border-r border-gray-600 p-1 text-center">ઓફીસની સંખ્યા</th>
                <th className="p-1 text-center">રેસિડેન્શિયલની સંખ્યા</th>
              </tr>
            </thead>
            <tbody>
              {data.blocks.length > 0 ? (
                data.blocks.map((block, index) => (
                  <tr key={block.id} className={index < data.blocks.length - 1 ? "border-b border-gray-400" : ""}>
                    <td className="border-r border-gray-600 p-1" style={{ color: "#DC2626" }}>
                      {block.blockName || "-"}
                    </td>
                    <td className="border-r border-gray-600 p-1 text-center" style={{ color: "#DC2626" }}>
                      {block.shops || "0"}
                    </td>
                    <td className="border-r border-gray-600 p-1 text-center" style={{ color: "#DC2626" }}>
                      {block.offices || "0"}
                    </td>
                    <td className="p-1 text-center" style={{ color: "#DC2626" }}>
                      {block.residential || "0"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-1 text-center text-gray-500">
                    Add blocks using the form
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-2 space-y-1">
          <div className="border border-gray-600 p-1.5">
            <p className="text-[8px] font-semibold mb-0.5">પ્રોજેક્ટના સ્પેસિફિકેશનની વિગતો:</p>
            <p className="text-[8px]" style={{ color: "#DC2626" }}>
              {data.specifications || "વિગત ભરો / Fill Details"}
            </p>
          </div>

          <div className="border border-gray-600 p-1.5">
            <p className="text-[8px] font-semibold mb-0.5">પ્રોજેક્ટની એમેનિટીઝની વિગતો:</p>
            <p className="text-[8px]" style={{ color: "#DC2626" }}>
              {data.amenities || "વિગત ભરો / Fill Details"}
            </p>
          </div>
        </div>

        <div className="mt-2 border border-gray-600 p-1.5 space-y-1">
          <div className="flex">
            <span className="w-[200px] text-[8px] font-semibold">પ્રોજેક્ટ ના રેરા કલેક્શન બેંક એકાઉન્ટ નામ:</span>
            <span className="flex-1 text-[8px]" style={{ color: "#DC2626" }}>
              {data.bankAccountName || "વિગત ભરો / Fill Details"}
            </span>
          </div>
          <div className="flex">
            <span className="w-[200px] text-[8px] font-semibold">પ્રોજેક્ટ ના રેરા કલેક્શન બેંક એકાઉન્ટ નંબર:</span>
            <span className="flex-1 text-[8px]" style={{ color: "#DC2626" }}>
              {maskedAccountNumber || "***********XXXX"}
            </span>
            <span className="text-[7px] text-gray-600 ml-1">(ના નંબર છેલ્લા ૪ અંક જ દર્શાવો)</span>
          </div>
        </div>

        <div className="mt-2 border border-gray-600 p-1.5">
          <p className="text-[8px] font-semibold border-b border-gray-400 pb-0.5 mb-1">
            પ્રોજેક્ટ લોનની વિગતો
          </p>
          <div className="flex mb-0.5">
            <span className="w-[220px] text-[8px]">પ્રોજેક્ટ લોન બેંક / ફાયનાન્સ સંસ્થાનું નામ:</span>
            <span className="flex-1 text-[8px]" style={{ color: "#DC2626" }}>
              {loanBankDisplay}
            </span>
          </div>
          <div className="flex gap-6">
            <div className="flex">
              <span className="text-[8px] mr-1">પ્રોજેક્ટ લોનની રકમ:</span>
              <span className="text-[8px]" style={{ color: "#DC2626" }}>
                {loanAmountDisplay}
              </span>
            </div>
            <div className="flex">
              <span className="text-[8px] mr-1">પ્રોજેક્ટ લોન મંજૂરી તારીખ:</span>
              <span className="text-[8px]" style={{ color: "#DC2626" }}>
                {loanDateDisplay}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 border border-gray-600 p-1.5">
          <p className="text-[8px] font-bold mb-1 text-center">ખરીદનાર માટેની સૂચના</p>
          <ol className="text-[7px] space-y-1 list-decimal pl-3">
            <li>
              પ્રોજેક્ટ માટે કોઈ પણ રકમનાર કે પછી પેમેન્ટ થયા નાણાં નહીં પ્રોજેક્ટ ના રેરા કલેક્શન બેંક એકાઉન્ટ નામ{" "}
              <span style={{ color: "#DC2626" }} className="font-semibold">
                "{data.bankAccountName || "[Bank Name]"}"
              </span>{" "}
              ઉપરોક્ત ખાતા માં (Capital) રકમ જપ્તમ ના નામના કટીં ઉપરાવા રહેશો.
            </li>
            <li>
              પ્રોજેક્ટ માટે કોઈ પણ રકમનાર કથરત, ટ્રાન્સફર યુનિટની કિમતના ૩૦% નાણાંથી વધારે નાણાં ચુકવેલ હોય, તો પ્રમોટર ન્યું લોન, વેચ નાણાની ચુકવણી આપ, રેરાની વેબ સાઈટ પર અક્રસ્ટ્રક્ચર કાગર નિયત શ્રિત્તા કુંસર, રજીસ્ટર્ડ એગ્રીમેન્ટ ફોર સેલ (AFS) ચું કરાવો રહેશો.
            </li>
            <li>
              પર ઉપર તમામ વિગતો પ્રમોટર દ્વારા ગુજરાત રેરા સર રેલ એક્ટર અદ્યતનવેના ઉંધી કે, તેમાં તે બ પ્રાહી વિગતોની ચિકત કરવા કોઈ હોય તો, પર ચિકસ્યેલ ક્યુ.આર. કોડ સ્કેન કરાથી, થવા ગુજરાત રેરાની અધિકૃત વેબ સાઈટ પરથી માહિતી મેળવી શકશે.
            </li>
            <li>
              પ્રોજેક્ટ ની અંતી બાબતે પ્રમોટર ગુજરાત રેરાની વેબ સાઈટ પર અપલોડ કરેલ વિગતો પર ચિકસ્યેલ ક્યુ.આર. કોડ સ્કેન કરાથી, થવા ગુજરાત રેરાની અધિકૃત વેબ સાઈટ પરથી મળી શકશે.
            </li>
            <li>
              પ્રોજેક્ટ ની અંતી, કોઈ પણ રકમવાળે યુનિટની વિગતો, કોઈ પણ પૈસા પાડા નાણાં, આ બાબતે ન્યું લોનના ફરિયાદ હોય તો, ગુજરાત રેરાની અધિકૃત વેબ સાઈટ પર, નિયત ફોર્મમાં, નિયત શુક્લા કુંસર વિગતો/ઓનલાઈન રીતે ફરિયાદ દાખલ કરી શકશે.
            </li>
          </ol>
        </div>

        <div className="mt-2 text-center">
          <p className="text-[7px] font-semibold">
            હુકમ દ્વારા: ગુજરાત રીઅલ એસ્ટેટ રેગ્યુલેટરી ઓથોરીટી
          </p>
        </div>
      </div>
    </div>
  );
});

BoardPreview.displayName = "BoardPreview";

export default BoardPreview;
