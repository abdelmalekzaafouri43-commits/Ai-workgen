import React, { useEffect } from 'react';
import { Printer, FileText } from 'lucide-react';

interface PrintPreviewModalProps {
  isActive: boolean;
  onCancel: () => void;
  onPrint: () => void;
  children: React.ReactNode;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isActive,
  onCancel,
  onPrint,
  children,
}) => {
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isActive]);

  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <div className="print-preview-modal fixed inset-0 z-[100] flex flex-col bg-slate-900/95 backdrop-blur-sm animate-in fade-in">
      {/* Top Toolbar */}
      <div className="print-preview-toolbar flex items-center justify-between p-4 bg-slate-950/90 border-b border-white/10 shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">Print Preview</h2>
            <p className="text-slate-400 text-xs">Verify layout before physical printing</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Now</span>
          </button>
        </div>
      </div>

      {/* Scrollable Preview Area */}
      <div className="print-preview-scroll-area flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
        <div className="print-preview-paper w-full max-w-[210mm] shadow-2xl rounded-sm bg-white overflow-hidden transition-all">
          {children}
        </div>
      </div>
    </div>
  );
};
