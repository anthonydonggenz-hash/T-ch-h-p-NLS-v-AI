import { ResultData } from "../types";

const callGemini = async (prompt: string, options: { isJson?: boolean, model?: string } = {}) => {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        isJson: options.isJson,
        model: options.model
      })
    });
    
    if (!response.ok) {
      const text = await response.text();
      let errorMessage = "Lỗi khi gọi AI từ máy chủ.";
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        errorMessage = text.length > 0 ? (text.substring(0, 200) + (text.length > 200 ? "..." : "")) : errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("Gemini Proxy Error:", error);
    throw error;
  }
};

export const suggestFromContent = async (
  topic: string,
  subject: string,
  grade: string,
  fileData?: { data: string, mimeType: string },
  isIntegration: boolean = false
): Promise<string> => {
  try {
    let prompt = `Bạn là trợ lý giảng dạy AI. 
  NHIỆM VỤ: ${isIntegration ? 'Trích xuất TOÀN BỘ nội dung giáo án từ tài liệu đã tải lên.' : 'Phân tích tài liệu và đề xuất nội dung chi tiết cho bài dạy:'}
  Môn: ${subject}
  Lớp: ${grade}
  Chủ đề: ${topic}
  
  Yêu cầu: 
  ${isIntegration 
    ? 'HÃY TRÍCH XUẤT 100% VĂN BẢN (KHÔNG TÓM TẮT, KHÔNG LƯỢC BỚT) có trong file giáo án của giáo viên. Mục tiêu là lấy lại nguyên bản nội dung để sau đó AI sẽ thực hiện tích hợp NLS/AI vào chính nội dung này. Giữ nguyên cấu trúc các mục (Mục tiêu, Thiết bị, Hoạt động GV-HS...).' 
    : 'Trích xuất các kiến thức cốt lõi, ví dụ và bài tập thực hành từ tài liệu. Nếu không có tài liệu, hãy tự soạn nội dung chuẩn theo chương trình GDPT 2018.'}`;

    if (fileData) {
      prompt += `\n\nDữ liệu từ file đính kèm (Base64): ${fileData.data.substring(0, 5000)}... [Tài liệu dài, hãy tập trung phân tích nội dung chính]`;
    }

    const text = await callGemini(prompt);
    return text || "Không có nội dung phản hồi.";
  } catch (err: any) {
    console.error("Ai Suggest Error:", err);
    throw err;
  }
};

