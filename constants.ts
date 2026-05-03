export const TEMPLATES = [
  { id: 'th_kienthuc', name: 'Tiểu học: Hình thành kiến thức mới (1 tiết)' },
  { id: 'th_luyentap', name: 'Tiểu học: Luyện tập – thực hành (1 tiết)' },
  { id: 'trung_hoc_khampha', name: 'THCS/THPT: Khám phá – hình thành kiến thức (1-2 tiết)' },
  { id: 'trung_hoc_ontap', name: 'THCS/THPT: Ôn tập – hệ thống hoá (1 tiết)' },
  { id: 'nguvan_docviet', name: 'Ngữ văn: Đọc hiểu + Viết (2 tiết)' },
  { id: 'toan_hinhhoc', name: 'Toán: Hình học & Đo lường (1 tiết)' }, 
  { id: 'stem_duan', name: 'HĐ Trải nghiệm / STEM: Dự án mini (2 tiết)' },
];

export const DIGITAL_COMPETENCY_DB = [
  // Miền 1: Khai thác dữ liệu & thông tin
  { code: "1.1.TC1", domain: "1. Khai thác dữ liệu & thông tin", component: "1.1. Duyệt, tìm kiếm", requirement: "Xác định được nhu cầu thông tin, tìm kiếm dữ liệu thông qua tìm kiếm đơn giản (Bac 1).", level: "Cơ bản" },
  { code: "1.1.TC3", domain: "1. Khai thác dữ liệu & thông tin", component: "1.1. Duyệt, tìm kiếm", requirement: "Thực hiện được rõ ràng và theo quy trình các tìm kiếm để tìm dữ liệu, thông tin trong môi trường số (Bac 3).", level: "Trung cấp" },
  { code: "1.1.TC5", domain: "1. Khai thác dữ liệu & thông tin", component: "1.1. Duyệt, tìm kiếm", requirement: "Áp dụng được kỹ thuật tìm kiếm để lấy dữ liệu, thông tin và nội dung trong môi trường số (Bac 5).", level: "Nâng cao" },
  { code: "1.2.TC3", domain: "1. Khai thác dữ liệu & thông tin", component: "1.2. Đánh giá dữ liệu", requirement: "Thực hiện phân tích, so sánh, đánh giá được độ tin cậy và độ chính xác của các nguồn dữ liệu (Bac 3).", level: "Trung cấp" },
  
  // Miền 2: Giao tiếp & hợp tác
  { code: "2.1.TC1", domain: "2. Giao tiếp & hợp tác", component: "2.1. Tương tác số", requirement: "Lựa chọn được các công nghệ số đơn giản để tương tác (Bac 1).", level: "Cơ bản" },
  { code: "2.1.TC5", domain: "2. Giao tiếp & hợp tác", component: "2.1. Tương tác số", requirement: "Sử dụng được nhiều công nghệ số để tương tác, chỉ ra phương tiện phù hợp nhất (Bac 5).", level: "Nâng cao" },
  { code: "2.2.TC3", domain: "2. Giao tiếp & hợp tác", component: "2.2. Chia sẻ số", requirement: "Minh họa rõ ràng và thường xuyên các phương pháp tham chiếu và ghi chú nguồn (Bac 3).", level: "Trung cấp" },
  { code: "2.5.TC3", domain: "2. Giao tiếp & hợp tác", component: "2.5. Quy tắc ứng xử", requirement: "Làm rõ được các chuẩn mực và bí quyết hành vi thông thường khi sử dụng công nghệ số (Bac 3).", level: "Trung cấp" },

  // Miền 3: Sáng tạo nội dung số
  { code: "3.1.TC3", domain: "3. Sáng tạo nội dung số", component: "3.1. Phát triển nội dung", requirement: "Chỉ ra được cách tạo và chỉnh sửa nội dung có khái nhiệm cụ thể bằng định dạng rõ ràng (Bac 3).", level: "Trung cấp" },
  { code: "3.4.TC3", domain: "3. Sáng tạo nội dung số", component: "3.4. Lập trình", requirement: "Liệt kê được các hướng dẫn thông thường cho một hệ thống máy tính để giải quyết vấn đề (Bac 3).", level: "Trung cấp" },

  // Miền 4: An toàn
  { code: "4.1.TC1", domain: "4. An toàn", component: "4.1. Bảo vệ thiết bị", requirement: "Nhận biết được cách bảo vệ thiết bị và nội dung số một cách đơn giản (Bac 1).", level: "Cơ bản" },
  { code: "4.2.TC3", domain: "4. An toàn", component: "4.2. Bảo vệ dữ liệu cá nhân", requirement: "Giải thích được các cách thức cơ bản và phổ biến để bảo vệ dữ liệu cá nhân (Bac 3).", level: "Trung cấp" },

  // Miền 5: Giải quyết vấn đề
  { code: "5.1.TC3", domain: "5. Giải quyết vấn đề", component: "5.1. Vấn đề kỹ thuật", requirement: "Chọn được các giải pháp được xác định rõ ràng và thông thường cho các vấn đề kỹ thuật (Bac 3).", level: "Trung cấp" },
  { code: "5.3.TC3", domain: "5. Giải quyết vấn đề", component: "5.3. Sáng tạo số", requirement: "Gắn kết được cá nhân và tập thể để hiểu và giải quyết các vấn đề mang tính khái niệm (Bac 3).", level: "Trung cấp" },

  // Miền 6: AI
  { code: "6.1.TC1", domain: "6. AI", component: "6.1. Hiểu biết AI", requirement: "Xác định được các khái niệm cơ bản của AI (Bac 1).", level: "Cơ bản" },
  { code: "6.2.TC3", domain: "6. AI", component: "6.2. Sử dụng AI", requirement: "Sử dụng được các công cụ AI trong công việc; xem xét các khía cạnh đạo đức khi dùng AI (Bac 3).", level: "Trung cấp" },
  { code: "6.3.TC5", domain: "6. AI", component: "6.3. Đánh giá AI", requirement: "Kiểm tra và xác minh được tính chính xác của các quyết định do hệ thống AI đưa ra (Bac 5).", level: "Nâng cao" }
];

