"use client";
import React, { ReactNode } from "react";

interface EditorLayoutProps {
  children: ReactNode;
  title: string;
  color: string;
  logoSrc?: string;
  onExecute: () => void;
  output: string;
  isHtml?: boolean;
  isLoading?: boolean;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  children,
  title,
  color,
  logoSrc,
  onExecute,
  output,
  isHtml = false,
  isLoading = false,
}) => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-dark-400/30 rounded-xl border border-dark-100/30 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div 
          className="flex items-center gap-3 px-5 py-3 rounded-lg bg-dark-500/50 shadow-md" 
          style={{ borderLeft: `4px solid ${color}` }}
        >
          {logoSrc && (
            <img 
              src={logoSrc} 
              alt={`${title} logo`} 
              className="w-7 h-7" 
            />
          )}
          <h2 
            className="font-bold text-xl" 
            style={{ color }}
          >
            {title}
          </h2>
        </div>
        <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-500/30 hover:bg-dark-500/50 transition-all">
          <img 
            src="/logo.svg" 
            alt="CodePadawan Logo" 
            className="w-8 h-8" 
          />
          <span className="font-bold text-gradient">CodePadawan</span>
        </a>
      </div>

      <div className="mb-5 border border-dark-100/50 rounded-lg overflow-hidden shadow-lg">
        {children}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onExecute}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          style={{ 
            backgroundColor: color,
            color: ['#FFEB3B', '#FF9800'].includes(color) ? '#000' : '#fff'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          {isLoading ? "Cargando..." : "Ejecutar Código"}
        </button>
      </div>

      <div className="mt-5 p-5 bg-dark-600 text-white rounded-lg border border-dark-100/30 shadow-inner">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-dark-100/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <strong className="text-gray-200">Resultado</strong>
        </div>
        {isHtml ? (
          <div className="p-2 bg-dark-700/50 rounded" dangerouslySetInnerHTML={{ __html: output }} />
        ) : (
          <pre className="p-3 bg-dark-700/50 rounded whitespace-pre-wrap font-mono text-sm">
            {output || "Aquí se mostrará la salida del código..."}
          </pre>
        )}
      </div>
    </div>
  );
};

export default EditorLayout;