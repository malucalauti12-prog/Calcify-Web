import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import {
  PYTHON_CALCIFY_CODE,
  CODE_CONCEPTS,
  CodeConcept
} from "../data/pythonCode";

export const PythonExplorer: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<string>("all");
  const [copied, setCopied] = useState(false);
  const [activeTabFile, setActiveTabFile] = useState<"calcify.py" | "calculator_core.py" | "test_calcify.py">("calcify.py");

  const lines = PYTHON_CALCIFY_CODE.split("\n");

  const activeConceptData = CODE_CONCEPTS.find((c) => c.id === selectedConcept);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_CALCIFY_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
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
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* HEADER DO EXPLORADOR */}
      <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#232334]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-mono text-[#A78BFA] font-semibold flex items-center gap-1.5">
                <FileCode size={14} />
                Código-Fonte em Python (Tkinter)
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                100% Funcional & Testado
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Explorador Didático do Código Calcify
            </h2>
            <p className="text-[#8E8EA8] text-sm max-w-2xl leading-relaxed">
              Desenvolvido com foco no aprendizado de Engenharia de Software para iniciantes. Veja abaixo o código completo com separação clara de responsabilidades, comentários detalhados e filtros conceituais interativos.
            </p>
          </div>

          {/* BOTÕES DE AÇÃO: COPIAR & BAIXAR */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-[#252535] hover:bg-[#323246] text-white text-sm font-medium transition-all flex items-center gap-2 active:scale-95 border border-[#323246]"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              {copied ? "Copiado para o Clipboard!" : "Copiar Código Python"}
            </button>

            <button
              onClick={() => handleDownloadFile("calcify.py", PYTHON_CALCIFY_CODE)}
              className="px-5 py-2.5 rounded-xl bg-[#A78BFA] hover:bg-[#BBA4FB] text-[#15151D] text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-[#A78BFA]/20 active:scale-95"
            >
              <Download size={16} />
              Baixar calcify.py
            </button>
          </div>
        </div>

        {/* FILTROS CONCEITUAIS DIDÁTICOS (REQUISITO 5 DO PROMPT) */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8E8EA8] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-[#A78BFA]" />
              Identificar Componentes do Código (Clique para Realçar):
            </span>
            {selectedConcept !== "all" && (
              <button
                onClick={() => setSelectedConcept("all")}
                className="text-xs text-[#A78BFA] hover:underline"
              >
                Limpar Destaque
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedConcept("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedConcept === "all"
                  ? "bg-white text-[#15151D] font-semibold"
                  : "bg-[#1E1E2C] text-[#8E8EA8] hover:text-white border border-[#2B2B3D]"
              }`}
            >
              Exibir Tudo
            </button>

            {CODE_CONCEPTS.map((concept) => {
              const isSelected = selectedConcept === concept.id;
              return (
                <button
                  key={concept.id}
                  onClick={() => setSelectedConcept(isSelected ? "all" : concept.id)}
                  style={{
                    backgroundColor: isSelected ? concept.color : "#1E1E2C",
                    color: isSelected ? "#0F0F15" : "#D1D1E0",
                    borderColor: isSelected ? concept.color : "#2B2B3D",
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isSelected ? "font-bold shadow-md" : "hover:border-[#A78BFA]/50"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? "#0F0F15" : concept.color }}
                  />
                  {concept.label}
                </button>
              );
            })}
          </div>

          {/* EXPLICAÇÃO DO CONCEITO ATUAL SELECIONADO */}
          {activeConceptData && (
            <div
              className="mt-3 p-3.5 rounded-xl text-xs flex items-start gap-3 border"
              style={{
                backgroundColor: activeConceptData.badgeBg,
                borderColor: activeConceptData.badgeBorder,
                color: "#FFFFFF",
              }}
            >
              <Info size={16} className="mt-0.5 shrink-0 text-[#A78BFA]" />
              <div>
                <strong className="font-semibold block text-sm" style={{ color: activeConceptData.color }}>
                  {activeConceptData.label}:
                </strong>
                <p className="text-[#D8D8E8] mt-0.5 leading-relaxed">{activeConceptData.description}</p>
                <div className="text-[11px] opacity-75 mt-1 font-mono">
                  Linhas destacadas no código abaixo: {activeConceptData.lines.slice(0, 8).join(", ")}
                  {activeConceptData.lines.length > 8 ? "..." : ""}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VISUALIZADOR DE CÓDIGO COM LINHAS NUMERADAS */}
      <div className="bg-[#12121A] border border-[#2B2B3D] rounded-3xl overflow-hidden shadow-2xl">
        {/* BARRA SUPERIOR DO TERMINAL / EDITOR */}
        <div className="bg-[#191924] px-6 py-3.5 border-b border-[#272738] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="ml-3 text-xs font-mono text-[#8E8EA8] flex items-center gap-1.5">
              <Terminal size={13} />
              calcify.py — Python 3 (Tkinter)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#62627A]">
              UTF-8 • {lines.length} linhas
            </span>
            <button
              onClick={handleCopy}
              className="text-xs text-[#A78BFA] hover:text-white flex items-center gap-1 transition-colors"
            >
              <Copy size={12} /> Copiar
            </button>
          </div>
        </div>

        {/* ÁREA DE CÓDIGO COM SCROLL */}
        <div className="p-4 sm:p-6 overflow-x-auto max-h-[650px] font-mono text-xs sm:text-[13px] leading-relaxed text-[#D6D6E6]">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isHighlighted = activeConceptData?.lines.includes(lineNum);

                // Estilo sutil de realce de linha
                return (
                  <tr
                    key={idx}
                    id={`line-${lineNum}`}
                    style={{
                      backgroundColor: isHighlighted ? activeConceptData?.badgeBg : "transparent",
                    }}
                    className={`transition-colors group hover:bg-[#1E1E2C] ${
                      isHighlighted ? "border-l-2" : ""
                    }`}
                  >
                    {/* NÚMERO DA LINHA */}
                    <td className="w-12 select-none text-right pr-4 text-[#4C4C63] font-mono text-xs group-hover:text-[#8E8EA8]">
                      {lineNum}
                    </td>

                    {/* CONTEÚDO DA LINHA */}
                    <td className="whitespace-pre font-mono py-0.5">
                      {line.startsWith("#") ? (
                        <span className="text-[#6B7280] italic">{line}</span>
                      ) : line.startsWith('"""') || line.endsWith('"""') || line.includes('"""') ? (
                        <span className="text-[#9CA3AF]">{line}</span>
                      ) : line.includes("def ") ? (
                        <span>
                          <span className="text-[#F472B6] font-semibold">def </span>
                          <span className="text-[#A78BFA] font-bold">
                            {line.replace(/^.*def\s+/, "").replace(/\(.*$/, "")}
                          </span>
                          <span className="text-white">
                            {line.substring(line.indexOf("("))}
                          </span>
                        </span>
                      ) : line.includes("class ") ? (
                        <span>
                          <span className="text-[#F472B6] font-semibold">class </span>
                          <span className="text-[#38BDF8] font-bold">
                            {line.replace(/^.*class\s+/, "")}
                          </span>
                        </span>
                      ) : line.includes("if ") || line.includes("elif ") || line.includes("else:") ? (
                        <span className="text-[#FBBF24]">{line}</span>
                      ) : line.includes("try:") || line.includes("except ") ? (
                        <span className="text-[#F87171]">{line}</span>
                      ) : line.includes("COLOR_") ? (
                        <span className="text-[#34D399]">{line}</span>
                      ) : (
                        <span>{line}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
