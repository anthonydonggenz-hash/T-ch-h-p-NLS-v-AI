import { DIGITAL_COMPETENCY_DB, AI_EDUCATION_FRAMEWORK } from '../constants';
import { FormData, LessonPlan, DigitalPack, AssessmentQuestion } from '../types';

const getTopicContext = (topic: string, subject: string, isMath: boolean) => {
    const topicLower = topic.toLowerCase();
    const subjectLower = subject.toLowerCase();

    let context = {
        definition: `Khái niệm và tính chất của ${topic}.`,
        realWorld: `Ứng dụng của ${topic} trong thực tiễn.`,
        exercises: `Các bài tập tính toán và chứng minh liên quan đến ${topic}.`,
        keywords: [topic],
        diagram: ""
    };

    if (isMath) {
        if (topicLower.includes("hình bình hành")) {
            context = {
                definition: `Hình bình hành là tứ giác có các cạnh đối song song.\nCông thức diện tích: $S = a \\cdot h$\nTính chất: Các cạnh đối bằng nhau ($AB = CD$), góc đối bằng nhau.`,
                realWorld: "Mái nhà, khung cửa sổ, họa tiết trang trí, cơ cấu xe nâng (hình bình hành động).",
                exercises: "Chứng minh một tứ giác là hình bình hành. Tính độ dài cạnh, số đo góc.",
                keywords: ["cạnh đối song song", "hai đường chéo", "trung điểm", "AB // CD", "AD = BC"],
                diagram: `<svg width="200" height="100" viewBox="0 0 200 100"><path d="M50 80 L180 80 L150 20 L20 20 Z" fill="none" stroke="black" stroke-width="2"/><text x="15" y="20" font-size="12">A</text><text x="155" y="20" font-size="12">B</text><text x="185" y="80" font-size="12">C</text><text x="40" y="80" font-size="12">D</text></svg>`
            };
        } else if (topicLower.includes("đường tròn") || topicLower.includes("phương trình đường tròn")) {
            context = {
                definition: `Phương trình đường tròn tâm $I(a; b)$ bán kính $R$:\n$$(x - a)^2 + (y - b)^2 = R^2$$`,
                realWorld: "Quỹ đạo chuyển động tròn, phạm vi phủ sóng radar, thiết kế bánh răng.",
                exercises: "Viết phương trình đường tròn đi qua 3 điểm. Xác định tâm và bán kính từ phương trình cho trước.",
                keywords: ["tâm I", "bán kính R", "x² + y²", "tiếp tuyến"],
                diagram: `<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="none" /><circle cx="50" cy="50" r="2" fill="black"/><text x="55" y="55" font-size="12">I</text></svg>`
            };
        } else if (topicLower.includes("vectơ") || topicLower.includes("vector")) {
            context = {
                definition: "Vectơ là một đoạn thẳng có hướng. Đặc trưng bởi độ dài và hướng.\nKý hiệu: $\\vec{u}, \\vec{v}, \\vec{AB}$",
                realWorld: "Biểu diễn lực, vận tốc trong Vật lý. Định vị GPS.",
                exercises: `Tính tổng: $\\vec{u} + \\vec{v}$\nTích vô hướng: $\\vec{u} \\cdot \\vec{v} = |\\vec{u}| \\cdot |\\vec{v}| \\cdot \\cos(\\vec{u}, \\vec{v})$`,
                keywords: ["độ dài", "hướng", "cùng phương", "tổng hai vectơ"],
                diagram: `<svg width="150" height="50" viewBox="0 0 150 50"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#000" /></marker></defs><line x1="10" y1="25" x2="130" y2="25" stroke="#000" stroke-width="2" marker-end="url(#arrow)" /><text x="70" y="15" font-size="14">u</text></svg>`
            };
        } else if (topicLower.includes("phương trình") || topicLower.includes("hàm số")) {
             context = {
                definition: `Hàm số bậc hai có dạng: $$y = ax^2 + bx + c \\quad (a \\neq 0)$$`,
                realWorld: "Quỹ đạo ném vật (Parabol), thiết kế cầu treo, ăng-ten parabol.",
                exercises: `Giải phương trình $ax^2 + bx + c = 0$. Tìm đỉnh Parabol $I(-\\frac{b}{2a}; -\\frac{\\Delta}{4a})$.`,
                keywords: ["parabol", "đỉnh I", "trục đối xứng"],
                diagram: `<svg width="100" height="100" viewBox="0 0 100 100"><path d="M10 10 Q50 90 90 10" stroke="black" fill="none"/><line x1="50" y1="0" x2="50" y2="100" stroke="gray" stroke-dasharray="4"/><line x1="0" y1="50" x2="100" y2="50" stroke="gray" stroke-dasharray="4"/></svg>`
            };
        }
    } else if (subjectLower.includes("văn") || subjectLower.includes("ngữ văn")) {
        context = {
            definition: `Phân tích các giá trị nội dung và nghệ thuật của tác phẩm/chủ đề: ${topic}.`,
            realWorld: `Liên hệ các thông điệp của ${topic} với đời sống tâm hồn và xã hội hiện nay.`,
            exercises: `Viết đoạn văn nghị luận xã hội hoặc nghị luận văn học về ${topic}.`,
            keywords: ["biện pháp tu từ", "ngôn ngữ", "hình tượng", "thông điệp"],
            diagram: ""
        };
    } else if (subjectLower.includes("lý") || subjectLower.includes("vật lý")) {
        context = {
            definition: `Các định luật và hiện tượng vật lý liên quan đến ${topic}.`,
            realWorld: `Ứng dụng của ${topic} trong kỹ thuật, đời sống và công nghệ.`,
            exercises: `Giải các bài tập tính toán đại lượng vật lý liên quan đến ${topic}.`,
            keywords: ["lực", "năng lượng", "biến thiên", "định luật"],
            diagram: ""
        };
    }

    return context;
};