export const generateLessonPlan = async (
  mode: 'creation' | 'integration', 
  formData: any,
  extractedContent?: string,
  frameworkContent?: string
): Promise<ResultData> => {
  try {
    const systemPrompt = `Bạn là chuyên gia giáo dục cao cấp, am hiểu sâu sắc về chuyển đổi số giáo dục tại Việt Nam và các khung năng lực mới nhất.
    NHIỆM VỤ: Tích hợp Năng lực số (NLS) và Trí tuệ nhân tạo (AI) vào giáo án một cách "siêu chi tiết".
    
    CĂN CỨ PHÁP LÝ CHI TIẾT (BẮT BUỘC):
    1. Thông tư 02/2025/TT-BGDĐT: Khung năng lực số người học. 
       - Yêu cầu dùng mã siêu chi tiết [Mã.Bậc] (Ví dụ: 1.1.TC1 cho Cơ bản, 1.1.TC3 cho Trung cấp, 1.1.TC5 cho Nâng cao). 
       - TUYỆT ĐỐI không gán mã chung chung như NL1, NL2.
    2. Quyết định 3439/QĐ-BGDĐT: Khung giáo dục AI.
       - Yêu cầu dùng mã chi tiết [Miền.CấpHọc] (Ví dụ: NLa.TiểuHọc, NLc.THCS, NLb.THPT).
    
    NGUYÊN TẮC TÍCH HỢP "SIÊU CHI TIẾT":
    - Với mỗi Hoạt động, hãy phân tích kỹ xem có thể lồng ghép việc sử dụng công cụ số (Office, Canva, Padlet, GeoGebra...) hoặc AI (Gemini, AI Chat, DeepL, MidJourney...) hay không.
    - Phải ghi rõ năng lực thành phần được bồi dưỡng là gì, tại sao thao tác đó lại giúp đạt năng lực đó.
    
    NGUYÊN TẮC "BẢO TỒN NỘI DUNG GỐC":
    - Giữ nguyên 100% nội dung gốc và chỉ chèn nội dung tích hợp (viết trong thẻ <span style="color:red">...</span>).
    - Phải giữ đúng cấu trúc Công văn 5512 (4 bước hoạt động: Chuyển giao -> Thực hiện -> Báo cáo -> Kết luận).
    
    QUY TẮC HIỂN THỊ:
    - Mọi nội dung tích hợp (mục tiêu, thao tác mới, sản phẩm mới) PHẢI nằm trong thẻ <span style="color:red">...</span>.
    - Ví dụ: "...HS sử dụng AI <span style="color:red">[Tích hợp AI - NLc.THCS: Trải nghiệm AI trực quan]</span> để..."
    
    ĐỊNH DẠNG ĐẦU RA: JSON.
    JSON Schema (BẮT BUỘC):
    {
      "lessonPlan": {
        "topic": "string", "subject": "string", "grade": "string", "duration": "string",
        "objectives": { "knowledge": ["string"], "competency": ["string"], "quality": ["string"] },
        "materials": ["string"],
        "activities": [
          {
            "name": "string", "objective": "string", "content": "string", "product": "string",
            "steps": [{ "stepName": "string", "teacherAction": "string", "output": "string" }],
            "digitalIntegration": { "code": "string", "requirement": "string", "description": "string" }
          }
        ]
      },
      "digitalPack": { "summary": "string", "mapping": [{ "activity": "string", "competencyCode": "string", "competency": "string", "tool": "string", "action": "string" }] }
    }`;

    const userPrompt = `Dưới đây là nội dung giáo án cần xử lý:
    Chủ đề: ${formData.topic}
    Môn: ${formData.subject}
    Lớp: ${formData.grade}
    
    NỘI DUNG GỐC:
    ${extractedContent || formData.originalText}
    
    YÊU CẦU CỤ THỂ:
    1. Phân tích bài dạy trên để tìm điểm chạm Năng lực số (theo Thông tư 02) và AI (theo Quyết định 3439).
    2. Tích hợp thêm các nội dung này trực tiếp vào các phần: Mục tiêu, Thiết bị, Hoạt động (GV/HS), Sản phẩm.
    3. Mọi nội dung bổ sung/tích hợp BẮT BUỘC phải đặt trong thẻ <span style="color:red">...</span>.
    4. Xuất kết quả hoàn chỉnh dưới dạng JSON theo đúng Schema đã quy định.`;

    const responseText = await callGemini(systemPrompt + "\n\n" + userPrompt, { isJson: true });
    
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error. Raw text:", responseText);
      throw new Error("AI trả về định dạng không hợp lệ. Vui lòng thử lại.");
    }
    
    // Validate and fix structure
    if (!parsedResult.lessonPlan) {
      throw new Error("AI không trả về cấu trúc lessonPlan hợp lệ.");
    }
    
    const lp = parsedResult.lessonPlan;
    if (!lp.objectives) lp.objectives = { knowledge: [], competency: [], quality: [] };
    if (!lp.materials) lp.materials = [];
    if (!lp.activities) lp.activities = [];
    
    lp.activities = lp.activities.map((act: any) => ({
      name: act.name || "Hoạt động",
      objective: act.objective || "",
      content: act.content || "",
      product: act.product || "",
      steps: Array.isArray(act.steps) ? act.steps.map((s: any) => ({
        stepName: s.stepName || "Bước",
        teacherAction: s.teacherAction || "",
        output: s.output || ""
      })) : [],
      digitalIntegration: act.digitalIntegration ? {
        code: act.digitalIntegration.code || "",
        requirement: act.digitalIntegration.requirement || "",
        description: act.digitalIntegration.description || ""
      } : undefined
    }));

    if (!parsedResult.digitalPack) parsedResult.digitalPack = { summary: "", mapping: [] };
    
    return {
      lessonPlan: lp,
      digitalPack: parsedResult.digitalPack,
      mode: mode
    };
  } catch (err: any) {
    console.error("Generate Error:", err);
    throw new Error(err.message || "Lỗi không xác định");
  }
};

export const transformActivity = async (
  activity: any,
  methodType: string,
  subject: string,
  grade: string
): Promise<any> => {
  const prompt = `Bạn là chuyên gia sư phạm. Hãy chuyển đổi hoạt động giáo dục sau đây sang phương pháp: ${methodType}.
  Môn: ${subject}, Lớp: ${grade}
  Hoạt động gốc: ${JSON.stringify(activity)}
  
  YÊU CẦU:
  - Giữ nguyên cấu trúc JSON của hoạt động.
  - Thay đổi 'content', 'teacherAction', 'output' để phản ánh phương pháp mới.
  - ${methodType === 'gamification' ? 'Sử dụng các yếu tố trò chơi, luật chơi, điểm số.' : 'Sử dụng mô hình học tập ở nhà trước, đến lớp thực hành.'}
  - Trả về DUY NHẤT đối tượng JSON của hoạt động đã sửa.`;

  const responseText = await callGemini(prompt, { isJson: true });
  const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
};

export const elaborateSection = async (
  sectionContent: string,
  userPrompt: string,
  sectionName: string
): Promise<string> => {
  const prompt = `Bạn là trợ lý soạn bài. Hãy viết chi tiết hơn/mở rộng nội dung sau đây dựa trên yêu cầu của giáo viên.
  Phần: ${sectionName}
  Nội dung hiện tại: ${sectionContent}
  Yêu cầu mở rộng: ${userPrompt}
  
  LƯU Ý: 
  - Trả về văn bản đã mở rộng, trình bày rõ ràng.
  - Sử dụng ngôn ngữ sư phạm chuẩn xác.
  - Có thể sử dụng thẻ <span style="color:red">...</span> cho các nội dung AI bổ sung.`;

  return await callGemini(prompt);
};
