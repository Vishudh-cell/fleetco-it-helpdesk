import React, { useMemo } from 'react';
import { marked } from 'marked';

// Configure marked for clean, safe GFM rendering
marked.setOptions({
  gfm: true,
  breaks: true,
  pedantic: false
});

export default function MarkdownView({ content, className = '' }) {
  const html = useMemo(() => {
    if (!content) return '';
    try {
      return marked.parse(content);
    } catch (e) {
      return content;
    }
  }, [content]);

  return (
    <div
      className={`prose-custom ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