export const AI_EDUCATION_FRAMEWORK = [
  { 
    code: "NLa", 
    domain: "Tư duy lấy con người làm trung tâm", 
    requirement: {
      primary: "Nhận biết AI là sản phẩm do con người tạo ra; nêu ví dụ AI giúp ích cho con người; nhận biết tình huống cần con người kiểm soát (Lớp 1-5).",
      secondary: "Hiểu vai trò của con người trong thiết kế/vận hành; phân tích tình huống sử dụng chính xác; biết rằng con người chịu trách nhiệm cuối cùng (Lớp 6-9).",
      high: "Phân tích ảnh hưởng của AI đến việc làm/quyền riêng tư; tích hợp yếu tố nhân văn và công bằng vào thiết kế giải pháp (Lớp 10-12)."
    }
  },
  { 
    code: "NLb", 
    domain: "Đạo đức AI", 
    requirement: {
      primary: "Sử dụng AI đúng cách, không gây hại; ý thức bảo vệ thông tin cá nhân; tôn trọng bản quyền số và sản phẩm của người khác (Lớp 1-5).",
      secondary: "Nêu được 4 nguyên tắc đạo đức cơ bản: không gây hại, không thiên kiến, công bằng, minh bạch; áp dụng khi học tập (Lớp 6-9).",
      high: "Đánh giá đạo đức trong tình huống thực tế; đề xuất quy tắc ứng xử hoặc chính sách đạo đức cho trường học/cộng đồng (Lớp 10-12)."
    }
  },
  { 
    code: "NLc", 
    domain: "Các kĩ thuật và ứng dụng AI", 
    requirement: {
      primary: "Làm quen ứng dụng nhận diện hình ảnh/giọng nói; biết vận dụng AI hỗ trợ học tập (vẽ, luyện đọc, học toán...) (Lớp 1-5).",
      secondary: "Hiểu khái niệm dữ liệu, thuật toán, mô hình; kết hợp nhiều công cụ AI tạo sản phẩm số có ý nghĩa (video, thuyết trình...) (Lớp 6-9).",
      high: "Trình bày quy trình phát triển AI (thu thập-xử lý-huấn luyện-đánh giá); cải tiến mô hình sẵn có hoặc thực hành prompt nâng cao (Lớp 10-12)."
    }
  },
  { 
    code: "NLd", 
    domain: "Thiết kế hệ thống AI", 
    requirement: {
      primary: "Nhận biết AI hoạt động dựa trên dữ liệu để dự đoán; nêu ý tưởng đơn giản để cải thiện khi kết quả sai (Lớp 1-5).",
      secondary: "Xác định tình huống thực tiễn nên ứng dụng AI; lập kế hoạch thiết kế hệ thống đơn giản thông qua mô phỏng với công cụ sẵn có (Lớp 6-9).",
      high: "Mô tả cấu trúc tổng thể hệ thống; xác định mục tiêu/biến số; thực hiện kiểm thử, điều chỉnh và tối ưu hóa ở mức cơ bản (Lớp 10-12)."
    }
  }
];
