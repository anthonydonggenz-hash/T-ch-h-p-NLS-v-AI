
import { DigitalCompetency } from './types';

export const DIGITAL_COMPETENCIES: DigitalCompetency[] = [
  // Miền 1: Khai thác dữ liệu và thông tin
  { code: '1.1', name: 'Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số', description: 'Xác định nhu cầu, tìm kiếm, truy cập và khai thác kết quả tìm kiếm trong môi trường số.' },
  { code: '1.2', name: 'Đánh giá dữ liệu, thông tin và nội dung số', description: 'Phân tích, so sánh và đánh giá độ tin cậy, tính xác thực của nguồn dữ liệu và nội dung số.' },
  { code: '1.3', name: 'Quản lý dữ liệu, thông tin và nội dung số', description: 'Tổ chức, lưu trữ và truy xuất dữ liệu, thông tin và nội dung số trong môi trường số có cấu trúc.' },
  
  // Miền 2: Giao tiếp và hợp tác trong môi trường số
  { code: '2.1', name: 'Tương tác thông qua công nghệ số', description: 'Giao tiếp qua các công nghệ số khác nhau và nhận biết phương tiện phù hợp.' },
  { code: '2.2', name: 'Chia sẻ thông tin và nội dung thông qua công nghệ số', description: 'Chia sẻ dữ liệu, nội dung với người khác; hiểu về thực hành trích dẫn và ghi chú nguồn.' },
  { code: '2.3', name: 'Sử dụng công nghệ số để thực hiện trách nhiệm công dân', description: 'Tham gia đóng góp cho xã hội thông qua các dịch vụ công và tư; tìm kiếm cơ hội trao quyền.' },
  { code: '2.4', name: 'Hợp tác thông qua công nghệ số', description: 'Sử dụng công cụ số cho các quá trình hợp tác, cùng xây dựng và đồng sáng tạo kiến thức.' },
  { code: '2.5', name: 'Quy tắc ứng xử trên mạng (Nghi thức số)', description: 'Nhan thức các chuẩn mực hành vi và kiến thức khi tương tác trong môi trường số.' },
  { code: '2.6', name: 'Quản lý danh tính số', description: 'Tạo và quản lý một hoặc nhiều danh tính số để bảo vệ danh tiếng và dữ liệu cá nhân.' },

  // Miền 3: Sáng tạo nội dung số
  { code: '3.1', name: 'Phát triển nội dung số', description: 'Tao và chỉnh sửa nội dung số ở các định dạng khác nhau để thể hiện bản thân.' },
  { code: '3.2', name: 'Tích hợp và tạo lập lại nội dung số', description: 'Sửa đổi, tinh chỉnh và tích hợp thông tin vào khối kiến thức sẵn có để tạo nội dung mới.' },
  { code: '3.3', name: 'Thực thi bản quyền và giấy phép', description: 'Hiểu và áp dụng bản quyền, giấy phép cho thông tin và nội dung số.' },
  { code: '3.4', name: 'Lập trình', description: 'Lập kế hoạch và phát triển chuỗi các câu lệnh để giải quyết vấn đề hoặc thực hiện nhiệm vụ.' },

  // Miền 4: An toàn
  { code: '4.1', name: 'Bảo vệ thiết bị', description: 'Bảo vệ thiết bị và nội dung số; hiểu rõ rủi ro và mối đe dọa trong môi trường số.' },
  { code: '4.2', name: 'Bảo vệ dữ liệu cá nhân và quyền riêng tư', description: 'Bảo vệ thông tin định danh; hiểu cách các dịch vụ sử dụng dữ liệu cá nhân.' },
  { code: '4.3', name: 'Bảo vệ sức khỏe và an sinh số', description: 'Tránh rủi ro thể chất và tinh thần; nhận biết công nghệ hỗ trợ an sinh xã hội.' },
  { code: '4.4', name: 'Bảo vệ môi trường', description: 'Nhận thức tác động của công nghệ số và việc sử dụng chúng đối với môi trường.' },

  // Miền 5: Giải quyết vấn đề
  { code: '5.1', name: 'Giải quyết các vấn đề kỹ thuật', description: 'Xác định và giải quyết các vấn đề khi vận hành thiết bị và sử dụng môi trường số.' },
  { code: '5.2', name: 'Xác định nhu cầu và giải pháp công nghệ', description: 'Đánh giá nhu cầu và lựa chọn công cụ, giải pháp công nghệ phù hợp để giải quyết.' },
  { code: '5.3', name: 'Sử dụng sáng tạo công nghệ số', description: 'Sử dụng công cụ số để tạo ra kiến thức, đổi mới quy trình và sản phẩm.' },
  { code: '5.4', name: 'Xác định các vấn đề cần cải thiện về năng lực số', description: 'Hiểu năng lực số của bản thân cần cải thiện; tìm kiếm cơ hội phát triển.' },

  // Miền 6: Ứng dụng trí tuệ nhân tạo
  { code: '6.1', name: 'Hiểu biết về trí tuệ nhân tạo', description: 'Hiểu cách AI ảnh hưởng đến cuộc sống; nắm vững nguyên tắc hoạt động, khả năng và hạn chế.' },
  { code: '6.2', name: 'Sử dụng trí tuệ nhân tạo có đạo đức và trách nhiệm', description: 'Sử dụng AI an toàn, hiệu quả để tạo nội dung, khám phá kiến thức và giải quyết vấn đề.' },
  { code: '6.3', name: 'Đánh giá trí tuệ nhân tạo', description: 'Đánh giá tính minh bạch, an toàn, đạo đức và tác động của các công cụ, nội dung do AI tạo ra.' },
];

