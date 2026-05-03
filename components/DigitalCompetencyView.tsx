import React from 'react';
import { DigitalPack } from '../types';
import { Cpu, Brain, CheckCircle2, Zap, Target } from 'lucide-react';

interface Props {
  data: DigitalPack;
  topic: string;
}

const DigitalCompetencyView: React.FC<Props> = ({ data, topic }) => {
    if (!data) return <div className="p-8 text-center text-slate-500">Đang cập nhật dữ liệu...</div>;

    return (
    <div className="a4-container font-sans">
    <div className="flex items-center justify-center gap-3 mb-2">
        <Target className="text-gold-primary" size={24} />
        <h2 className="text-xl font-bold text-center uppercase text-gold-primary font-serif">Phụ Lục: Tích hợp Năng lực số (TT 02) & AI (QĐ 3439)</h2>
    </div>
    <p className="text-center text-sm text-slate-500 mb-8 italic">(Dành cho giáo án: {topic})</p>
    
    <div className="bg-gradient-to-r from-gold-light/50 to-white p-6 rounded-xl mb-8 text-sm text-gold-dark border border-gold-primary/20 shadow-sm">
        <div className="flex items-start gap-4">
            <Zap className="text-gold-primary shrink-0 mt-1" size={20} />
            <div>
                <strong className="block text-gold-dark mb-1 font-bold uppercase tracking-wider text-[11px]">Tổng quan chiến lược:</strong> 
                <p className="leading-relaxed">{data.summary}</p>
            </div>
        </div>
    </div>

    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full border-collapse text-sm">
        <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <th className="p-4 w-[20%] text-left font-bold text-[10px] uppercase">Mục tiêu bài học (YCCĐ SGK)</th>
            <th className="p-4 w-[25%] text-left font-bold text-[10px] uppercase">Mã tích hợp (TT 02 / QĐ 3439)</th>
            <th className="p-4 w-[25%] text-left font-bold text-[10px] uppercase">Mục tiêu chung tích hợp</th>
            <th className="p-4 w-[30%] text-left font-bold text-[10px] uppercase">Gợi ý hoạt động cụ thể</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            {data.mapping && data.mapping.map((row, idx) => (
            <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-4 align-top">
                    <div className="font-bold text-xs uppercase text-slate-800">{row.activity}</div>
                    <p className="text-[10px] text-slate-500 mt-1">Căn cứ nội dung bài dạy</p>
                </td>
                <td className="p-4 text-slate-600 align-top text-sm">
                    <div className="flex flex-col gap-1">
                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold border border-blue-100 uppercase w-fit tracking-tight">#{row.competencyCode}</span>
                        <span className="text-[10px] text-slate-400 italic font-medium">Mã năng lực/AI</span>
                    </div>
                </td>
                <td className="p-4 text-slate-600 align-top text-sm">
                    <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[11px] leading-relaxed">
                      {row.competency || 'Nâng cao năng lực giải quyết vấn đề bằng công cụ số.'}
                    </div>
                </td>
                <td className="p-4 align-top text-sm">
                    <div className="flex items-center gap-2 font-bold text-slate-700 mb-1">
                        <Brain size={14} className="text-gold-primary" />
                        <span className="text-[11px] uppercase tracking-tight">{row.tool}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 italic leading-relaxed">
                        {row.action}
                    </div>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    
    <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
        <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Thông tư 02/2025</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Quyết định 3439</span>
        </div>
        <p>Hệ thống hỗ trợ chuyên môn GDPT 2018 - Phiên bản Tích hợp AI</p>
    </div>
    </div>
    );
};


export default DigitalCompetencyView;