export const generateAiSuggestion = (formData: FormData): string => {
    const { topic, subject, grade } = formData;
    const isMath = subject.toLowerCase().includes('toán') || subject.toLowerCase().includes('hình') || subject.toLowerCase().includes('đại');
    const topicUpper = topic.toUpperCase();
    const context = getTopicContext(topic, subject, isMath);

    if (isMath) {
        return `GIÁO ÁN GỢI Ý: ${topicUpper}
Môn: ${subject} - Lớp: ${grade}

I. YÊU CẦU CẦN ĐẠT:
- Kiến thức: HS nắm vững ${context.definition}
- Năng lực: HS có khả năng ${context.exercises}
- Phẩm chất: Trung thực, trách nhiệm trong học tập.

II. NỘI DUNG CHI TIẾT:
1. Khái niệm:
${context.definition}

2. Ví dụ minh họa:
- Bài toán: Cho các dữ kiện liên quan đến ${topic}.
- Giải: Áp dụng công thức để tìm kết quả.

3. Luyện tập:
- Giải các bài tập trong SGK trang tương ứng.
- Thảo luận về ${context.realWorld}`;
    }

    return `[AI GỢI Ý - CHUẨN KẾT NỐI TRI THỨC]
BÀI: ${topicUpper}
MÔN: ${subject.toUpperCase()} - LỚP ${grade}

I. YÊU CẦU CẦN ĐẠT:
- Nêu được khái niệm về ${topic}.
- Giải giải thích được ý nghĩa thực tiễn của ${topic}: ${context.realWorld}

II. NỘI DUNG CHI TIẾT:
1. Định nghĩa: ${topic} là...
2. Đặc điểm chính: ...
3. Ứng dụng: ${context.realWorld}

(Nội dung được trích xuất chuẩn theo chương trình GDPT 2018)`;
};

