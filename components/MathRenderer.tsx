
import React, { useEffect, useRef } from 'react';

interface MathRendererProps {
  content: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && (window as any).MathJax) {
      // 1. Chuẩn hóa nội dung: 
      // - Chuyển đổi \n thành <br/> để giữ cấu trúc văn bản thô.
      // - Bảo lưu các thẻ HTML <img> và <svg> đã được AI trích xuất hoặc tạo ra.
      const formattedContent = content.replace(/\n/g, '<br/>');
      containerRef.current.innerHTML = formattedContent;
      
      // 2. Kích hoạt render MathJax cho các công thức LaTeX ($...$)
      try {
        // Sử dụng typesetPromise để đảm bảo việc render diễn ra mượt mà và không chặn luồng chính
        (window as any).MathJax.typesetPromise([containerRef.current]).catch((err: any) => {
          // MathJax có thể bỏ qua các khối không chứa công thức, điều này là bình thường
          console.debug("MathJax status:", err);
        });
      } catch (e) {
        console.error("MathJax error:", e);
      }
    }
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className="math-rendered text-slate-700 text-sm italic lesson-content-rich"
      style={{ 
        minHeight: '1.2em', 
        width: '100%', 
        overflowX: 'auto',
        overflowY: 'hidden'
      }}
    />
  );
};

export default MathRenderer;
