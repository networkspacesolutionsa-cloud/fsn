import React from 'react';

// Tiny formatter for admin-editable text:
//   **text** → bold, !!text!! → green bold, a line starting with "• " → its own paragraph,
//   and "Wi-Fi" never splits across lines at the hyphen.

const renderInline = (text: string, boldClass: string, keyPrefix: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|!![^!]+!!|Wi-Fi)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key} className={boldClass}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('!!') && part.endsWith('!!')) {
      return <strong key={key} className="text-blue-700 dark:text-blue-400">{part.slice(2, -2)}</strong>;
    }
    if (part === 'Wi-Fi') {
      return <span key={key} className="whitespace-nowrap">Wi-Fi</span>;
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
};

export const RichText: React.FC<{ text: string; boldClass?: string }> = ({
  text,
  boldClass = 'text-slate-900 dark:text-white',
}) => {
  const lines = text.split('\n').filter((l) => l.trim() !== '');
  if (lines.length > 1 || lines[0]?.trim().startsWith('•')) {
    return (
      <>
        {lines.map((line, i) => (
          <p key={i}>{renderInline(line, boldClass, `l${i}`)}</p>
        ))}
      </>
    );
  }
  return <>{renderInline(text, boldClass, 'l0')}</>;
};