export const generateDetailed5512Plan = (formData: FormData, isMath: boolean): LessonPlan => {
    const pickComp = (code: string) => DIGITAL_COMPETENCY_DB.find(c => c.code === code) || DIGITAL_COMPETENCY_DB[0];
    
    // Helper for AI Education Framework (QĐ 3439)
    const pickAiComp = (code: string) => {
        const comp = AI_EDUCATION_FRAMEWORK.find(c => c.code === code);
        if (!comp) return { code: "NLa", domain: "AI", requirement: "AI Education" };
        
        const gradeNum = parseInt(formData.grade);
        let req = comp.requirement.primary;
        if (gradeNum >= 6 && gradeNum <= 9) req = comp.requirement.secondary;
        if (gradeNum >= 10) req = comp.requirement.high;
        
        return { code: comp.code, domain: comp.domain, requirement: req };
    };

    // 1. CHUẨN HÓA DỮ LIỆU ĐẦU VÀO
    const topic = formData.topic.trim() || "Bài học mới";
    const subject = formData.subject || "Môn học";
    const grade = formData.grade || "10";
    const hasOriginalText = formData.originalText && formData.originalText.length > 50;

    // 2. XÁC ĐỊNH NGỮ CẢNH BÀI DẠY (CONTEXT)
    const context = getTopicContext(topic, subject, isMath);

    // 3. XÂY DỰNG MỤC TIÊU (OBJECTIVES)
    const objectives = {
        knowledge: [
            hasOriginalText 
                ? `Trình bày được các kiến thức cốt lõi về ${topic} dựa trên tài liệu SGK đã cung cấp.` 
                : `Phát biểu được định nghĩa, tính chất, dấu hiệu nhận biết của ${topic}.`,
            `Hệ thống hóa được các công thức/định lý liên quan đến ${topic}.`,
            `Giải thích được mối liên hệ giữa ${topic} và các kiến thức đã học trước đó.`
        ],
        competency: [
            "Tư duy và lập luận: Phân tích, tổng hợp các dữ kiện để giải quyết vấn đề.",
            "Mô hình hóa: Chuyển đổi bài toán thực tế về mô hình lý thuyết (nếu có).",
            `Giao tiếp chuyên môn: Sử dụng đúng các thuật ngữ, ký hiệu (${context.keywords.join(", ")}).`,
            "Sử dụng công cụ, phương tiện học tập: Máy tính cầm tay, phần mềm hỗ trợ."
        ],
        quality: [
            "Chăm chỉ: Tích cực tìm tòi, giải quyết các bài tập trong SGK.",
            "Trung thực: Nghiêm túc trong kiểm tra, đánh giá, tự giác làm bài tập về nhà."
        ]
    };

    // 4. THIẾT BỊ DẠY HỌC
    const materials = [
        hasOriginalText ? `Tài liệu/Giáo án điện tử: ${formData.textbookFileName || "Nội dung từ AI"}` : `Sách giáo khoa ${subject} ${grade} - Bộ sách Kết nối tri thức với cuộc sống.`,
        "Kế hoạch bài dạy.",
        "Thước thẳng, compa, êke, phấn màu.",
        "Máy tính, tivi/màn hình chiếu tương tác."
    ];

    // Nếu có nội dung từ AI/File tải lên, ưu tiên sử dụng nội dung đó làm context
    if (hasOriginalText) {
        const aiComp = pickAiComp("NLa");
        return {
            topic: topic.toUpperCase(),
            subject: subject,
            grade: grade,
            duration: formData.duration || "1",
            objectives: {
                knowledge: [`Hệ thống hóa kiến thức về ${topic} từ giáo án gốc.`],
                competency: [`Phát triển năng lực chuyên môn thông qua ${topic}.`, "Năng lực số: Ứng dụng CNTT và truyền thông trong dạy học."],
                quality: ["Chăm chỉ, trung thực trong học tập."]
            },
            materials: [
                ...materials,
                "Thiết bị số: Máy tính, máy chiếu, phần mềm hỗ trợ."
            ],
            activities: [
                {
                    name: "NỘI DUNG GIÁO ÁN GỐC (GIỮ NGUYÊN 100%)",
                    objective: "Bảo toàn toàn bộ tiến trình dạy học đã có.",
                    content: formData.originalText,
                    product: "Kế hoạch bài dạy hoàn chỉnh.",
                    steps: [
                        { 
                            stepName: "Tiến trình dạy học", 
                            teacherAction: "Thực hiện đầy đủ các bước theo giáo án gốc đã tải lên.", 
                            output: "Đạt mục tiêu bài dạy." 
                        }
                    ]
                },
                {
                    name: "PHỤ LỤC: TÍCH HỢP NĂNG LỰC SỐ (THEO QĐ 3439/BGDĐT)",
                    objective: "Nâng cấp bài dạy đáp ứng yêu cầu giáo dục Trí tuệ nhân tạo mới nhất.",
                    content: `Dựa trên chủ đề ${topic}, các điểm tích hợp năng lực AI sau đây được đề xuất:`,
                    product: "Sản phẩm học tập số, kết quả tương tác trên nền tảng AI.",
                    steps: [
                        {
                            stepName: "Điểm tích hợp 1: Tư duy AI",
                            teacherAction: `GV hướng dẫn HS nhận diện vai trò của AI trong việc giải quyết vấn đề ${topic}.`,
                            output: "HS hình thành tư duy lấy con người làm trung tâm."
                        },
                        {
                            stepName: "Điểm tích hợp 2: Đạo đức & Trách nhiệm số",
                            teacherAction: "Thảo luận về việc sử dụng AI có trách nhiệm khi tìm kiếm thông tin bài học.",
                            output: "HS phát triển ý thức về đạo đức AI."
                        }
                    ],
                    digitalIntegration: {
                        code: aiComp.code,
                        requirement: aiComp.requirement,
                        description: `Tích hợp theo Khung giáo dục AI (QĐ 3439/BGDĐT): ${aiComp.domain}.`
                    }
                }
            ]
        };
    }

    // 5. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG)
    const activities = [
        {
            name: "HOẠT ĐỘNG 1: KHỞI ĐỘNG (WARM-UP)",
            objective: `Gợi mở, tạo tâm thế hứng thú cho HS tìm hiểu về ${topic}.`,
            content: `GV đưa ra tình huống thực tế hoặc bài toán mở đầu liên quan đến: ${context.realWorld}`,
            product: "Câu trả lời của HS, sự tò mò cần giải đáp.",
            steps: [
                { 
                    stepName: "Bước 1: Chuyển giao nhiệm vụ", 
                    teacherAction: `GV chiếu hình ảnh/video về ${context.realWorld}.\nGV đặt câu hỏi: "Các em có nhận xét gì về hình dạng/đặc điểm của các đối tượng trong hình?"`, 
                    output: "HS quan sát, lắng nghe." 
                },
                { 
                    stepName: "Bước 2: Thực hiện nhiệm vụ", 
                    teacherAction: "HS quan sát, suy nghĩ cá nhân và trao đổi nhanh với bạn cùng bàn.", 
                    output: "HS thảo luận sôi nổi." 
                },
                { 
                    stepName: "Bước 3: Báo cáo, thảo luận", 
                    teacherAction: "GV gọi 1-2 HS trả lời.\nGV ghi nhận các ý kiến (kể cả ý kiến chưa chính xác).", 
                    output: "HS trình bày quan điểm." 
                },
                { 
                    stepName: "Bước 4: Kết luận, nhận định", 
                    teacherAction: `GV dẫn dắt: "Để hiểu rõ hơn về tính chất và ứng dụng của nó, chúng ta cùng vào bài mới: ${topic}."`, 
                    output: "HS ghi tên bài vào vở." 
                }
            ],
            digitalIntegration: formData.selectedFramework === '3439_AI' ? {
                code: "NLa",
                requirement: pickAiComp("NLa").requirement,
                description: "Sử dụng AI để trực quan hóa tình huống khởi động."
            } : {
                code: "1.1.TC1a", 
                requirement: pickComp("1.1.TC1a").requirement,
                description: "Sử dụng hình ảnh/video đa phương tiện để trực quan hóa vấn đề."
            }
        },
        {
            name: "HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI",
            objective: `HS nắm vững định nghĩa, định lý, công thức của ${topic}.`,
            content: `Tìm hiểu nội dung:\n1. Định nghĩa/Khái niệm.\n2. Tính chất/Định lý.\n\nChi tiết: ${context.definition}\n${context.diagram}`,
            product: "HS ghi vở các kiến thức trọng tâm.",
            steps: [
                { 
                    stepName: "Bước 1: Chuyển giao nhiệm vụ", 
                    teacherAction: `GV chia lớp thành 4 nhóm.\nYêu cầu các nhóm đọc SGK (hoặc tài liệu ${formData.textbookFileName}) phần Kiến thức trọng tâm.\nThảo luận và ghi chép vào vở các nội dung trọng tâm.`, 
                    output: "HS nhận nhiệm vụ học tập." 
                },
                { 
                    stepName: "Bước 2: Thực hiện nhiệm vụ", 
                    teacherAction: "HS làm việc nhóm, thảo luận, tra cứu tài liệu.\nGV quan sát, hỗ trợ các nhóm gặp khó khăn.", 
                    output: "Các nhóm thảo luận, ghi chép kết quả." 
                },
                { 
                    stepName: "Bước 3: Báo cáo, thảo luận", 
                    teacherAction: "GV mời đại diện nhóm lên trình bày.\nGV tổ chức cho các nhóm khác nhận xét, bổ sung, phản biện.", 
                    output: "Đại diện nhóm báo cáo. HS lớp lắng nghe." 
                },
                { 
                    stepName: "Bước 4: Kết luận, nhận định", 
                    teacherAction: "GV chốt lại kiến thức đúng.\nNhấn mạnh các lưu ý, sai lầm thường gặp.\nYêu cầu HS ghi nội dung chính vào vở.", 
                    output: "HS ghi bài." 
                }
            ],
            digitalIntegration: formData.selectedFramework === '3439_AI' ? {
                code: "NLc",
                requirement: pickAiComp("NLc").requirement,
                description: "Khai thác học liệu số và công cụ AI để hình thành kiến thức."
            } : {
                 code: "6.2.TC1b",
                 requirement: pickComp("6.2.TC1b").requirement,
                 description: "HS sử dụng thiết bị thông minh để tra cứu thêm thông tin mở rộng hoặc dùng phần mềm GeoGebra để kiểm chứng tính chất hình học."
            }
        },
        {
            name: "HOẠT ĐỘNG 3: LUYỆN TẬP (PRACTICE)",
            objective: `Củng cố kiến thức, rèn luyện kỹ năng giải toán liên quan đến ${topic}.`,
            content: `GV yêu cầu HS làm các bài tập trắc nghiệm và tự luận.\nNội dung: ${context.exercises}`,
            product: "Lời giải chi tiết các bài tập.",
            steps: [
                { 
                    stepName: "Bước 1: Chuyển giao nhiệm vụ", 
                    teacherAction: "GV chiếu đề bài tập lên bảng (hoặc yêu cầu xem SGK).\nBài 1: Nhận biết (Trắc nghiệm).\nBài 2: Thông hiểu (Tự luận cơ bản).\nBài 3: Vận dụng (Bài toán thực tế).", 
                    output: "HS đọc đề, xác định yêu cầu." 
                },
                { 
                    stepName: "Bước 2: Thực hiện nhiệm vụ", 
                    teacherAction: "HS làm việc cá nhân.\nGV đi xem xét bài làm của HS, hướng dẫn gợi ý cho HS yếu.", 
                    output: "HS giải bài vào vở." 
                },
                { 
                    stepName: "Bước 3: Báo cáo, thảo luận", 
                    teacherAction: "GV gọi 2 HS lên bảng giải Bài 2 và Bài 3.\nGọi HS khác đứng tại chỗ trả lời trắc nghiệm.", 
                    output: "HS lên bảng trình bày lời giải." 
                },
                { 
                    stepName: "Bước 4: Kết luận, nhận định", 
                    teacherAction: "GV nhận xét bài làm trên bảng, chấm điểm.\nPhân tích lỗi sai (nếu có) về cách trình bày, tính toán.", 
                    output: "HS sửa bài (nếu sai)." 
                }
            ],
            digitalIntegration: formData.selectedFramework === '3439_AI' ? {
                code: "NLb",
                requirement: pickAiComp("NLb").requirement,
                description: "Sử dụng công cụ AI hỗ trợ luyện tập một cách trung thực."
            } : undefined
        },
        {
            name: "HOẠT ĐỘNG 4: VẬN DỤNG (APPLICATION)",
            objective: `Sử dụng kiến thức ${topic} để giải quyết vấn đề thực tiễn hoặc bài toán nâng cao.`,
            content: "GV giao bài tập về nhà hoặc dự án nhỏ.",
            product: "Bài làm về nhà của HS.",
            steps: [
                { 
                    stepName: "Bước 1: Chuyển giao nhiệm vụ", 
                    teacherAction: `GV nêu bài toán: "Hãy tìm hiểu và chụp ảnh một vật thể có hình dạng ${topic} trong ngôi nhà của em, sau đó đo đạc và tính toán các thông số..."`, 
                    output: "HS lắng nghe yêu cầu." 
                },
                { 
                    stepName: "Bước 2: Thực hiện nhiệm vụ", 
                    teacherAction: "HS thực hiện tại nhà.", 
                    output: "HS tự thực hiện." 
                },
                { 
                    stepName: "Bước 3: Báo cáo, thảo luận", 
                    teacherAction: "Nộp báo cáo vào đầu giờ học sau.", 
                    output: "Sản phẩm nộp sau." 
                },
                { 
                    stepName: "Bước 4: Kết luận, nhận định", 
                    teacherAction: "GV đánh giá vào tiết học sau.", 
                    output: "HS ghi nhớ." 
                }
            ],
            digitalIntegration: formData.selectedFramework === '3439_AI' ? {
                code: "NLd",
                requirement: pickAiComp("NLd").requirement,
                description: "Thiết kế sản phẩm hoặc giải pháp có ứng dụng AI đơn giản."
            } : undefined
        }
    ];

    return {
        topic: topic.toUpperCase(),
        subject: subject,
        grade: grade,
        duration: formData.duration || "1",
        objectives: objectives,
        materials: materials,
        activities: activities
    };
};

