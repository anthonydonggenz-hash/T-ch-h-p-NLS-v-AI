import React, { useState, useRef, useEffect } from 'react';
import { 
  Wand2, Sparkles, Layers, CheckCircle, File as FileIcon, User, 
  Edit3, RefreshCw, Settings, Upload, Bot, FileText, X, Brain, Save, ArrowRight, Download, FileJson,
  Facebook, Phone, MessageCircle, Users as UsersIcon, AlertCircle
} from 'lucide-react';
import LessonPlan5512View from './components/LessonPlan5512View';
import DigitalCompetencyView from './components/DigitalCompetencyView';
import { suggestFromContent, generateLessonPlan, transformActivity, elaborateSection } from './services/geminiService';
import { exportToDocx } from './utils/export';
import { TEMPLATES } from './constants';
import { FormData, ResultData } from './types';

// Định nghĩa kiểu cho window.aistudio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App = () => {
  const [currentMode, setCurrentMode] = useState<string>('home'); 
  const [formData, setFormData] = useState<FormData>({
    grade: '10', subject: '', topic: '',
    duration: '1', template: '', classLevel: 'standard', 
    integrationMode: 'inline', originalText: '', selectedFramework: 'TT02',
    textbookFileName: '', frameworkFileName: '', frameworkFileNames: [], customFrameworkFileName: ''
  });
  
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [auditResult, setAuditResult] = useState<{score: number; issues: any[]} | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Refs for file inputs
  const textbookInputRef = useRef<HTMLInputElement>(null);
  const frameworkInputRef = useRef<HTMLInputElement>(null);
  const customFrameworkInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---
  const handleGenerate = async () => {
    if (!formData.subject.trim()) { setNotification({ message: "Vui lòng điền tên Môn học!", type: 'error' }); return; }
    if (!formData.grade) { setNotification({ message: "Vui lòng chọn Lớp học!", type: 'error' }); return; }
    if (!formData.topic.trim()) { setNotification({ message: "Vui lòng điền Tên bài dạy / Chủ đề!", type: 'error' }); return; }

    setCurrentMode('loading');
    
    try {
      const mode = formData.originalText ? 'integration' : 'creation';
      
      // Ensure we pass the original text correctly
      const newResult = await generateLessonPlan(mode, formData);

      // If in integration mode, we might want to keep a copy of the truly original text for comparison
      // or just ensure resultData reflects the integration accurately.
      
      setResultData(newResult);
      setCurrentMode('result');
      setNotification({ message: mode === 'integration' ? "Đã tích hợp NLS & AI vào giáo án của bạn!" : "Đã tạo giáo án mới thành công!", type: 'success' });
    } catch (error: any) {
      console.error("Lỗi tạo giáo án:", error);
      setNotification({ message: error.message || 'Lỗi không xác định', type: 'error' });
      setCurrentMode(formData.originalText ? 'integrate_input' : 'create_input');
    }
  };

  const handleExportWord = async () => {
    if (!resultData || !resultData.lessonPlan) return;
    try {
      await exportToDocx(resultData);
      setNotification({ message: "Đang tải file Word (.docx)...", type: 'success' });
    } catch (error) {
      console.error("Lỗi xuất file Word:", error);
      setNotification({ message: "Không thể tạo file Word. Thử lại sau.", type: 'error' });
    }
  };

  const handleExportJson = () => {
    if (!resultData) {
      setNotification({ message: "Chưa có dữ liệu để xuất!", type: 'error' });
      return;
    }
    const exportData = {
      formData,
      resultData,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `Giao_an_${formData.topic.replace(/\s+/g, '_') || 'export'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.formData) setFormData(json.formData);
        if (json.resultData) {
          setResultData(json.resultData);
          setCurrentMode('result');
        }
        setNotification({ message: "Nhập dữ liệu thành công!", type: 'success' });
      } catch (err) {
        console.error("Lỗi nhập JSON:", err);
        setNotification({ message: "File JSON không hợp lệ hoặc cấu trúc sai.", type: 'error' });
      }
    };
    reader.readAsText(file);
    // Reset input
    if (e.target) e.target.value = '';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'textbook' | 'framework' | 'customFramework') => {
      if (e.target.files && e.target.files.length > 0) {
          const files = Array.from(e.target.files) as File[];
          const firstFile = files[0] as File;
          setUploadingFile(type);
          
          try {
              if (type === 'framework') {
                  const currentNames = formData.frameworkFileNames || [];
                  const newNames = files.map(f => f.name);
                  setFormData(prev => ({ 
                      ...prev, 
                      frameworkFileNames: [...currentNames, ...newNames],
                      frameworkFileName: newNames[newNames.length - 1]
                  }));
                  setNotification({ message: `Đã nhận ${files.length} file khung năng lực`, type: 'success' });
              } else {
                  const updateData: any = {};
                  if (type === 'textbook') updateData.textbookFileName = firstFile.name;
                  else if (type === 'customFramework') updateData.customFrameworkFileName = firstFile.name;
                  
                  setFormData(prev => ({ ...prev, ...updateData }));
                  setNotification({ message: `Đã nhận file: ${firstFile.name}`, type: 'success' });
              }

              // After uploading textbook, automatically suggest content if topic/subject are ready
              if (type === 'textbook' && formData.topic && formData.subject) {
                  setNotification({ message: "Phát hiện tài liệu mới, đang phân tích nội dung...", type: 'success' });
                  setIsSuggesting(true);
                  
                  const reader = new FileReader();
                  reader.onloadend = async () => {
                      const base64Data = (reader.result as string).split(',')[1];
                      const suggestion = await suggestFromContent(
                          formData.topic, 
                          formData.subject, 
                          formData.grade, 
                          { data: base64Data, mimeType: firstFile.type },
                          currentMode === 'integrate_input'
                      );
                      setFormData(prev => ({ ...prev, originalText: suggestion }));
                      setIsSuggesting(false);
                      setNotification({ message: "Đã cập nhật nội dung từ tài liệu!", type: 'success' });
                  };
                  reader.readAsDataURL(firstFile);
              }
          } catch (error) {
              console.error('File processing error:', error);
              setNotification({ message: "Lỗi xử lý file", type: 'error' });
          } finally {
              setUploadingFile(null);
              if (e.target) e.target.value = '';
          }
      }
  };

  const handleAiSuggest = async () => {
      if (!formData.topic || !formData.subject) {
          setNotification({ message: "Vui lòng nhập Môn học và Tên bài dạy trước để AI gợi ý nội dung!", type: 'error' });
          return;
      }
      setIsSuggesting(true);
      
      try {
        const aiContent = await suggestFromContent(
          formData.topic, 
          formData.subject, 
          formData.grade, 
          undefined, 
          currentMode === 'integrate_input'
        );
        setFormData(prev => ({ ...prev, originalText: aiContent }));
        setNotification({ message: "Đã có gợi ý từ AI!", type: 'success' });
      } catch (error) {
        setNotification({ message: "Không thể kết nối AI", type: 'error' });
      } finally {
        setIsSuggesting(false);
      }
  };

  const handleAudit = () => {
      setAuditResult({
          score: 98,
          issues: [{type: 'success', msg: 'Cấu trúc bài dạy rất chi tiết và đúng quy định 5512.'}]
      });
  };

  const handleTransformMethod = async (actIndex: number, methodType: string) => {
    if (!resultData) return;
    setNotification({ message: `Đang chuyển đổi hoạt động sang ${methodType}...`, type: 'success' });
    try {
      const currentAct = resultData.lessonPlan.activities[actIndex];
      const updatedAct = await transformActivity(currentAct, methodType, formData.subject, formData.grade);
      
      const newResult = { ...resultData };
      newResult.lessonPlan.activities[actIndex] = updatedAct;
      setResultData(newResult);
      setNotification({ message: "Đã chuyển đổi thành công!", type: 'success' });
    } catch (error) {
      console.error("Transform error:", error);
      setNotification({ message: "Lỗi chuyển đổi hoạt động", type: 'error' });
    }
  };

  const handleSectionElaborate = async (sectionId: string, userPrompt: string) => {
    if (!resultData) return;
    setNotification({ message: "Đang yêu cầu AI mở rộng nội dung...", type: 'success' });
    try {
      let currentContent = "";
      let sectionName = "";

      if (sectionId === 'objectives_knowledge') {
        currentContent = resultData.lessonPlan.objectives.knowledge.join("\n");
        sectionName = "Mục tiêu: Kiến thức";
      } else if (sectionId.startsWith('activity_content_')) {
        const idx = parseInt(sectionId.split('_')[2]);
        currentContent = resultData.lessonPlan.activities[idx].content;
        sectionName = `Nội dung hoạt động ${idx + 1}`;
      }

      const expanded = await elaborateSection(currentContent, userPrompt, sectionName);
      
      const newResult = { ...resultData };
      if (sectionId === 'objectives_knowledge') {
        newResult.lessonPlan.objectives.knowledge = [expanded];
      } else if (sectionId.startsWith('activity_content_')) {
        const idx = parseInt(sectionId.split('_')[2]);
        newResult.lessonPlan.activities[idx].content = expanded;
      }
      
      setResultData(newResult);
      setNotification({ message: "Đã mở rộng nội dung thành công!", type: 'success' });
    } catch (error) {
      console.error("Elaborate error:", error);
      setNotification({ message: "Lỗi mở rộng nội dung", type: 'error' });
    }
  };

  // --- RENDER SUB-VIEWS ---

  const renderInputForm = () => (
      <div className="w-full max-w-4xl bg-white p-10 rounded-xl shadow-sm border border-gray-100 animate-fade-in mx-auto mt-6 mb-10">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
              <div className={`p-3 rounded-xl ${currentMode === 'integrate_input' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-gold-accent'}`}>
                  {currentMode === 'integrate_input' ? <Layers size={28}/> : <Edit3 size={28}/>}
              </div>
              <div>
                  <h2 className="text-2xl font-bold font-serif text-slate-800">
                    {currentMode === 'integrate_input' ? 'Tích hợp Năng Lực Số & AI' : 'Soạn bài dạy mới tích hợp AI'}
                  </h2>
                  <p className="text-slate-500 text-sm italic">
                    {currentMode === 'integrate_input' 
                      ? 'Tải lên giáo án có sẵn để hệ thống tự động chèn thêm các yếu tố NLS & AI chuẩn TT 02 & QĐ 3439.'
                      : 'Nhập thông tin bài dạy để AI soạn thảo giáo án mới tích hợp sẵn các yếu tố NLS & AI.'}
                  </p>
              </div>
          </div>

          <div className="space-y-8">
              {/* Basic Info Group */}
              <div className="grid grid-cols-2 gap-6">
                  <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Môn học <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/20 transition-all text-sm" 
                        placeholder="Ví dụ: Toán Hình, Đại số..."
                        value={formData.subject} 
                        onChange={e => setFormData({...formData, subject: e.target.value})} 
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Lớp <span className="text-red-500">*</span></label>
                      <select className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/20 transition-all text-sm" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}>
                          <option value="">-- Chọn lớp --</option>
                          <option value="Mầm Non">Mầm Non</option>
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => <option key={g} value={g}>Lớp {g}</option>)}
                          <option value="Khác">Lớp khác</option>
                      </select>
                  </div>
                  <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Tên bài dạy / Chủ đề <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/20 transition-all text-sm font-semibold" 
                        placeholder="Ví dụ: Hình bình hành, Phương trình bậc hai..."
                        value={formData.topic} 
                        onChange={e => setFormData({...formData, topic: e.target.value})} 
                      />
                  </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* THREE SECTIONS: Textbook, Framework, AI Suggestion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                   {/* 1. Textbook Material / Original Lesson Plan */}
                  <div className={`border border-dashed rounded-xl p-5 hover:bg-slate-50 transition-colors ${currentMode === 'integrate_input' ? 'border-blue-400/30' : 'border-slate-300'}`}>
                      <div className="flex items-center justify-between mb-3">
                          <label className={`block text-xs font-bold uppercase tracking-widest ${currentMode === 'integrate_input' ? 'text-blue-600' : 'text-gold-dark'}`}>
                             {currentMode === 'integrate_input' ? '1. Giáo án gốc' : '1. Tài liệu SGK'}
                          </label>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Ảnh/PDF/Word/PPT</span>
                      </div>
                      
                      <input 
                        type="file" 
                        ref={textbookInputRef}
                        className="hidden" 
                        accept=".jpg,.png,.jpeg,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        onChange={(e) => handleFileChange(e, 'textbook')}
                      />
                      
                      {!formData.textbookFileName ? (
                          <div className="text-center py-6 cursor-pointer" onClick={() => !uploadingFile && textbookInputRef.current?.click()}>
                              {uploadingFile === 'textbook' ? (
                                <RefreshCw className={`mx-auto mb-2 animate-spin ${currentMode === 'integrate_input' ? 'text-blue-500' : 'text-gold-accent'}`} size={24} />
                              ) : (
                                <Upload className="mx-auto text-slate-300 mb-2" size={24} />
                              )}
                              <p className="text-xs text-slate-500">
                                {uploadingFile === 'textbook' ? 'Đang tải lên...' : currentMode === 'integrate_input' ? 'Tải lên FILE giáo án cũ' : 'Tải lên tài liệu bộ môn'}
                              </p>
                          </div>
                      ) : (
                          <div className={`flex items-center gap-2 p-3 rounded-lg border ${currentMode === 'integrate_input' ? 'bg-blue-50 border-blue-200' : 'bg-gold-light border-gold-primary/20'}`}>
                              <FileText size={20} className={currentMode === 'integrate_input' ? 'text-blue-600' : 'text-gold-dark'} />
                              <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{formData.textbookFileName}</p>
                                  <p className="text-[10px] text-slate-500">Đã nhận file nguồn</p>
                              </div>
                              <X size={16} className="text-slate-400 cursor-pointer hover:text-red-500" onClick={() => setFormData({...formData, textbookFileName: ''})} />
                          </div>
                      )}
                  </div>

                  {/* 2. Digital Framework */}
                  <div className="border border-dashed border-slate-300 rounded-xl p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">2. Khung NLS</label>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Ảnh/PDF/PPT/Excel</span>
                      </div>
                      
                      <input 
                        type="file" 
                        ref={frameworkInputRef}
                        className="hidden" 
                        accept=".jpg,.png,.jpeg,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        multiple
                        onChange={(e) => handleFileChange(e, 'framework')}
                      />

                      {(!formData.frameworkFileNames || formData.frameworkFileNames.length === 0) ? (
                          <div className="text-center py-6 cursor-pointer" onClick={() => !uploadingFile && frameworkInputRef.current?.click()}>
                              {uploadingFile === 'framework' ? (
                                <RefreshCw className="mx-auto text-gold-accent mb-2 animate-spin" size={24} />
                              ) : (
                                <Layers className="mx-auto text-slate-300 mb-2" size={24} />
                              )}
                              <p className="text-xs text-slate-500">{uploadingFile === 'framework' ? 'Đang tải lên...' : 'Tải lên khung năng lực (chọn nhiều file)'}</p>
                          </div>
                      ) : (
                          <div className="space-y-2">
                              {(formData.frameworkFileNames || []).map((fileName, idx) => (
                                  <div key={idx} className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg border border-slate-200">
                                      <FileText size={16} className="text-slate-500" />
                                      <div className="flex-1 min-w-0">
                                          <p className="text-[10px] font-bold text-slate-800 truncate">{fileName}</p>
                                      </div>
                                      <X 
                                          size={14} 
                                          className="text-slate-400 cursor-pointer hover:text-red-500" 
                                          onClick={() => {
                                              const newFiles = (formData.frameworkFileNames || []).filter((_, fIdx) => fIdx !== idx);
                                              setFormData({...formData, frameworkFileNames: newFiles, frameworkFileName: newFiles.length > 0 ? newFiles[newFiles.length-1] : ''});
                                          }} 
                                      />
                                  </div>
                              ))}
                              <button 
                                onClick={() => frameworkInputRef.current?.click()}
                                className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors mt-2"
                              >
                                + Thêm file khác
                              </button>
                          </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-slate-100">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Chọn Khung Năng Lực & AI tích hợp</label>
                          <select 
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-gold-accent transition-all font-medium"
                              value={formData.selectedFramework}
                              onChange={e => setFormData({...formData, selectedFramework: e.target.value})}
                          >
                              <option value="TT02">Thông tư 02 (NLS Người học)</option>
                              <option value="TT18">Thông tư 18 (NLS Giáo viên)</option>
                              <option value="QD3439">Quyết định 3439 (Giáo dục AI)</option>
                              <option value="TT02_QD3439">Khung NLS theo Thông tư 02 và QĐ 3439</option>
                          </select>
                      </div>
                  </div>

                   {/* 3. AI Suggestion (Full Width) */}
                  <div className={`col-span-1 md:col-span-2 border rounded-xl p-5 relative overflow-hidden ${currentMode === 'integrate_input' ? 'border-blue-400/30 bg-blue-50/10' : 'border-gold-primary/30 bg-yellow-50/30'}`}>
                      <div className={`absolute top-0 left-0 w-1 h-full ${currentMode === 'integrate_input' ? 'bg-blue-500' : 'bg-gold-primary'}`}></div>
                      <div className="flex items-center justify-between mb-4">
                          <label className="block text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                             <Sparkles size={14} className={currentMode === 'integrate_input' ? 'text-blue-500' : 'text-gold-primary'} /> 
                             {currentMode === 'integrate_input' ? '3. Nội dung giáo án gốc cần tích hợp' : '3. Nội dung bài dạy (Gợi ý từ AI)'}
                          </label>
                          <button 
                             onClick={handleAiSuggest}
                             disabled={isSuggesting}
                             className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-[10px] font-bold transition-all disabled:opacity-50 ${currentMode === 'integrate_input' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800 hover:bg-slate-700'}`}
                           >
                             {isSuggesting ? <RefreshCw size={12} className="animate-spin" /> : <Brain size={12} />} 
                             {isSuggesting ? 'Đang phân tích...' : currentMode === 'integrate_input' ? 'Trích xuất từ tài liệu đã tải' : 'Soạn sơ bộ bằng AI'}
                          </button>
                      </div>

                      {!formData.originalText ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-slate-300 rounded-lg bg-white/50">
                               <p className="text-xs text-slate-500 mb-1">{currentMode === 'integrate_input' ? 'Chưa có nội dung giáo án' : 'Chưa có nội dung gợi ý'}</p>
                               <p className="text-[10px] text-slate-400 italic">
                                 {currentMode === 'integrate_input' 
                                   ? 'Vui lòng dán giáo án hoặc nhấn "Trích xuất" sau khi đã tải file ở mục 1.' 
                                   : 'Điền Môn, Lớp, Chủ đề và nhấn "Soạn sơ bộ" để AI hỗ trợ trích xuất kiến thức chuẩn.'}
                               </p>
                          </div>
                      ) : (
                         <div className="animate-fade-in">
                             <textarea 
                                className="w-full bg-white border border-slate-200 rounded-lg p-4 focus:outline-none focus:border-gold-accent text-sm text-slate-700 min-h-[160px] shadow-inner font-mono leading-relaxed" 
                                value={formData.originalText} 
                                onChange={e => setFormData({...formData, originalText: e.target.value})}
                                placeholder={currentMode === 'integrate_input' ? "Dán giáo án gốc của bạn vào đây..." : "Nội dung bài dạy sẽ hiển thị ở đây..."}
                             ></textarea>
                             <p className="text-[10px] text-right text-slate-400 mt-2 italic">* Nội dung này sẽ được bảo tồn và bổ sung thêm các yếu tố NLS & AI.</p>
                         </div>
                      )}
                  </div>
              </div>

              <div className="pt-4">
                   <button 
                    id="main-generate-button"
                    onClick={handleGenerate} 
                    className={`w-full py-4 rounded-xl text-white shadow-lg hover:shadow-xl hover:brightness-110 active:translate-y-0.5 transition-all font-bold text-lg flex items-center justify-center gap-2 uppercase tracking-widest ${currentMode === 'integrate_input' ? 'bg-gradient-to-br from-blue-500 to-tech-blue' : 'bg-gradient-to-br from-gold-accent to-gold-primary'}`}
                  >
                      <Wand2 size={24} />
                      {currentMode === 'integrate_input' ? 'Tích hợp NLS & AI vào bài dạy' : 'Tạo Giáo Án Mới tích hợp NLS & AI'}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-3 italic">Hệ thống tự động render công thức Toán học, biểu đồ và hình học chuẩn SVG.</p>
              </div>
          </div>
      </div>
  );

  return (
    <div className="flex h-screen w-full bg-premium">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-slide-up border ${
          notification.type === 'success' ? 'bg-white border-green-100 text-green-600' : 'bg-white border-red-100 text-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{notification.message}</p>
        </div>
      )}
      
      {/* SIDEBAR */}
      <aside className="w-72 h-full flex flex-col bg-[#050B18] z-20 text-slate-300 shadow-2xl border-r border-tech-blue/10">
        <div className="p-6 flex flex-col h-full bg-gradient-to-b from-[#0F172A] to-[#050B18]">
            {/* Logo Area */}
            <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => setCurrentMode('home')}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-accent to-gold-primary flex items-center justify-center shadow-lg">
                    <Wand2 className="text-white" size={20} />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white text-xs font-bold leading-tight tracking-tight uppercase line-clamp-2">Công cụ AI - Năng Lực Số & AI</h1>
                    <p className="text-gold-primary text-[9px] font-bold uppercase tracking-widest mt-1">Cùng thầy Trần Đông</p>
                </div>
            </div>

            {/* Teacher Info & Social Links */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <p className="text-[10px] font-bold text-gold-accent uppercase tracking-widest mb-2">Thông tin Giảng viên</p>
                <div className="flex flex-col gap-3">
                    <a href="https://edunexathaytrandong.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-slate-400 hover:text-white transition-colors">
                        <Bot size={14} className="text-gold-accent" /> <span>Website của tôi</span>
                    </a>
                    <a href="https://zalo.me/3315699850490636950" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-slate-400 hover:text-white transition-colors">
                        <MessageCircle size={14} className="text-green-400" /> <span>Zalo: Thầy Trần Đông</span>
                    </a>
                    <a href="https://www.facebook.com/tranvandong.vietnam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-slate-400 hover:text-white transition-colors">
                        <Facebook size={14} className="text-blue-400" /> <span>Facebook cá nhân</span>
                    </a>
                    <a href="https://www.facebook.com/groups/24037123512640076" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-slate-400 hover:text-white transition-colors">
                        <UsersIcon size={14} className="text-gold-primary" /> <span>Cộng đồng AI cho GV</span>
                    </a>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 mb-8">
                <div 
                    onClick={() => {
                        setCurrentMode('create_input');
                        setResultData(null);
                        setFormData(prev => ({ ...prev, originalText: '' }));
                    }} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                        currentMode === 'create_input' 
                        ? 'bg-tech-blue shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white scale-[1.02]' 
                        : 'hover:bg-white/10 text-slate-400 hover:text-white'
                    }`}
                >
                    <Sparkles size={18} className={currentMode === 'create_input' ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} /> 
                    <span className="text-sm font-bold tracking-wide">Soạn bài mới</span>
                </div>
                <div 
                    onClick={() => {
                        setCurrentMode('integrate_input');
                        setResultData(null);
                        setFormData(prev => ({ ...prev, originalText: '' }));
                    }} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                        currentMode === 'integrate_input' 
                        ? 'bg-tech-blue shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white scale-[1.02]' 
                        : 'hover:bg-white/10 text-slate-400 hover:text-white'
                    }`}
                >
                    <Layers size={18} className={currentMode === 'integrate_input' ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} /> 
                    <span className="text-sm font-bold tracking-wide">Tích hợp NLS & AI</span>
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col gap-4">
                {currentMode === 'result' && (
                    <>
                        <button onClick={handleAudit} className="bg-gradient-to-br from-gold-accent to-gold-primary flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold tracking-wide transition-all active:scale-95 hover:brightness-110 shadow-lg">
                            <CheckCircle size={18} /> <span>Kiểm tra sư phạm</span>
                        </button>
                        {auditResult && (
                            <div className="bg-slate-800 p-3 rounded border border-green-500/30 text-xs text-green-400 animate-fade-in">
                                <p className="font-bold">Điểm sư phạm: {auditResult.score}/100</p>
                                <p className="opacity-80">{auditResult.issues[0].msg}</p>
                            </div>
                        )}
                        <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                            <div onClick={handleExportWord} className="flex h-9 items-center gap-2 rounded-full bg-slate-800 px-4 cursor-pointer hover:bg-slate-700 transition-colors border border-gold-accent/20 w-full justify-center">
                                <FileIcon size={14} className="text-gold-accent" />
                                <p className="text-white text-xs font-semibold">Xuất File Word Giáo Án đã Tích hợp</p>
                            </div>
                            <div onClick={handleExportJson} className="flex h-9 items-center gap-2 rounded-full bg-slate-800 px-4 cursor-pointer hover:bg-slate-700 transition-colors border border-blue-400/20 w-full justify-center">
                                <FileJson size={14} className="text-blue-400" />
                                <p className="text-white text-xs font-semibold">Xuất JSON</p>
                            </div>
                        </div>
                    </>
                )}
                
                <div className="flex flex-col gap-2">
                    <input 
                      type="file" 
                      ref={jsonInputRef} 
                      className="hidden" 
                      accept=".json" 
                      onChange={handleImportJson} 
                    />
                    <div 
                      onClick={() => jsonInputRef.current?.click()}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/5 hover:text-white transition-all text-slate-400"
                    >
                      <Download size={18} className="rotate-180" /> <span className="text-sm font-medium">Nhập dữ liệu (JSON)</span>
                    </div>
                </div>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-premium">
        {/* Background Decor */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] -z-10"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tech-blue/10 rounded-full blur-[140px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-tech-blue-dark/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 -translate-y-1/2"></div>

        {/* Top Bar (Tabs) - REMOVED AS PER USER REQUEST */}
        {currentMode === 'result' && (
            <header className="w-full py-6 px-10 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold-accent rounded-lg text-white">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 font-serif">Kế hoạch bài dạy chi tiết</h2>
                        <p className="text-xs text-slate-500 font-medium">Đã tích hợp Năng lực số (TT 02) & Tích hợp AI (QĐ 3439)</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden lg:block">
                        <p className="text-xs text-slate-400 font-medium leading-none">Chế độ Offline</p>
                        <p className="text-[10px] text-gold-primary font-bold uppercase tracking-tighter mt-1">Secured by TD-AI</p>
                    </div>
                </div>
            </header>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-10 pb-20 scrollbar-thin scrollbar-thumb-tech-blue/20 hover:scrollbar-thumb-tech-blue/40">
            {currentMode === 'home' && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight mb-4 leading-tight text-slate-800 uppercase">
                        Công cụ AI <br/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-blue to-blue-600 text-2xl md:text-4xl block mt-2">
                            Tích hợp Năng Lực Số và Tích Hợp AI
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl font-serif font-bold text-slate-500 mb-10 tracking-wide">Cùng thầy Trần Đông</p>
                    <div className="flex gap-6 mt-4">
                        <button onClick={() => setCurrentMode('create_input')} className="px-10 py-5 rounded-2xl bg-gradient-to-br from-sidebar to-tech-blue-dark text-white font-bold shadow-2xl hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center gap-3 border border-white/10 text-lg">
                            <Sparkles size={20}/> Bắt đầu ngay
                        </button>
                    </div>

                    <div className="mt-16 flex items-center justify-center gap-8 border-t border-slate-200 pt-8">
                        <a href="https://edunexathaytrandong.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-tech-blue transition-all">
                            <Bot size={18} /> Website
                        </a>
                        <a href="https://zalo.me/3315699850490636950" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-green-500 transition-all">
                            <MessageCircle size={18} /> Zalo hỗ trợ
                        </a>
                    </div>
                </div>
            )}

            {(currentMode === 'create_input' || currentMode === 'integrate_input') && (
                <div className="flex justify-center pt-10">
                    {renderInputForm()}
                </div>
            )}

            {currentMode === 'loading' && (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 border-4 border-gold-accent/30 border-t-gold-accent rounded-full animate-spin mb-6"></div>
                    <h3 className="text-xl font-bold text-gold-dark font-serif">AI đang kiến tạo bài dạy tinh hoa...</h3>
                    <p className="text-sm text-slate-500 mt-2 font-medium italic">Đang tích hợp Năng lực số (TT 02) & Trình độ AI (QĐ 3439)</p>
                </div>
            )}

            {currentMode === 'result' && resultData && (
                <div className="max-w-[1000px] mx-auto pb-10">
                    <LessonPlan5512View 
                        fullData={resultData} 
                        onTransform={handleTransformMethod} 
                        onElaborate={handleSectionElaborate} 
                    />
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;