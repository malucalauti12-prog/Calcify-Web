/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Calculator as CalcIcon,
  Code2,
  Terminal,
  BookOpen,
  Download
} from "lucide-react";
import { CalculatorView } from "./components/CalculatorView";
import { PythonExplorer } from "./components/PythonExplorer";
import { WindowsGuide } from "./components/WindowsGuide";
import { SoftwareEngineeringGuide } from "./components/SoftwareEngineeringGuide";
import { PYTHON_CALCIFY_CODE } from "./data/pythonCode";

export default function App() {
  const [activeTab, setActiveTab] = useState<"calc" | "code" | "windows" | "engineering">("calc");

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] text-white flex flex-col font-sans selection:bg-[#A78BFA]/30 selection:text-white">
      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      <header className="sticky top-0 z-50 bg-[#12121A]/90 backdrop-blur-md border-b border-[#232334]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* LOGO DA MARCA CALCIFY */}
          <div 
            onClick={() => setActiveTab("calc")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Símbolo com a letra C em lilás (#A78BFA) */}
            <div className="w-9 h-9 rounded-xl bg-[#27203F] border border-[#A78BFA]/40 flex items-center justify-center text-[#A78BFA] font-bold text-lg shadow-sm shadow-[#A78BFA]/15 group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-[#A78BFA] transition-colors">
                  Calcify
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#252535] text-[#A78BFA] border border-[#35354A]">
                  Python Suite
                </span>
              </div>
              <p className="text-[11px] text-[#8E8EA8] -mt-0.5 font-sans hidden sm:block">
                Make numbers simple.
              </p>
            </div>
          </div>

          {/* ABAS DE NAVEGAÇÃO PRINCIPAL */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("calc")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "calc"
                  ? "bg-[#252535] text-white border border-[#3A3A52] shadow-sm shadow-black"
                  : "text-[#8E8EA8] hover:text-white hover:bg-[#1A1A26]"
              }`}
            >
              <CalcIcon size={16} className={activeTab === "calc" ? "text-[#A78BFA]" : ""} />
              <span>Calculadora</span>
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "code"
                  ? "bg-[#252535] text-white border border-[#3A3A52] shadow-sm shadow-black"
                  : "text-[#8E8EA8] hover:text-white hover:bg-[#1A1A26]"
              }`}
            >
              <Code2 size={16} className={activeTab === "code" ? "text-[#A78BFA]" : ""} />
              <span className="hidden sm:inline">Código</span>
              <span>Python</span>
            </button>

            <button
              onClick={() => setActiveTab("windows")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "windows"
                  ? "bg-[#252535] text-white border border-[#3A3A52] shadow-sm shadow-black"
                  : "text-[#8E8EA8] hover:text-white hover:bg-[#1A1A26]"
              }`}
            >
              <Terminal size={16} className={activeTab === "windows" ? "text-[#A78BFA]" : ""} />
              <span className="hidden md:inline">Guia</span>
              <span>Windows</span>
            </button>

            <button
              onClick={() => setActiveTab("engineering")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "engineering"
                  ? "bg-[#252535] text-white border border-[#3A3A52] shadow-sm shadow-black"
                  : "text-[#8E8EA8] hover:text-white hover:bg-[#1A1A26]"
              }`}
            >
              <BookOpen size={16} className={activeTab === "engineering" ? "text-[#A78BFA]" : ""} />
              <span className="hidden lg:inline">Engenharia de</span>
              <span>Software</span>
            </button>
          </nav>

          {/* BOTÃO BAIXAR RÁPIDO DO TOPO */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={() => downloadFile("calcify.py", PYTHON_CALCIFY_CODE)}
              className="px-3.5 py-1.5 rounded-xl bg-[#A78BFA] hover:bg-[#BBA4FB] text-[#15151D] text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#A78BFA]/20 active:scale-95"
              title="Baixar arquivo calcify.py para o seu computador"
            >
              <Download size={14} />
              <span>calcify.py</span>
            </button>
          </div>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === "calc" && <CalculatorView />}
        {activeTab === "code" && <PythonExplorer />}
        {activeTab === "windows" && <WindowsGuide />}
        {activeTab === "engineering" && <SoftwareEngineeringGuide />}
      </main>

      {/* RODAPÉ ELEGANTE COM A IDENTIDADE VISUAL */}
      <footer className="mt-auto border-t border-[#1F1F2E] bg-[#0E0E14] py-8 text-xs text-[#8E8EA8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#27203F] text-[#A78BFA] font-bold text-xs flex items-center justify-center">
              C
            </div>
            <span className="font-display font-semibold text-white">Calcify</span>
            <span>—</span>
            <span>Make numbers simple.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#15151D] border border-white/20"></span>
              Fundo (#15151D)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#252535]"></span>
              Botões (#252535)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]"></span>
              Destaque (#A78BFA)
            </span>
          </div>

          <div className="text-[11px] text-[#62627A]">
            Engenharia de Software • Python 3 & Tkinter
          </div>
        </div>
      </footer>
    </div>
  );
}