export const generateMockDigitalPack = (formData: FormData): DigitalPack => {
  const isAi = formData.selectedFramework === '3439_AI';
  const topic = formData.topic || "Bài học";
  
  if (isAi) {
    return {
      summary: `Kế hoạch tích hợp giáo dục Trí tuệ nhân tạo (QĐ 3439/BGDĐT) cho bài ${topic}.`,
      mapping: [
        { 
          activity: "HĐ1: Khởi động", 
          competencyCode: "NLa", 
          competency: "Tư duy lấy con người làm trung tâm", 
          tool: "AI Image Generator / Chatbot", 
          action: "GV sử dụng AI tạo hình ảnh minh họa tình huống thực tế để HS nhận diện vai trò của AI.", 
          evidence: "HS thảo luận về sự khác biệt giữa sản phẩm do người và AI tạo ra." 
        },
        { 
          activity: "HĐ2: Hình thành kiến thức", 
          competencyCode: "NLc", 
          competency: "Kĩ thuật và ứng dụng AI", 
          tool: "Nền tảng AI chuyên dụng", 
          action: "HS trải nghiệm trực tiếp công cụ AI để khám phá nguyên lý hoạt động của chủ đề.", 
          evidence: "Ghi chép kết quả tương tác với AI vào vở." 
        }
      ]
    };
  }

  return {
    summary: `Kế hoạch tích hợp công cụ số hỗ trợ dạy học bài ${topic} theo CV 3456.`,
    mapping: [
      { activity: "HĐ2: Hình thành kiến thức", competencyCode: "6.2.TC1b", competency: "Sử dụng công cụ số", tool: "Phần mềm mô phỏng/Tra cứu", action: `GV hướng dẫn HS sử dụng phần mềm để trực quan hóa ${topic}.`, evidence: "Hình ảnh mô phỏng trên màn hình." },
      { activity: "HĐ3: Luyện tập", competencyCode: "1.1.TC1b", competency: "Đánh giá số", tool: "Quizizz / Kahoot", action: "Tổ chức kiểm tra nhanh trắc nghiệm khách quan.", evidence: "Bảng xếp hạng và thống kê điểm số." }
    ]
  };
};
