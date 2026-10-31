import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  History,
  Trash2,
  Sparkles,
  Play,
  Sun,
  Moon,
  Clock,
  RotateCcw
} from "lucide-react";
import {
  CalculatorState,
  INITIAL_STATE,
  inputDigit,
  inputDecimal,
  toggleSign,
  backspace,
  clearAll,
  inputPercentage,
  setOperator,
  calculateEqual,
  playKeySound
} from "../utils/calculatorLogic";
import { OPERATION_EXAMPLES, OperationExample } from "../data/pythonCode";

interface HistoryRecord {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

interface CalculatorViewProps {
  onRunTestSample?: (example: OperationExample) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = () => {
  const [calcState, setCalcState] = useState<CalculatorState>(INITIAL_STATE);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    return [
      {
        id: "1",
        expression: "12 × 8 =",
        result: "96",
        timestamp: "16:40",
      },
      {
        id: "2",
        expression: "100.5 − 35.25 =",
        result: "65.25",
        timestamp: "16:42",
      },
      {
        id: "3",
        expression: "200 + 20 =",
        result: "220",
        timestamp: "16:45",
      },
    ];
  });
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [testPlaying, setTestPlaying] = useState(false);
  const playbackTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const triggerSound = useCallback((isAccent = false) => {
    if (soundEnabled) {
      playKeySound(isAccent);
    }
  }, [soundEnabled]);

  const flashKey = useCallback((keyId: string) => {
    setActiveKey(keyId);
    setTimeout(() => {
      setActiveKey((prev) => (prev === keyId ? null : prev));
    }, 140);
  }, []);

  const handleDigit = useCallback((digit: string) => {
    triggerSound(false);
    flashKey(digit);
    setCalcState((prev) => inputDigit(prev, digit));
  }, [triggerSound, flashKey]);

  const handleDecimal = useCallback(() => {
    triggerSound(false);
    flashKey(".");
    setCalcState((prev) => inputDecimal(prev));
  }, [triggerSound, flashKey]);

  const handleToggleSign = useCallback(() => {
    triggerSound(false);
    flashKey("±");
    setCalcState((prev) => toggleSign(prev));
  }, [triggerSound, flashKey]);

  const handleBackspace = useCallback(() => {
    triggerSound(false);
    flashKey("backspace");
    setCalcState((prev) => backspace(prev));
  }, [triggerSound, flashKey]);

  const handleClear = useCallback(() => {
    triggerSound(false);
    flashKey("AC");
    setCalcState(clearAll());
  }, [triggerSound, flashKey]);

  const handleOperator = useCallback((op: string) => {
    triggerSound(false);
    flashKey(op);
    if (op === "%") {
      setCalcState((prev) => inputPercentage(prev));
    } else {
      setCalcState((prev) => setOperator(prev, op));
    }
  }, [triggerSound, flashKey]);

