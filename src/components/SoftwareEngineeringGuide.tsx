import React from "react";
import {
  Code2,
  GitBranch,
  ShieldAlert,
  Variable,
  FunctionSquare,
  Activity,
  Layers,
  Sparkles,
  History,
  SunMoon,
  CheckCircle2
} from "lucide-react";

export const SoftwareEngineeringGuide: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* CABEÇALHO */}
      <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase font-mono tracking-wider text-[#A78BFA] font-semibold flex items-center gap-1.5">
            <Layers size={14} />
            Guia Didático para Iniciantes em Programação
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#A78BFA]/15 text-[#A78BFA]">
            Python 3 + Tkinter
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
          Como a Calculadora Calcify foi Construída (Passo a Passo)
        </h2>
        <p className="text-[#8E8EA8] text-sm mt-2 max-w-3xl leading-relaxed">
          Se você está começando a aprender a programar, parabéns pela iniciativa! Aqui está a explicação simples e direta de cada componente fundamental utilizado no projeto:
        </p>
      </div>

      {/* NOVIDADES: HISTÓRICO E TEMA CLARO/ESCURO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COMO FUNCIONA O HISTÓRICO SEM POLUIR A ESTÉTICA */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 relative">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/20">
            <History size={20} />
          </div>
          <h3 className="text-lg font-display font-bold text-white">
            Como funciona o Histórico de Cálculos?
          </h3>
          <p className="text-xs text-[#8E8EA8] mt-2 leading-relaxed">
            No início do aprendizado, gerenciar dados históricos é o primeiro passo para entender <strong>listas</strong> e <strong>dicionários</strong> em Python:
          </p>
          <ul className="mt-3 space-y-2 text-xs font-mono text-[#D6D6E6]">
            <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
              <strong className="text-sky-400">self.history = []:</strong> criamos uma lista vazia no método <code className="text-white">__init__</code>.
            </li>
            <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
              <strong className="text-sky-400">self.history.append(&#123;...&#125;):</strong> sempre que o usuário aperta igual (<kbd>=</kbd>), gravamos a expressão e o resultado.
            </li>
            <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
              <strong className="text-sky-400">Estética preservada (Drawer retrátil):</strong> o histórico fica recolhido e só aparece ao clicar no botão "Histórico", garantindo que a calculadora continue limpa e moderna!
            </li>
          </ul>
        </div>

        {/* COMO FUNCIONA A TROCA DE TEMA (DARK / LIGHT MODE) */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 relative">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-[#C084FC] flex items-center justify-center mb-4 border border-purple-500/20">
            <SunMoon size={20} />
          </div>
          <h3 className="text-lg font-display font-bold text-white">
            Como funciona o Tema Claro e Escuro?
          </h3>
          <p className="text-xs text-[#8E8EA8] mt-2 leading-relaxed">
            Em vez de fixar cores estáticas em cada botão, utilizamos um <strong>dicionário de temas</strong>:
          </p>
          <ul className="mt-3 space-y-2 text-xs font-mono text-[#D6D6E6]">
            <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
              <strong className="text-[#C084FC]">THEMES = &#123;"dark": &#123;...&#125;, "light": &#123;...&#125;&#125;:</strong> guarda as cores exatas de fundo, botões e textos de cada modo.
            </li>
            <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
              <strong className="text-[#C084FC]">toggle_theme():</strong> inverte a variável entre "dark" e "light".
            </li>
            <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
              <strong className="text-[#C084FC]">apply_theme():</strong> percorre os botões da janela aplicando <code className="text-white">btn.configure(bg=..., fg=...)</code> dinamicamente!
            </li>
          </ul>
        </div>
      </div>

      {/* OS 6 CONCEITOS BÁSICOS DO CÓDIGO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* VARIÁVEIS */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 flex flex-col justify-between hover:border-[#34D399]/40 transition-all">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
              <Variable size={20} />
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              1. Variáveis & Constantes
            </h3>
            <p className="text-xs text-[#8E8EA8] mt-2 leading-relaxed">
              Guardam informações enquanto o programa está rodando:
            </p>
            <ul className="mt-3 space-y-2 text-xs font-mono text-[#D6D6E6]">
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-emerald-400">self.current_value:</strong> armazena o texto atual do visor (ex: "42").
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-emerald-400">self.first_operand:</strong> guarda o primeiro número digitado antes da operação.
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-emerald-400">self.operator:</strong> operador pendente (+, -, *, /).
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232334] text-[11px] text-emerald-400/80">
            ✓ Estado centralizado na classe lógica
          </div>
        </div>

        {/* FUNÇÕES */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 flex flex-col justify-between hover:border-[#A78BFA]/40 transition-all">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#27203F] text-[#A78BFA] flex items-center justify-center mb-4 border border-[#A78BFA]/30">
              <FunctionSquare size={20} />
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              2. Funções & Métodos
            </h3>
            <p className="text-xs text-[#8E8EA8] mt-2 leading-relaxed">
              Ações executadas quando algo acontece:
            </p>
            <ul className="mt-3 space-y-2 text-xs font-mono text-[#D6D6E6]">
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-[#A78BFA]">input_digit(d):</strong> adiciona o número clicado ao visor.
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-[#A78BFA]">backspace():</strong> apaga o último dígito inserido (botão ⌫).
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-[#A78BFA]">clear_all():</strong> limpa tudo e zera o estado (botão AC).
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232334] text-[11px] text-[#A78BFA]/80">
            ✓ Modularidade e facilidade de leitura
          </div>
        </div>

        {/* CONDIÇÕES */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 flex flex-col justify-between hover:border-amber-400/40 transition-all">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
              <GitBranch size={20} />
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              3. Condições (if / elif / else)
            </h3>
            <p className="text-xs text-[#8E8EA8] mt-2 leading-relaxed">
              Tomam decisões e impedem erros do usuário:
            </p>
            <ul className="mt-3 space-y-2 text-xs font-mono text-[#D6D6E6]">
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-amber-400">if "." not in val:</strong> previne pontos decimais repetidos (ex: "5..2").
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-amber-400">if val == "0":</strong> substitui o zero inicial em vez de concatenar "08".
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-amber-400">if b == 0:</strong> evita divisão por zero antes que ela cause erro.
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232334] text-[11px] text-amber-400/80">
            ✓ Proteção contra entradas inválidas
          </div>
        </div>

        {/* 4 OPERAÇÕES BÁSICAS */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 flex flex-col justify-between hover:border-sky-400/40 transition-all">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/20">
              <Activity size={20} />
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              4. As 4 Operações Básicas
            </h3>
            <p className="text-xs text-[#8E8EA8] mt-2 leading-relaxed">
              Matemática direta com números inteiros e decimais:
            </p>
            <ul className="mt-3 space-y-2 text-xs font-mono text-[#D6D6E6]">
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-sky-400">Adição (+):</strong> a + b
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-sky-400">Subtração (−):</strong> a - b
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-sky-400">Multiplicação (×):</strong> a * b
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-sky-400">Divisão (÷):</strong> a / b (com teste para b ≠ 0)
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232334] text-[11px] text-sky-400/80">
            ✓ Formatação limpa (sem .0 desnecessário)
          </div>
        </div>

        {/* EVENTOS */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 flex flex-col justify-between hover:border-pink-400/40 transition-all">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4 border border-pink-500/20">
              <Code2 size={20} />
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              5. Eventos dos Botões
            </h3>
            <p className="text-xs text-[#8E8EA8] mt-2 leading-relaxed">
              Como o Tkinter escuta os comandos do usuário:
            </p>
            <ul className="mt-3 space-y-2 text-xs font-mono text-[#D6D6E6]">
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-pink-400">command=lambda:</strong> executa a função ao clicar no botão.
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-pink-400">&lt;Enter&gt; / &lt;Leave&gt;:</strong> altera a cor quando o mouse passa por cima.
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-pink-400">root.bind(...):</strong> conecta o teclado físico (0-9, +, -, Enter).
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232334] text-[11px] text-pink-400/80">
            ✓ Resposta ágil e intuitiva
          </div>
        </div>

        {/* TRATAMENTO DE ERROS */}
        <div className="bg-[#15151D] border border-[#2B2B3D] rounded-3xl p-6 flex flex-col justify-between hover:border-rose-400/40 transition-all">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/20">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              6. Tratamento de Erros (try / except)
            </h3>
            <p className="text-xs text-[#8E8EA8] mt-2 leading-relaxed">
              Garante que o programa nunca trave diante de operações impossíveis:
            </p>
            <ul className="mt-3 space-y-2 text-xs font-mono text-[#D6D6E6]">
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-rose-400">ZeroDivisionError:</strong> captura divisões por zero e mostra aviso amigável.
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-rose-400">ValueError:</strong> protege contra conversões inválidas de texto para número.
              </li>
              <li className="bg-[#1C1C27] p-2 rounded-lg border border-[#272738]">
                <strong className="text-rose-400">has_error:</strong> reseta a mensagem assim que o usuário digita um novo número.
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232334] text-[11px] text-rose-400/80">
            ✓ Software estável e confiável
          </div>
        </div>
      </div>
    </div>
  );
};
