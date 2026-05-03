import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Check, Layers, FileText, Presentation, Database,
  Cpu, Zap, Brain
} from 'lucide-react';
import { ResultData } from '../types';
import ContentRenderer from './ContentRenderer';

interface Props {
  fullData: ResultData;
  onTransform: (index: number, method: string) => void;
  onElaborate: (sectionId: string, prompt: string) => void;
}

const LessonPlan5512View: React.FC<Props> = ({ fullData, onTransform, onElaborate }) => {
  const data = fullData.lessonPlan;
  const mode = fullData.mode;
  const [highlightMode, setHighlightMode] = useState(true);
  const [showElaborateKnowledge, setShowElaborateKnowledge] = useState(false);
  const [elaborateKnowledgeInput, setElaborateKnowledgeInput] = useState("");
  const [activeElaborateActivity, setActiveElaborateActivity] = useState<number | null>(null);
  const [actElaborateInput, setActElaborateInput] = useState("");

  if (!data) return <div className="p-10 text-center text-slate-400">Đang tải dữ liệu...</div>;

  const [expandedSections, setExpandedSections] = useState({
    objectives: true,
    materials: true,
    activities: data.activities ? data.activities.map(() => true) : [],
    appendix1: true
  });

  // Function to strip or keep highlights based on highlightMode
  const processContent = (text: string) => {
    if (!text) return "";
    if (highlightMode) return text;
    // Basic regex to remove the red span tags if user wants to see "clean" version
    return text.replace(/<span style="color:red">(.*?)<\/span>/g, '$1');
  };

  const toggleActivity = (index: number) => {
    const newActivities = [...expandedSections.activities];
    newActivities[index] = !newActivities[index];
    setExpandedSections({...expandedSections, activities: newActivities});
  };

  return (
    <div className="a4-container font-serif text-[#1e1e1e] relative">
      {/* Floating Toggle for Highlight */}
      <div className="fixed top-24 right-10 z-50 flex flex-col gap-2">
        <button 
          onClick={() => setHighlightMode(!highlightMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all text-xs font-bold border-2 ${
            highlightMode 
            ? 'bg-red-50 text-red-600 border-red-200' 
            : 'bg-white text-slate-600 border-slate-200 hover:border-red-200'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${highlightMode ? 'bg-red-600 animate-pulse' : 'bg-slate-400'}`}></div>
          {highlightMode ? 'ĐANG HIỆN TÍCH HỢP' : 'XEM BẢN GỐC (BỎ ĐỎ)'}
        </button>
      </div>

      {/* Header Công văn */}
      <div className="text-center mb-8 border-b-2 border-slate-100 pb-6">
        <p className="font-bold text-sm uppercase text-slate-500 mb-1 font-sans">KHUNG KẾ HOẠCH BÀI DẠY</p>
        <p className="italic text-xs text-slate-400 font-sans">(Kèm theo Công văn số 5512/BGDĐT-GDTrH)</p>
        <p className="font-bold text-sm text-gold-accent mt-2 font-sans flex items-center justify-center gap-2">
            <Check size={14} /> Căn cứ: Thông tư 02/2025/TT-BGDĐT & Quyết định 3439/QĐ-BGDĐT
        </p>
        {mode === 'integration' && (
          <div className="inline-block mt-3 px-4 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
            CHẾ ĐỘ: TÍCH HỢP NLS & AI VÀO GIÁO ÁN GỐC
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6 font-sans text-sm">
        <div>
           <p>Trường: ..............................</p>
           <p>Tổ: ..............................</p>
        </div>
        <div className="text-right">
           <p>Họ và tên giáo viên: <strong>...................</strong></p>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase mb-2">TÊN BÀI DẠY: {data.topic.toUpperCase()}</h1>
        <p className="font-semibold">Môn học: {data.subject}; Lớp: {data.grade}</p>
        <p className="italic">Thời gian thực hiện: {data.duration} tiết</p>
      </div>

      {/* I. MỤC TIÊU */}
      <div className="mb-6">
        <div className="flex items-center justify-between border-b border-black mb-2 pb-1">
           <div className="flex items-center gap-3">
               <h3 className="font-bold text-lg uppercase cursor-pointer" onClick={() => setExpandedSections(p => ({...p, objectives: !p.objectives}))}>
                 I. MỤC TIÊU
               </h3>
           </div>
           <button onClick={() => setExpandedSections(p => ({...p, objectives: !p.objectives}))} className="p-1 hover:bg-slate-100 rounded">
             {expandedSections.objectives ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
           </button>
        </div>
        
        {expandedSections.objectives && (
          <div className="animate-fade-in text-sm leading-relaxed text-justify">
            <div className="mb-3 relative group">
              <div className="flex items-center justify-between">
                <p className="font-bold">1. Về kiến thức:</p>
                <button 
                  onClick={() => setShowElaborateKnowledge(!showElaborateKnowledge)}
                  className="opacity-0 group-hover:opacity-100 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded transition-opacity flex items-center gap-1"
                >
                  <Brain size={10} /> AI Viết chi tiết
                </button>
              </div>
              
              {showElaborateKnowledge && (
                <div className="my-2 p-3 bg-slate-50 border border-slate-200 rounded-lg flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nhập yêu cầu mở rộng (VD: Viết kỹ hơn phần...)"
                    className="flex-1 bg-white border border-slate-300 rounded px-3 py-1 text-xs"
                    value={elaborateKnowledgeInput}
                    onChange={(e) => setElaborateKnowledgeInput(e.target.value)}
                  />
                  <button 
                    onClick={() => {
                      onElaborate('objectives_knowledge', elaborateKnowledgeInput);
                      setShowElaborateKnowledge(false);
                      setElaborateKnowledgeInput("");
                    }}
                    className="bg-gold-accent text-white px-3 py-1 rounded text-xs font-bold"
                  >
                    Gửi AI
                  </button>
                </div>
              )}

              <ul className="list-disc pl-5 space-y-1 ml-2">
                {data.objectives.knowledge && data.objectives.knowledge.map((item, i) => <li key={i}><ContentRenderer content={processContent(item)} /></li>)}
              </ul>
            </div>
            <div className="mb-3">
              <p className="font-bold">2. Về năng lực:</p>
              <ul className="list-disc pl-5 space-y-1 ml-2">
                {data.objectives.competency && data.objectives.competency.map((item, i) => <li key={i}><ContentRenderer content={processContent(item)} /></li>)}
              </ul>
            </div>
            <div className="mb-3">
              <p className="font-bold">3. Về phẩm chất:</p>
              <ul className="list-disc pl-5 space-y-1 ml-2">
                {data.objectives.quality && data.objectives.quality.map((item, i) => <li key={i}><ContentRenderer content={processContent(item)} /></li>)}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* II. THIẾT BỊ */}
      <div className="mb-6">
        <div className="flex items-center justify-between border-b border-black mb-2 pb-1">
            <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg uppercase cursor-pointer" onClick={() => setExpandedSections(p => ({...p, materials: !p.materials}))}>
                 II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
               </h3>
            </div>
            <button onClick={() => setExpandedSections(p => ({...p, materials: !p.materials}))} className="p-1 hover:bg-slate-100 rounded">
             {expandedSections.materials ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
           </button>
        </div>
        {expandedSections.materials && (
          <ul className="list-disc pl-5 ml-2 animate-fade-in text-sm leading-relaxed text-justify">
            {data.materials && data.materials.map((item, i) => <li key={i}><ContentRenderer content={processContent(item)} /></li>)}
          </ul>
        )}
      </div>

      {/* III. TIẾN TRÌNH */}
      <div>
        <h3 className="font-bold text-lg mb-4 uppercase border-b border-black inline-block">III. TIẾN TRÌNH DẠY HỌC</h3>
        
        {data.activities && data.activities.map((act, index) => (
          <div key={index} className="mb-6 border border-slate-200 rounded-lg overflow-hidden group">
            <div 
              className="bg-slate-50 p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => toggleActivity(index)}
            >
              <div className="flex items-center gap-3">
                  <h4 className="font-bold text-base border-l-4 border-gold-primary pl-2 font-sans text-slate-800">
                    {act.name}
                  </h4>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <div className="hidden group-hover:flex items-center gap-1 mr-2 animate-fade-in">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onTransform(index, 'gamification'); }}
                      className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-bold border border-yellow-200 hover:bg-yellow-200"
                    >
                      Trò chơi hoá
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onTransform(index, 'flipped'); }}
                      className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold border border-blue-200 hover:bg-blue-200"
                    >
                      Lớp học đảo ngược
                    </button>
                  </div>
                 <span className="hidden sm:inline italic font-sans text-xs">
                   {expandedSections.activities[index] ? 'Thu gọn' : 'Xem chi tiết'}
                 </span>
                 {expandedSections.activities[index] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </div>
            </div>
            
            {expandedSections.activities[index] && (
              <div className="p-5 space-y-3 animate-fade-in bg-white text-sm leading-relaxed text-justify">
                <div>
                  <span className="font-bold underline decoration-dotted">a) Mục tiêu:</span> <ContentRenderer content={processContent(act.objective)} />
                </div>
                <div className="relative group/act">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold underline decoration-dotted">b) Nội dung:</span>
                    <button 
                      onClick={() => setActiveElaborateActivity(activeElaborateActivity === index ? null : index)}
                      className="opacity-0 group-hover/act:opacity-100 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded transition-opacity flex items-center gap-1"
                    >
                      <Brain size={10} /> AI Viết chi tiết
                    </button>
                  </div>

                  {activeElaborateActivity === index && (
                    <div className="my-2 p-3 bg-slate-50 border border-slate-200 rounded-lg flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nhập yêu cầu mở rộng nội dung hoạt động..."
                        className="flex-1 bg-white border border-slate-300 rounded px-3 py-1 text-xs"
                        value={actElaborateInput}
                        onChange={(e) => setActElaborateInput(e.target.value)}
                      />
                      <button 
                        onClick={() => {
                          onElaborate(`activity_content_${index}`, actElaborateInput);
                          setActiveElaborateActivity(null);
                          setActElaborateInput("");
                        }}
                        className="bg-gold-accent text-white px-3 py-1 rounded text-xs font-bold"
                      >
                        Gửi AI
                      </button>
                    </div>
                  )}

                  <div className="pl-4 whitespace-pre-line text-slate-700">
                    <ContentRenderer content={processContent(act.content)} />
                  </div>
                </div>
                <div>
                  <span className="font-bold underline decoration-dotted">c) Sản phẩm:</span> <ContentRenderer content={processContent(act.product)} />
                </div>
                <div>
                  <span className="font-bold underline decoration-dotted block mb-2">d) Tổ chức thực hiện:</span>
                  
                  <table className="w-full border-collapse border border-slate-400 text-sm mb-3">
                    <thead>
                       <tr className="bg-slate-50">
                          <th className="border border-slate-400 p-2 w-[60%] font-bold text-center">Hoạt động của GV và HS</th>
                          <th className="border border-slate-400 p-2 w-[40%] font-bold text-center">Yêu cầu cần đạt / Sản phẩm dự kiến</th>
                       </tr>
                    </thead>
                    <tbody>
                      {act.steps && act.steps.map((step, idx) => (
                        <tr key={idx}>
                          <td className="border border-slate-400 p-3 align-top whitespace-pre-line">
                             <div className="font-bold mb-1 uppercase text-xs text-blue-700 font-sans">{step.stepName}</div>
                             <ContentRenderer content={processContent(step.teacherAction)} />
                          </td>
                          <td className="border border-slate-400 p-3 align-top bg-slate-50/50 whitespace-pre-line italic text-slate-600">
                             <ContentRenderer content={processContent(step.output)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {act.digitalIntegration && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-200 border-dashed rounded-xl font-sans shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Cpu size={80} />
                        </div>
                        <div className="flex items-center justify-between mb-3 relative z-10">
                           <div className="flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-tight">
                              <Zap className="text-blue-500" size={16} /> 
                              {act.digitalIntegration.code?.startsWith('NL') ? 'Tích hợp AI (QĐ 3439)' : 'Tích hợp NLS (TT 02)'}
                           </div>
                           <span className="text-[10px] bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold shadow-sm uppercase">{act.digitalIntegration.code}</span>
                        </div>
                        <div className="text-sm text-slate-700 relative z-10 space-y-2">
                            <p className="mb-1 leading-relaxed"><span className="font-bold text-slate-800">Yêu cầu cần đạt:</span> {act.digitalIntegration.requirement}</p>
                            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-blue-100 shadow-inner group-hover:border-blue-300 transition-colors">
                               <div className="flex items-center gap-2 mb-1 text-[11px] font-bold text-blue-600">
                                  <Brain size={12} /> HƯỚNG DẪN TRIỂN KHAI:
                               </div>
                               <div className="text-slate-600 italic">
                                  <ContentRenderer content={processContent(act.digitalIntegration.description)} />
                               </div>
                            </div>
                        </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PHỤ LỤC 1: TỔNG HỢP TÍCH HỢP NĂNG LỰC SỐ */}
      <div className="mt-12 pt-8 border-t-2 border-gold-primary/30">
        <div className="flex items-center justify-between mb-4">
           <h3 className="font-bold text-xl text-gold-dark uppercase flex items-center gap-3">
             <Database size={24} /> PHỤ LỤC 1: TỔNG HỢP TÍCH HỢP NĂNG LỰC SỐ
           </h3>
           <button onClick={() => setExpandedSections(p => ({...p, appendix1: !p.appendix1}))} className="p-2 hover:bg-gold-light rounded-full transition-colors">
             {expandedSections.appendix1 ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
           </button>
        </div>
        
        {expandedSections.appendix1 && fullData.digitalPack && (
          <div className="animate-fade-in bg-gold-light/30 p-6 rounded-xl border border-gold-primary/20">
            <p className="mb-4 text-sm italic text-slate-600">{fullData.digitalPack.summary}</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gold-accent text-white text-sm">
                    <th className="p-3 text-left border border-gold-accent">Hoạt động</th>
                    <th className="p-3 text-left border border-gold-accent">Mã NL Số</th>
                    <th className="p-3 text-left border border-gold-accent">Công cụ & Hành động</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {fullData.digitalPack.mapping && fullData.digitalPack.mapping.map((m, i) => (
                    <tr key={i} className="hover:bg-gold-light/10 transition-colors">
                      <td className="p-3 border border-slate-200 font-medium">{m.activity}</td>
                      <td className="p-3 border border-slate-200"><span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold">{m.competencyCode}</span></td>
                      <td className="p-3 border border-slate-200">
                        <span className="font-bold text-gold-dark">{m.tool}:</span> {m.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlan5512View;