  const handleEqual = useCallback(() => {
    triggerSound(true);
    flashKey("=");
    setCalcState((prev) => {
      if (prev.operator && prev.firstOperand !== null && !prev.hasError) {
        const next = calculateEqual(prev);
        if (!next.hasError) {
          const newItem: HistoryRecord = {
            id: Date.now().toString(),
            expression: next.expression,
            result: next.currentValue,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setHistory((h) => [newItem, ...h.slice(0, 24)]);
        }
        return next;
      }
      return prev;
    });
  }, [triggerSound, flashKey]);

  const copyResult = () => {
    navigator.clipboard.writeText(calcState.currentValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const playExample = (example: OperationExample) => {
    if (testPlaying) return;
    setTestPlaying(true);
    playbackTimeoutRef.current.forEach(clearTimeout);
    playbackTimeoutRef.current = [];

    setCalcState(INITIAL_STATE);

    let delay = 250;
    example.keysSequence.forEach((key, index) => {
      const t = setTimeout(() => {
        if (key === "AC") handleClear();
        else if (key === "backspace") handleBackspace();
        else if (key === ".") handleDecimal();
        else if (key === "=") handleEqual();
        else if (["+", "-", "*", "/", "%"].includes(key)) handleOperator(key);
        else handleDigit(key);

        if (index === example.keysSequence.length - 1) {
          setTestPlaying(false);
        }
      }, delay);
      playbackTimeoutRef.current.push(t);
      delay += 320;
    });
  };

  // Teclado físico
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === "." || e.key === ",") {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === "+") {
        e.preventDefault();
        handleOperator("+");
      } else if (e.key === "-") {
        e.preventDefault();
        handleOperator("-");
      } else if (e.key === "*") {
        e.preventDefault();
        handleOperator("*");
      } else if (e.key === "/") {
        e.preventDefault();
        handleOperator("/");
      } else if (e.key === "%") {
        e.preventDefault();
        handleOperator("%");
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEqual();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDigit, handleDecimal, handleOperator, handleEqual, handleBackspace, handleClear]);

  const getResultFontSize = (val: string) => {
    if (val.length > 14) return "text-xl sm:text-2xl";
    if (val.length > 9) return "text-2xl sm:text-3xl";
    if (val.length > 6) return "text-3xl sm:text-4xl";
    return "text-4xl sm:text-5xl";
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* COLUNA ESQUERDA: CALCULADORA CALCIFY COM TEMA CLARO / ESCURO */}
      <div className="lg:col-span-5 flex flex-col items-center">
        {/* CONTAINER DA CALCULADORA COM PALETAS DINÂMICAS */}
        <div
          className={`w-full max-w-[400px] rounded-3xl p-6 shadow-2xl transition-all duration-300 relative border ${
            isDarkMode
              ? "bg-[#15151D] border-[#2B2B3D] shadow-black/80 text-white"
              : "bg-[#F4F4F8] border-[#E2E2EA] shadow-xl text-[#15151D]"
          }`}
        >
          {/* TOPO: LOGO, TEMA E HISTÓRICO */}
          <div
            className={`flex items-center justify-between mb-4 pb-3 border-b ${
              isDarkMode ? "border-[#232334]" : "border-[#E5E5EE]"
            }`}
          >
            {/* LOGO 'C' LILÁS + CALCIFY */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-colors ${
                  isDarkMode
                    ? "bg-[#27203F] border border-[#A78BFA]/40 text-[#A78BFA]"
                    : "bg-[#EBE7FA] border border-[#7C3AED]/30 text-[#7C3AED]"
                }`}
              >
                C
              </div>
              <div>
                <h1 className="font-display font-bold text-lg tracking-tight leading-none flex items-center gap-1.5">
                  Calcify
                  <span
                    className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                      isDarkMode
                        ? "bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/20"
                        : "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20 font-semibold"
                    }`}
                  >
                    {isDarkMode ? "Dark" : "Light"}
                  </span>
                </h1>
                <p
                  className={`text-xs font-sans mt-0.5 ${
                    isDarkMode ? "text-[#8E8EA8]" : "text-[#6E6E85]"
                  }`}
                >
                  Make numbers simple.
                </p>
              </div>
            </div>

            {/* CONTROLES: TEMA (CLARO/ESCURO), HISTÓRICO E SOM */}
            <div className="flex items-center gap-1.5">
              {/* BOTÃO ALTERNAR TEMA ESCURO / CLARO */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                title={isDarkMode ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border active:scale-95 ${
                  isDarkMode
                    ? "bg-[#252535] hover:bg-[#323246] text-[#A78BFA] border-[#34344A]"
                    : "bg-[#FFFFFF] hover:bg-[#EAEAF2] text-[#7C3AED] border-[#D8D8E5] shadow-xs"
                }`}
              >
                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                <span className="hidden sm:inline font-mono">{isDarkMode ? "Claro" : "Escuro"}</span>
              </button>

              {/* BOTÃO HISTÓRICO RETRÁTIL */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                title="Histórico de Cálculos"
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border active:scale-95 ${
                  showHistory
                    ? isDarkMode
                      ? "bg-[#A78BFA] text-[#15151D] border-[#A78BFA]"
                      : "bg-[#7C3AED] text-white border-[#7C3AED]"
                    : isDarkMode
                    ? "bg-[#252535] hover:bg-[#323246] text-[#8E8EA8] border-[#34344A]"
                    : "bg-[#FFFFFF] hover:bg-[#EAEAF2] text-[#6E6E85] border-[#D8D8E5]"
                }`}
              >
                <History size={14} />
                <span className="font-mono">Hist</span>
              </button>

              {/* BOTÃO SOM */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Desativar som" : "Ativar som"}
                className={`p-1.5 rounded-xl text-xs transition-all ${
                  isDarkMode
                    ? soundEnabled
                      ? "text-[#A78BFA] hover:bg-[#252535]"
                      : "text-[#55556E] hover:bg-[#252535]"
                    : soundEnabled
                    ? "text-[#7C3AED] hover:bg-[#EAEAF2]"
                    : "text-[#9E9EB2] hover:bg-[#EAEAF2]"
                }`}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
            </div>
          </div>

          {/* VISOR PRINCIPAL DA CALCULADORA */}
          <div
            className={`rounded-2xl p-4 mb-4 flex flex-col justify-between min-h-[105px] border transition-colors group relative overflow-hidden ${
              isDarkMode
                ? "bg-[#1C1C27] border-[#2B2B3D]"
                : "bg-[#FFFFFF] border-[#E2E2EA] shadow-xs"
            }`}
          >
            {/* HISTÓRICO DA OPERAÇÃO / EXPRESSÃO ANTERIOR */}
            <div
              className={`text-right text-xs sm:text-sm font-mono h-5 overflow-hidden text-ellipsis whitespace-nowrap ${
                isDarkMode ? "text-[#8E8EA8]" : "text-[#7E7E94]"
              }`}
            >
              {calcState.expression || "\u00A0"}
            </div>

            {/* VALOR DIGITADO / RESULTADO EM GRANDE DESTAQUE */}
            <div className="flex items-end justify-between mt-1">
              <button
                onClick={copyResult}
                className={`opacity-40 group-hover:opacity-100 transition-opacity p-1 rounded ${
                  isDarkMode
                    ? "hover:text-[#A78BFA] text-[#8E8EA8]"
                    : "hover:text-[#7C3AED] text-[#6E6E85]"
                }`}
                title="Copiar resultado"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>

              <div
                className={`font-display font-bold tracking-tight text-right break-all transition-all ${
                  calcState.hasError
                    ? "text-red-500 text-base sm:text-lg font-medium"
                    : isDarkMode
                    ? `text-white ${getResultFontSize(calcState.currentValue)}`
                    : `text-[#15151D] ${getResultFontSize(calcState.currentValue)}`
                }`}
              >
                {calcState.currentValue}
              </div>
            </div>
          </div>

          {/* PAINEL RETRÁTIL DE HISTÓRICO (NÃO ATRAPALHA A ESTÉTICA) */}
          {/* Abre discretamente entre o visor e os botões quando o usuário solicita */}
          {showHistory && (
            <div
              className={`mb-4 rounded-2xl p-3.5 border transition-all animate-in fade-in slide-in-from-top-2 duration-150 ${
                isDarkMode
                  ? "bg-[#191924] border-[#2B2B3D]"
                  : "bg-[#FFFFFF] border-[#E2E2EA] shadow-sm"
              }`}
            >
              <div
                className={`flex items-center justify-between pb-2 mb-2 border-b text-xs ${
                  isDarkMode ? "border-[#252535] text-[#8E8EA8]" : "border-[#EAEAF2] text-[#6E6E85]"
                }`}
              >
                <span className="font-semibold flex items-center gap-1.5">
                  <Clock size={13} className={isDarkMode ? "text-[#A78BFA]" : "text-[#7C3AED]"} />
                  Histórico de Cálculos
                </span>
                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="text-red-400 hover:text-red-500 flex items-center gap-1 text-[11px] font-medium"
                  >
                    <Trash2 size={11} /> Limpar
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div
                  className={`text-center py-4 text-xs ${
                    isDarkMode ? "text-[#55556E]" : "text-[#9E9EB2]"
                  }`}
                >
                  Nenhum cálculo registrado ainda.
                </div>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCalcState({
                          ...INITIAL_STATE,
                          currentValue: item.result,
                          expression: item.expression,
                          resetOnNextInput: true,
                        });
                        setShowHistory(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between group ${
                        isDarkMode
                          ? "bg-[#1F1F2E] hover:bg-[#28283C] text-white"
                          : "bg-[#F4F4F8] hover:bg-[#EAEAF2] text-[#15151D]"
                      }`}
                      title="Clique para recuperar este valor no visor"
                    >
                      <div>
                        <div
                          className={`text-[11px] font-mono ${
                            isDarkMode ? "text-[#8E8EA8]" : "text-[#7E7E94]"
                          }`}
                        >
                          {item.expression}
                        </div>
                        <div
                          className={`text-sm font-bold font-mono transition-colors ${
                            isDarkMode ? "group-hover:text-[#A78BFA]" : "group-hover:text-[#7C3AED]"
                          }`}
                        >
                          {item.result}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] ${
                          isDarkMode ? "text-[#55556E]" : "text-[#9E9EB2]"
                        }`}
                      >
                        {item.timestamp}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TECLADO GRID COM AS CORES DO TEMA ATIVO */}
          <div className="grid grid-cols-4 gap-2.5">
            {/* LINHA 1: AC, ⌫, %, ÷ */}
            <button
              onClick={handleClear}
              className={`h-14 rounded-2xl font-display font-semibold text-base transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "AC"
                  ? isDarkMode
                    ? "bg-[#A78BFA] text-[#15151D]"
                    : "bg-[#7C3AED] text-white"
                  : isDarkMode
                  ? "bg-[#252535] text-[#A78BFA] hover:bg-[#323246]"
                  : "bg-[#EAEAF2] text-[#7C3AED] hover:bg-[#DDDDE8]"
              }`}
            >
              AC
            </button>

            <button
              onClick={handleBackspace}
              className={`h-14 rounded-2xl font-display font-semibold text-lg transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "backspace"
                  ? isDarkMode
                    ? "bg-[#A78BFA] text-[#15151D]"
                    : "bg-[#7C3AED] text-white"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#EAEAF2] text-[#15151D] hover:bg-[#DDDDE8]"
              }`}
              title="Apagar último dígito"
            >
              ⌫
            </button>

            <button
              onClick={() => handleOperator("%")}
              className={`h-14 rounded-2xl font-display font-semibold text-base transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "%"
                  ? isDarkMode
                    ? "bg-[#A78BFA] text-[#15151D]"
                    : "bg-[#7C3AED] text-white"
                  : isDarkMode
                  ? "bg-[#252535] text-[#A78BFA] hover:bg-[#323246]"
                  : "bg-[#EAEAF2] text-[#7C3AED] hover:bg-[#DDDDE8]"
              }`}
            >
              %
            </button>

            <button
              onClick={() => handleOperator("/")}
              className={`h-14 rounded-2xl font-display font-bold text-xl transition-all active:scale-95 flex items-center justify-center ${
                calcState.operator === "/" && calcState.resetOnNextInput
                  ? isDarkMode
                    ? "bg-[#A78BFA] text-[#15151D] shadow-md shadow-[#A78BFA]/30"
                    : "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30"
                  : activeKey === "/"
                  ? isDarkMode
                    ? "bg-[#3D3762] text-[#A78BFA]"
                    : "bg-[#DDD6F8] text-[#7C3AED]"
                  : isDarkMode
                  ? "bg-[#27223D] text-[#A78BFA] hover:bg-[#352E52]"
                  : "bg-[#EBE7FA] text-[#7C3AED] hover:bg-[#DDD6F8]"
              }`}
            >
              ÷
            </button>

            {/* LINHA 2: 7, 8, 9, × */}
            <button
              onClick={() => handleDigit("7")}
              className={`h-14 rounded-2xl font-display font-semibold text-lg transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "7"
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#FFFFFF] text-[#15151D] hover:bg-[#EAEAF2] border border-[#E2E2EA]"
              }`}
            >
              7
            </button>
            <button
              onClick={() => handleDigit("8")}
              className={`h-14 rounded-2xl font-display font-semibold text-lg transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "8"
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#FFFFFF] text-[#15151D] hover:bg-[#EAEAF2] border border-[#E2E2EA]"
              }`}
            >
              8
            </button>
            <button
              onClick={() => handleDigit("9")}
              className={`h-14 rounded-2xl font-display font-semibold text-lg transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "9"
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#FFFFFF] text-[#15151D] hover:bg-[#EAEAF2] border border-[#E2E2EA]"
              }`}
            >
              9
            </button>
            <button
              onClick={() => handleOperator("*")}
              className={`h-14 rounded-2xl font-display font-bold text-xl transition-all active:scale-95 flex items-center justify-center ${
                calcState.operator === "*" && calcState.resetOnNextInput
                  ? isDarkMode
                    ? "bg-[#A78BFA] text-[#15151D] shadow-md shadow-[#A78BFA]/30"
                    : "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30"
                  : activeKey === "*"
                  ? isDarkMode
                    ? "bg-[#3D3762] text-[#A78BFA]"
                    : "bg-[#DDD6F8] text-[#7C3AED]"
                  : isDarkMode
                  ? "bg-[#27223D] text-[#A78BFA] hover:bg-[#352E52]"
                  : "bg-[#EBE7FA] text-[#7C3AED] hover:bg-[#DDD6F8]"
              }`}
            >
              ×
            </button>

            {/* LINHA 3: 4, 5, 6, − */}
            <button
              onClick={() => handleDigit("4")}
              className={`h-14 rounded-2xl font-display font-semibold text-lg transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "4"
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#FFFFFF] text-[#15151D] hover:bg-[#EAEAF2] border border-[#E2E2EA]"
              }`}
            >
              4
            </button>
            <button
              onClick={() => handleDigit("5")}
              className={`h-14 rounded-2xl font-display font-semibold text-lg transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "5"
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#FFFFFF] text-[#15151D] hover:bg-[#EAEAF2] border border-[#E2E2EA]"
              }`}
            >
              5
            </button>
            <button
              onClick={() => handleDigit("6")}
              className={`h-14 rounded-2xl font-display font-semibold text-lg transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "6"
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#FFFFFF] text-[#15151D] hover:bg-[#EAEAF2] border border-[#E2E2EA]"
              }`}
            >
              6
            </button>
            <button
              onClick={() => handleOperator("-")}
              className={`h-14 rounded-2xl font-display font-bold text-xl transition-all active:scale-95 flex items-center justify-center ${
                calcState.operator === "-" && calcState.resetOnNextInput
                  ? isDarkMode
                    ? "bg-[#A78BFA] text-[#15151D] shadow-md shadow-[#A78BFA]/30"
                    : "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30"
                  : activeKey === "-"
                  ? isDarkMode
                    ? "bg-[#3D3762] text-[#A78BFA]"
                    : "bg-[#DDD6F8] text-[#7C3AED]"
                  : isDarkMode
                  ? "bg-[#27223D] text-[#A78BFA] hover:bg-[#352E52]"
                  : "bg-[#EBE7FA] text-[#7C3AED] hover:bg-[#DDD6F8]"
              }`}
            >
              −
            </button>

            {/* LINHA 4: 1, 2, 3, + */}
            <button
              onClick={() => handleDigit("1")}
              className={`h-14 rounded-2xl font-display font-semibold text-lg transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "1"
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#FFFFFF] text-[#15151D] hover:bg-[#EAEAF2] border border-[#E2E2EA]"
              }`}
            >
              1
            </button>
            <button
              onClick={() => handleDigit("2")}
              className={`h-14 rounded-2xl font-display font-semibold text-lg transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "2"
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#FFFFFF] text-[#15151D] hover:bg-[#EAEAF2] border border-[#E2E2EA]"
              }`}
            >
              2
            </button>
            <button
              onClick={() => handleDigit("3")}
              className={`h-14 rounded-2xl font-display font-semibold text-lg transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "3"
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#FFFFFF] text-[#15151D] hover:bg-[#EAEAF2] border border-[#E2E2EA]"
              }`}
            >
              3
            </button>
            <button
              onClick={() => handleOperator("+")}
              className={`h-14 rounded-2xl font-display font-bold text-xl transition-all active:scale-95 flex items-center justify-center ${
                calcState.operator === "+" && calcState.resetOnNextInput
                  ? isDarkMode
                    ? "bg-[#A78BFA] text-[#15151D] shadow-md shadow-[#A78BFA]/30"
                    : "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30"
                  : activeKey === "+"
                  ? isDarkMode
                    ? "bg-[#3D3762] text-[#A78BFA]"
                    : "bg-[#DDD6F8] text-[#7C3AED]"
                  : isDarkMode
                  ? "bg-[#27223D] text-[#A78BFA] hover:bg-[#352E52]"
                  : "bg-[#EBE7FA] text-[#7C3AED] hover:bg-[#DDD6F8]"
              }`}
            >
              +
            </button>

            {/* LINHA 5: ±, 0, ., = */}
            <button
              onClick={handleToggleSign}
              className={`h-14 rounded-2xl font-display font-semibold text-base transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "±"
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#EAEAF2] text-[#15151D] hover:bg-[#DDDDE8]"
              }`}
              title="Inverter sinal (+/-)"
            >
              ±
            </button>

            <button
              onClick={() => handleDigit("0")}
              className={`h-14 rounded-2xl font-display font-semibold text-lg transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "0"
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#FFFFFF] text-[#15151D] hover:bg-[#EAEAF2] border border-[#E2E2EA]"
              }`}
            >
              0
            </button>

            <button
              onClick={handleDecimal}
              className={`h-14 rounded-2xl font-display font-bold text-xl transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "."
                  ? isDarkMode ? "bg-[#3D3D58]" : "bg-[#D8D8E5]"
                  : isDarkMode
                  ? "bg-[#252535] text-white hover:bg-[#323246]"
                  : "bg-[#FFFFFF] text-[#15151D] hover:bg-[#EAEAF2] border border-[#E2E2EA]"
              }`}
            >
              .
            </button>

            <button
              onClick={handleEqual}
              className={`h-14 rounded-2xl font-display font-bold text-2xl transition-all active:scale-95 flex items-center justify-center ${
                activeKey === "="
                  ? isDarkMode
                    ? "bg-[#C4B5FD] text-[#0F0F15] scale-95"
                    : "bg-[#6D28D9] text-white scale-95"
                  : isDarkMode
                  ? "bg-[#A78BFA] text-[#15151D] hover:bg-[#BBA4FB] shadow-lg shadow-[#A78BFA]/25"
                  : "bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-lg shadow-[#7C3AED]/25"
              }`}
            >
              =
            </button>
          </div>

          {/* DICA DE ATALHO DE TECLADO */}
          <div
            className={`mt-4 pt-3 border-t text-center text-[11px] flex items-center justify-center gap-1.5 ${
              isDarkMode ? "border-[#232334] text-[#8E8EA8]" : "border-[#E5E5EE] text-[#7E7E94]"
            }`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Teclado físico: números 0-9, +, -, *, /, %, Enter, ⌫</span>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: BATERIA DE TESTES & NOVIDADES */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-mono text-[#A78BFA] font-semibold flex items-center gap-1.5">
                <Sparkles size={13} />
                Calculadora Simples em Python com Histórico & Temas
              </span>
              <h2 className="text-xl font-display font-bold text-white">
                Bateria de Testes Interativos
              </h2>
              <p className="text-[#8E8EA8] text-sm">
                Experimente o <strong>Tema Claro</strong> e o <strong>Histórico</strong> alternando os botões no topo da calculadora, ou clique em <strong className="text-white">"Simular"</strong> para ver qualquer teste sendo calculado passo a passo!
              </p>
            </div>

            {testPlaying && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/30 animate-pulse">
                Simulando...
              </span>
            )}
          </div>

          {/* LISTA DE TESTES */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OPERATION_EXAMPLES.map((example, idx) => (
              <div
                key={idx}
                className="bg-[#1C1C27] border border-[#2B2B3D] hover:border-[#A78BFA]/40 rounded-2xl p-4 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#252535] text-[#A78BFA]">
                      {example.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-white group-hover:text-[#A78BFA] transition-colors">
                      {example.expectedResult}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-white text-sm">
                    {example.title}
                  </h3>
                  <p className="text-xs text-[#8E8EA8] mt-1 line-clamp-2">
                    {example.explanation}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#252535] flex items-center justify-between">
                  <div className="text-[11px] text-[#62627A] font-mono">
                    {example.displayExpr || "Passos: ⌫"}
                  </div>
                  <button
                    onClick={() => playExample(example)}
                    disabled={testPlaying}
                    className="text-xs font-medium text-[#A78BFA] hover:text-white bg-[#252535] hover:bg-[#363252] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 disabled:opacity-50"
                  >
                    <Play size={11} fill="currentColor" /> Simular
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESTAQUES DA NOVA VERSÃO */}
          <div className="mt-6 pt-4 border-t border-[#232334] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-[#1A1A24] p-3 rounded-xl border border-[#262638]">
              <div className="text-base font-bold text-[#A78BFA] font-mono">☀️ / 🌙</div>
              <div className="text-[11px] text-[#8E8EA8] mt-0.5">Claro e Escuro</div>
            </div>
            <div className="bg-[#1A1A24] p-3 rounded-xl border border-[#262638]">
              <div className="text-base font-bold text-[#38BDF8] font-mono">📜 Drawer</div>
              <div className="text-[11px] text-[#8E8EA8] mt-0.5">Histórico Retrátil</div>
            </div>
            <div className="bg-[#1A1A24] p-3 rounded-xl border border-[#262638]">
              <div className="text-base font-bold text-emerald-400 font-mono">12/12</div>
              <div className="text-[11px] text-[#8E8EA8] mt-0.5">Testes Aprovados</div>
            </div>
            <div className="bg-[#1A1A24] p-3 rounded-xl border border-[#262638]">
              <div className="text-base font-bold text-white font-mono">Tkinter</div>
              <div className="text-[11px] text-[#8E8EA8] mt-0.5">100% Nativo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
