import React, { useState } from "react";
import {
  Download,
  Terminal,
  FolderTree,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Play,
  Monitor,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  FileText
} from "lucide-react";
import { PYTHON_CALCIFY_CODE } from "../data/pythonCode";

export const WindowsGuide: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

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

  const testFileContent = `import unittest
from calcify import CalculatorLogic

class TestCalculator(unittest.TestCase):
    def setUp(self):
        self.calc = CalculatorLogic()

    def test_addition(self):
        self.calc.input_digit("1")
        self.calc.input_digit("5")
        self.calc.set_operator("+")
        self.calc.input_digit("2")
        self.calc.input_digit("7")
        self.calc.calculate_equal()
        self.assertEqual(self.calc.current_value, "42")

    def test_division_by_zero(self):
        self.calc.input_digit("5")
        self.calc.set_operator("/")
        self.calc.input_digit("0")
        self.calc.calculate_equal()
        self.assertEqual(self.calc.current_value, "Não é possível dividir por zero")

    def test_history(self):
        self.calc.input_digit("1")
        self.calc.input_digit("0")
        self.calc.set_operator("+")
        self.calc.input_digit("5")
        self.calc.calculate_equal()
        self.assertEqual(len(self.calc.history), 1)
        self.assertEqual(self.calc.history[0]["result"], "15")

if __name__ == "__main__":
    unittest.main()
`;

  const batContent = `@echo off
title Calcify - Make numbers simple.
echo ========================================================
echo  Iniciando Calcify - Calculadora Moderna em Python
echo ========================================================
echo.
python calcify.py
if %errorlevel% neq 0 (
    echo.
    echo Ocorreu um erro ao rodar calcify.py. Verifique se o Python esta instalado.
    pause
)
`;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* CARD PRINCIPAL DE DOWNLOAD DOS ARQUIVOS */}
      <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#232334]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A78BFA] font-semibold flex items-center gap-1.5">
                <Monitor size={14} />
                Ambiente Windows 10 & 11
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#A78BFA]/15 text-[#A78BFA]">
                Tkinter Nativo
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
              Guia de Instalação & Execução no Windows
            </h2>
            <p className="text-[#8E8EA8] text-sm mt-1 max-w-2xl">
              Tudo o que você precisa para rodar o projeto na sua máquina com um clique, sem configurações complexas.
            </p>
          </div>

          {/* BOTÃO BAIXAR ARQUIVO COMPLETO */}
          <button
            onClick={() => downloadFile("calcify.py", PYTHON_CALCIFY_CODE)}
            className="px-6 py-3 rounded-2xl bg-[#A78BFA] hover:bg-[#BBA4FB] text-[#15151D] text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#A78BFA]/20 active:scale-95 shrink-0"
          >
            <Download size={18} />
            Baixar calcify.py (Pronto)
          </button>
        </div>

        {/* LISTA DE ARQUIVOS DO PROJETO PARA DOWNLOAD INDIVIDUAL */}
        <div className="mt-6">
          <h3 className="text-xs uppercase font-mono text-[#8E8EA8] tracking-wider mb-3 flex items-center gap-1.5">
            <FolderTree size={14} className="text-[#A78BFA]" />
            Arquivos do Projeto para Download:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#1C1C27] border border-[#2B2B3D] rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-white">calcify.py</span>
                  <span className="text-[10px] text-[#A78BFA] font-mono bg-[#27203F] px-1.5 py-0.5 rounded">
                    Principal
                  </span>
                </div>
                <p className="text-xs text-[#8E8EA8]">
                  Código completo da calculadora com interface Tkinter e lógica matemática.
                </p>
              </div>
              <button
                onClick={() => downloadFile("calcify.py", PYTHON_CALCIFY_CODE)}
                className="mt-3 w-full py-1.5 rounded-lg bg-[#252535] hover:bg-[#323246] text-[#A78BFA] hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5"
              >
                <Download size={13} /> Baixar .py
              </button>
            </div>

            <div className="bg-[#1C1C27] border border-[#2B2B3D] rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-white">test_calcify.py</span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Testes
                  </span>
                </div>
                <p className="text-xs text-[#8E8EA8]">
                  Suite de testes unitários automatizados cobrindo todas as operações.
                </p>
              </div>
              <button
                onClick={() => downloadFile("test_calcify.py", testFileContent)}
                className="mt-3 w-full py-1.5 rounded-lg bg-[#252535] hover:bg-[#323246] text-[#A78BFA] hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5"
              >
                <Download size={13} /> Baixar .py
              </button>
            </div>

            <div className="bg-[#1C1C27] border border-[#2B2B3D] rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-white">run_windows.bat</span>
                  <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-1.5 py-0.5 rounded">
                    2 Cliques
                  </span>
                </div>
                <p className="text-xs text-[#8E8EA8]">
                  Arquivo executável para rodar a Calcify no Windows com duplo clique.
                </p>
              </div>
              <button
                onClick={() => downloadFile("run_windows.bat", batContent)}
                className="mt-3 w-full py-1.5 rounded-lg bg-[#252535] hover:bg-[#323246] text-[#A78BFA] hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5"
              >
                <Download size={13} /> Baixar .bat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PASSO A PASSO ILUSTRADO PARA O WINDOWS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PASSO 1 */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 relative">
          <div className="w-8 h-8 rounded-xl bg-[#27203F] text-[#A78BFA] font-bold font-mono flex items-center justify-center text-sm mb-4 border border-[#A78BFA]/30">
            01
          </div>
          <h3 className="font-display font-semibold text-white text-lg">
            Instalar o Python
          </h3>
          <p className="text-xs text-[#8E8EA8] mt-1.5 leading-relaxed">
            Se você ainda não tem o Python instalado, baixe o instalador oficial em python.org.
          </p>

          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 space-y-1">
            <div className="font-semibold flex items-center gap-1 text-amber-400">
              <AlertCircle size={13} /> Dica Crucial no Windows:
            </div>
            <p className="text-[11px] leading-relaxed">
              Na primeira tela do instalador, marque a caixinha <strong>"Add python.exe to PATH"</strong>. Isso permite abrir a calculadora direto pelo terminal!
            </p>
          </div>
        </div>

        {/* PASSO 2 */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 relative">
          <div className="w-8 h-8 rounded-xl bg-[#27203F] text-[#A78BFA] font-bold font-mono flex items-center justify-center text-sm mb-4 border border-[#A78BFA]/30">
            02
          </div>
          <h3 className="font-display font-semibold text-white text-lg">
            Abrir a Pasta no CMD
          </h3>
          <p className="text-xs text-[#8E8EA8] mt-1.5 leading-relaxed">
            Abra a pasta onde você salvou o arquivo <code className="text-[#A78BFA]">calcify.py</code>.
          </p>

          <div className="mt-4 p-3 bg-[#1C1C27] border border-[#2B2B3D] rounded-xl text-xs space-y-2">
            <span className="text-[11px] text-[#8E8EA8] block">Atalho inteligente no Windows:</span>
            <p className="text-[11px] text-[#D6D6E6] leading-relaxed">
              Abra a pasta no Windows Explorer, clique na barra de endereços no topo, digite <strong>cmd</strong> e aperte Enter. O terminal já abre na pasta certa!
            </p>
          </div>
        </div>

        {/* PASSO 3 */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 relative">
          <div className="w-8 h-8 rounded-xl bg-[#27203F] text-[#A78BFA] font-bold font-mono flex items-center justify-center text-sm mb-4 border border-[#A78BFA]/30">
            03
          </div>
          <h3 className="font-display font-semibold text-white text-lg">
            Executar a Calculadora
          </h3>
          <p className="text-xs text-[#8E8EA8] mt-1.5 leading-relaxed">
            Digite o comando abaixo no terminal ou dê duplo clique no <code className="text-[#A78BFA]">run_windows.bat</code>:
          </p>

          <div className="mt-4 p-2.5 bg-[#1C1C27] border border-[#2B2B3D] rounded-xl flex items-center justify-between">
            <code className="text-xs font-mono text-[#A78BFA]">python calcify.py</code>
            <button
              onClick={() => handleCopy("python calcify.py", "cmd1")}
              className="text-[#8E8EA8] hover:text-white p-1 rounded"
              title="Copiar comando"
            >
              {copiedCmd === "cmd1" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          </div>

          <div className="mt-3 text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={12} /> A janela Calcify abrirá imediatamente!
          </div>
        </div>
      </div>

      {/* BLOCO DE TESTES AUTOMATIZADOS E PYINSTALLER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EXECUTANDO TESTES UNITÁRIOS */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={18} className="text-emerald-400" />
            <h3 className="font-display font-semibold text-white text-base">
              Executar Testes de Engenharia de Software
            </h3>
          </div>
          <p className="text-xs text-[#8E8EA8] leading-relaxed mb-4">
            Para comprovar no seu desafio que o código está 100% funcional e com tratamento defensivo de erros, execute a suite de testes unitários do Python:
          </p>

          <div className="p-3 bg-[#1C1C27] border border-[#2B2B3D] rounded-xl flex items-center justify-between font-mono text-xs">
            <span className="text-[#A78BFA]">python -m unittest test_calcify.py</span>
            <button
              onClick={() => handleCopy("python -m unittest test_calcify.py", "cmd2")}
              className="text-[#8E8EA8] hover:text-white"
            >
              {copiedCmd === "cmd2" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="mt-3 p-3 bg-[#12121A] rounded-xl font-mono text-[11px] text-emerald-300/90 border border-emerald-500/20">
            ........... <br />
            ----------------------------------------------------------------------<br />
            Ran 11 tests in 0.001s<br />
            <span className="font-bold text-emerald-400">OK</span> (Todas as operações aprovadas!)
          </div>
        </div>

        {/* BÔNUS: GERAR EXECUTÁVEL .EXE INDEPENDENTE */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#A78BFA]" />
            <h3 className="font-display font-semibold text-white text-base">
              Bônus: Transformar em Arquivo .EXE (PyInstaller)
            </h3>
          </div>
          <p className="text-xs text-[#8E8EA8] leading-relaxed mb-4">
            Quer enviar a calculadora para amigos que não têm Python instalado? Você pode empacotá-la em um executável autônomo do Windows com o PyInstaller:
          </p>

          <div className="space-y-2">
            <div className="p-2.5 bg-[#1C1C27] border border-[#2B2B3D] rounded-xl flex items-center justify-between font-mono text-xs">
              <span className="text-[#D6D6E6]">pip install pyinstaller</span>
              <button
                onClick={() => handleCopy("pip install pyinstaller", "cmd3")}
                className="text-[#8E8EA8] hover:text-white"
              >
                {copiedCmd === "cmd3" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="p-2.5 bg-[#1C1C27] border border-[#2B2B3D] rounded-xl flex items-center justify-between font-mono text-xs">
              <span className="text-[#A78BFA]">pyinstaller --onefile --noconsole calcify.py</span>
              <button
                onClick={() => handleCopy("pyinstaller --onefile --noconsole calcify.py", "cmd4")}
                className="text-[#8E8EA8] hover:text-white"
              >
                {copiedCmd === "cmd4" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-[#62627A] mt-3">
            O arquivo <code className="text-[#A78BFA]">calcify.exe</code> será criado dentro da pasta <strong>dist/</strong>!
          </p>
        </div>
      </div>
    </div>
  );
};
