import React, { useRef, useEffect } from 'react';
import katex from 'katex';

interface Props {
  content: string;
}

const ContentRenderer: React.FC<Props> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && content) {
      const renderContent = (text: string) => {
        // Split by SVG tags first to avoid injecting <br/> inside them
        const svgParts = text.split(/(<svg[\s\S]*?<\/svg>)/g);
        
        return svgParts.map(svgPart => {
          if (svgPart.startsWith('<svg') && svgPart.endsWith('</svg>')) {
            // Wrap SVG in a centered container for better display
            return `<div class="flex justify-center my-4">${svgPart}</div>`;
          } else {
            // Process text and math
            const mathParts = svgPart.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
            return mathParts.map((part) => {
              if (part.startsWith('$$') && part.endsWith('$$')) {
                // Block math
                const formula = part.slice(2, -2);
                try {
                  return katex.renderToString(formula, { displayMode: true, throwOnError: false });
                } catch (e) {
                  return part;
                }
              } else if (part.startsWith('$') && part.endsWith('$')) {
                // Inline math
                const formula = part.slice(1, -1);
                try {
                  return katex.renderToString(formula, { displayMode: false, throwOnError: false });
                } catch (e) {
                  return part;
                }
              } else {
                 // Regular text: replace newlines with <br/>
                 return part.replace(/\n/g, '<br/>');
              }
            }).join('');
          }
        }).join('');
      };

      containerRef.current.innerHTML = renderContent(content);
    }
  }, [content]);
  
  if (!content) return null;
  
  return <div ref={containerRef} className="content-renderer text-slate-700 leading-relaxed"></div>;
};

export default ContentRenderer;