import { ResultData } from "../types";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
};

const getHighlightParts = (text: string) => {
  if (!text) return [{ text: "", highlight: false }];
  const parts = [];
  const regex = /<span style="color:red">(.*?)<\/span>|\[NỘI DUNG TÍCH HỢP\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.substring(lastIndex, match.index), highlight: false });
    }
    parts.push({ text: match[1] || "[NỘI DUNG TÍCH HỢP]", highlight: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.substring(lastIndex), highlight: false });
  }

  return parts;
};

export const exportToDocx = async (fullData: ResultData) => {
  const data = fullData.lessonPlan;
  if (!data) return;

  const sections = [];

  // Title page / Header
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "KHUNG KẾ HOẠCH BÀI DẠY", bold: true }),
        new TextRun({ text: "\n(Kèm theo Công văn số 5512/BGDĐT-GDTrH)", italics: true, break: 1 }),
        new TextRun({ text: "\nCăn cứ: Thông tư 02/2025/TT-BGDĐT & Quyết định 3439/QĐ-BGDĐT", bold: true, color: "C5A021", break: 1 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({ text: `TÊN BÀI DẠY: ${data.topic.toUpperCase()}`, bold: true, break: 2 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `Môn học: ${data.subject}; Lớp: ${data.grade}`, break: 1 }),
      ],
    })
  );

  // I. Objectives
  sections.push(
    new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: "I. MỤC TIÊU", bold: true, break: 2 })] }),
    new Paragraph({ children: [new TextRun({ text: "1. Về kiến thức:", bold: true })] }),
    ...data.objectives.knowledge.map(item => new Paragraph({ bullet: { level: 0 }, children: [new TextRun(stripHtml(item))] })),
    
    new Paragraph({ children: [new TextRun({ text: "2. Về năng lực:", bold: true, break: 1 })] }),
    ...data.objectives.competency.map(item => new Paragraph({ bullet: { level: 0 }, children: [new TextRun(stripHtml(item))] })),
    
    new Paragraph({ children: [new TextRun({ text: "3. Về phẩm chất:", bold: true, break: 1 })] }),
    ...data.objectives.quality.map(item => new Paragraph({ bullet: { level: 0 }, children: [new TextRun(stripHtml(item))] }))
  );

  // II. Materials
  sections.push(
    new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: "II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU", bold: true, break: 2 })] }),
    ...data.materials.map(item => new Paragraph({ bullet: { level: 0 }, children: [new TextRun(stripHtml(item))] }))
  );

  // III. Activities
  sections.push(
    new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: "III. TIẾN TRÌNH DẠY HỌC", bold: true, break: 2 })] })
  );

  data.activities.forEach((act, idx) => {
    sections.push(
      new Paragraph({
        shading: { fill: "F2F2F2" },
        children: [new TextRun({ text: `${act.name}`, bold: true, size: 28 })]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "a) Mục tiêu: ", bold: true }),
          ...getHighlightParts(act.objective).map(p => new TextRun({ text: p.text, color: p.highlight ? "FF0000" : undefined, bold: p.highlight }))
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "b) Nội dung: ", bold: true }),
          ...getHighlightParts(act.content).map(p => new TextRun({ text: p.text, color: p.highlight ? "FF0000" : undefined, bold: p.highlight }))
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "c) Sản phẩm: ", bold: true }),
          ...getHighlightParts(act.product).map(p => new TextRun({ text: p.text, color: p.highlight ? "FF0000" : undefined, bold: p.highlight }))
        ]
      }),
      new Paragraph({
        children: [new TextRun({ text: "d) Tổ chức thực hiện: ", bold: true })]
      })
    );

    const rows = [
      new TableRow({
        children: [
          new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, shading: { fill: "E0E0E0" }, children: [new Paragraph({ children: [new TextRun({ text: "Hoạt động của GV và HS", bold: true })] })] }),
          new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, shading: { fill: "E0E0E0" }, children: [new Paragraph({ children: [new TextRun({ text: "Yêu cầu cần đạt", bold: true })] })] }),
        ]
      })
    ];

    act.steps.forEach(step => {
      rows.push(new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: step.stepName, bold: true, underline: {} })] }),
              ...getHighlightParts(step.teacherAction).map(p => new Paragraph({ children: [new TextRun({ text: p.text, color: p.highlight ? "FF0000" : undefined, bold: p.highlight })] }))
            ]
          }),
          new TableCell({
            children: [
              ...getHighlightParts(step.output).map(p => new Paragraph({ children: [new TextRun({ text: p.text, color: p.highlight ? "FF0000" : undefined, italics: true })] }))
            ]
          }),
        ]
      }));
    });

    sections.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));

    if (act.digitalIntegration) {
      sections.push(
        new Paragraph({
          spacing: { before: 200 },
          border: { left: { color: "C5A021", size: 4 * 8, style: BorderStyle.SINGLE } },
          shading: { fill: "F9F6E5" },
          children: [
            new TextRun({ text: "[TÍCH HỢP NLS & AI - TT 02 & QĐ 3439]", bold: true, color: "FF0000" }),
            new TextRun({ text: `\n${stripHtml(act.digitalIntegration.description)}`, break: 1 })
          ]
        })
      );
    }
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: sections,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Giao_an_${data.topic.replace(/\s+/g, '_')}.docx`);
};

const highlightIntegration = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/<span style="color:red">(.*?)<\/span>/g, '<span style="color:red; font-weight:bold">$1</span>')
    .replace(/\[NỘI DUNG TÍCH HỢP - TÔ MÀU ĐỎ\]/g, '<span style="color:red; font-weight:bold">[NỘI DUNG TÍCH HỢP]</span>')
    .replace(/\[NỘI DUNG TÍCH HỢP\]/g, '<span style="color:red; font-weight:bold">[NỘI DUNG TÍCH HỢP]</span>')
    .replace(/\n/g, '<br/>');
};

export const renderWordHTML = (fullData: ResultData): string => {
  const data = fullData.lessonPlan;
  if (!data || !data.activities) return "";
  
  const activitiesHtml = data.activities.map(act => {
      const digitalBlock = act.digitalIntegration ? `
        <div style="border: 1px solid #C5A021; background-color: #F9F6E5; padding: 10px; margin-top: 10px; font-size: 11pt; border-left: 4px solid #C5A021;">
           <b style="color:red;">[TÍCH HỢP NLS & AI - TT 02 & QĐ 3439]</b><br/>
           ${highlightIntegration(act.digitalIntegration.description)}
        </div>
      ` : '';

      return `
        <div style="margin-bottom: 20px;">
          <h4 style="font-weight: bold; background-color: #f2f2f2; padding: 5px; text-transform: uppercase;">${act.name}</h4>
          <p><b>a) Mục tiêu:</b> ${highlightIntegration(act.objective)}</p>
          <p><b>b) Nội dung:</b><br/>${highlightIntegration(act.content)}</p>
          <p><b>c) Sản phẩm:</b> ${highlightIntegration(act.product)}</p>
          <p><b>d) Tổ chức thực hiện:</b></p>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
            <thead>
              <tr>
                <th style="width: 60%; background-color: #e0e0e0; border: 1px solid black; padding: 5px;">Hoạt động của GV và HS</th>
                <th style="width: 40%; background-color: #e0e0e0; border: 1px solid black; padding: 5px;">Yêu cầu cần đạt</th>
              </tr>
            </thead>
            <tbody>
              ${act.steps.map(step => `
                <tr>
                  <td style="border: 1px solid black; padding: 5px;">
                    <div style="font-weight: bold; text-decoration: underline;">${step.stepName}</div>
                    ${highlightIntegration(step.teacherAction)}
                  </td>
                  <td style="border: 1px solid black; padding: 5px;"><i>${highlightIntegration(step.output)}</i></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${digitalBlock}
        </div>
      `;
  }).join('');

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Giáo án</title>
    <style>
      body { font-family: 'Times New Roman'; font-size: 13pt; line-height: 1.5; }
      h1, h2, h3 { color: #2c3e50; }
      table { border-collapse: collapse; width: 100%; border: 1px solid black; margin-bottom: 20px; }
      th, td { border: 1px solid black; padding: 8px; vertical-align: top; }
      .red { color: red; font-weight: bold; }
    </style>
    </head><body>
    <div style="text-align: center; margin-bottom: 20px;">
      <p style="font-weight: bold;">KHUNG KẾ HOẠCH BÀI DẠY</p>
      <p style="font-style: italic;">(Kèm theo Công văn số 5512/BGDĐT-GDTrH)</p>
      <p style="font-weight: bold; color: #C5A021;">Căn cứ: Thông tư 02/2025/TT-BGDĐT & Quyết định 3439/QĐ-BGDĐT</p>
    </div>
    <h1 style="font-size: 16pt; margin-top: 20px; text-align: center; text-transform: uppercase;">TÊN BÀI DẠY: ${data.topic.toUpperCase()}</h1>
    <p style="text-align: center;">Môn học: ${data.subject}; Lớp: ${data.grade}</p>
    
    <h3>I. MỤC TIÊU</h3>
    <p><b>1. Về kiến thức:</b></p><ul>${data.objectives.knowledge.map(i => `<li>${i}</li>`).join('')}</ul>
    <p><b>2. Về năng lực:</b></p><ul>${data.objectives.competency.map(i => `<li>${i}</li>`).join('')}</ul>
    <p><b>3. Về phẩm chất:</b></p><ul>${data.objectives.quality.map(i => `<li>${i}</li>`).join('')}</ul>

    <h3>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3>
    <ul>${data.materials.map(i => `<li>${i}</li>`).join('')}</ul>

    <h3>III. TIẾN TRÌNH DẠY HỌC</h3>
    ${activitiesHtml}

    <br clear="all" style="page-break-before:always" />
    <h2 style="text-align: center; text-transform: uppercase; color: #C5A021; border-bottom: 2px solid #C5A021; padding-bottom: 10px;">PHỤ LỤC 1: TỔNG HỢP TÍCH HỢP NĂNG LỰC SỐ</h2>
    <p>${fullData.digitalPack.summary}</p>
    <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="border: 1px solid black; padding: 5px;">Hoạt động</th>
          <th style="border: 1px solid black; padding: 5px;">Mã NL Số</th>
          <th style="border: 1px solid black; padding: 5px;">Công cụ/Hành động</th>
        </tr>
      </thead>
      <tbody>
        ${fullData.digitalPack.mapping.map(m => `
          <tr>
            <td style="border: 1px solid black; padding: 5px;">${m.activity}</td>
            <td style="border: 1px solid black; padding: 5px;">${m.competencyCode}</td>
            <td style="border: 1px solid black; padding: 5px;"><b>${m.tool}:</b> ${m.action}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    </body></html>
  `;
};