export const MATH_6_DATABASE = [
  {
    chapter: "Chương 1: Tập hợp các số tự nhiên",
    lessons: [
      { id: "b1", name: "Bài 1: Tập hợp" },
      { id: "b2", name: "Bài 2: Cách ghi số tự nhiên" },
      { id: "b3", name: "Bài 3: Thứ tự trong tập hợp các số tự nhiên" },
      { id: "b4", name: "Bài 4: Phép cộng và phép trừ số tự nhiên" },
      { id: "b5", name: "Bài 5: Phép nhân và phép chia số tự nhiên" },
      { id: "b6", name: "Bài 6: Lũy thừa với số mũ tự nhiên" },
      { id: "b7", name: "Bài 7: Thứ tự thực hiện các phép tính" }
    ]
  },
  {
    chapter: "Chương 2: Tính chia hết trong tập hợp các số tự nhiên",
    lessons: [
      { id: "b8", name: "Bài 8: Quan hệ chia hết và tính chất chia hết" },
      { id: "b9", name: "Bài 9: Dấu hiệu chia hết cho 2, cho 5" },
      { id: "b10", name: "Bài 10: Dấu hiệu chia hết cho 3, cho 9" },
      { id: "b11", name: "Bài 11: Ước và bội" },
      { id: "b12", name: "Bài 12: Số nguyên tố" },
      { id: "b13", name: "Bài 13: Ước chung. Ước chung lớn nhất" },
      { id: "b14", name: "Bài 14: Bội chung. Bội chung nhỏ nhất" }
    ]
  },
  {
    chapter: "Chương 3: Số nguyên",
    lessons: [
      { id: "b15", name: "Bài 15: Số nguyên âm" },
      { id: "b16", name: "Bài 16: Phép cộng số nguyên" },
      { id: "b17", name: "Bài 17: Phép trừ số nguyên. Quy tắc dấu ngoặc" },
      { id: "b18", name: "Bài 18: Phép nhân số nguyên" },
      { id: "b19", name: "Bài 19: Phép chia hết trong tập hợp số nguyên. Ước và bội của một số nguyên" }
    ]
  },
  {
    chapter: "Chương 4: Một số hình phẳng trong thực tế",
    lessons: [
      { id: "b20", name: "Bài 20: Tam giác đều. Hình vuông. Hình lục giác đều" },
      { id: "b21", name: "Bài 21: Hình chữ nhật. Hình thoi" },
      { id: "b22", name: "Bài 22: Hình bình hành. Hình thang cân" }
    ]
  },
  {
    chapter: "Chương 5: Tính đối xứng của hình phẳng trong tự nhiên",
    lessons: [
      { id: "b23", name: "Bài 23: Hình có trục đối xứng" },
      { id: "b24", name: "Bài 24: Hình có tâm đối xứng" }
    ]
  },
  {
    chapter: "Chương 6: Phân số",
    lessons: [
      { id: "b25", name: "Bài 25: Phân số với tử và mẫu là số nguyên" },
      { id: "b26", name: "Bài 26: Phân số bằng nhau. Tính chất cơ bản của phân số" },
      { id: "b27", name: "Bài 27: So sánh phân số. Hỗn số dương" },
      { id: "b28", name: "Bài 28: Phép cộng và phép trừ phân số" },
      { id: "b29", name: "Bài 29: Tính chất cơ bản của phép cộng phân số" },
      { id: "b30", name: "Bài 30: Phép nhân và phép chia phân số" },
      { id: "b31", name: "Bài 31: Tính chất cơ bản của phép nhân phân số" }
    ]
  },
  {
    chapter: "Chương 7: Số thập phân",
    lessons: [
      { id: "b32", name: "Bài 32: Số thập phân" },
      { id: "b33", name: "Bài 33: Các phép tính với số thập phân" },
      { id: "b34", name: "Bài 34: Làm tròn số thập phân và ước lượng kết quả" },
      { id: "b35", name: "Bài 35: Tỉ số và tỉ số phần trăm" },
      { id: "b36", name: "Bài 36: Bài toán về tỉ số phần trăm" }
    ]
  },
  {
    chapter: "Chương 8: Những hình học cơ bản",
    lessons: [
      { id: "b37", name: "Bài 37: Điểm. Đường thẳng" },
      { id: "b38", name: "Bài 38: Điểm nằm giữa hai điểm. Tia" },
      { id: "b39", name: "Bài 39: Đoạn thẳng. Độ dài đoạn thẳng" },
      { id: "b40", name: "Bài 40: Trung điểm của đoạn thẳng" },
      { id: "b41", name: "Bài 41: Góc" },
      { id: "b42", name: "Bài 42: Số đo góc. Các góc đặc biệt" }
    ]
  },
  {
    chapter: "Chương 9: Dữ liệu và xác suất thực nghiệm",
    lessons: [
      { id: "b43", name: "Bài 43: Cách lấy dữ liệu. Bảng dữ liệu" },
      { id: "b44", name: "Bài 44: Biểu đồ tranh" },
      { id: "b45", name: "Bài 45: Biểu đồ cột" },
      { id: "b46", name: "Bài 46: Biểu đồ cột kép" },
      { id: "b47", name: "Bài 47: Kết quả có thể và sự kiện trong trò chơi, thí nghiệm" },
      { id: "b48", name: "Bài 48: Xác suất thực nghiệm" }
    ]
  }
];
