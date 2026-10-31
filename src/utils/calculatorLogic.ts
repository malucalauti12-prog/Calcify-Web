/**
 * Motor de Cálculo da Calcify (TypeScript / Web)
 * Implementa exatamente a mesma máquina de estados da classe CalculatorLogic em Python.
 */

export interface CalculatorState {
  currentValue: string;
  expression: string;
  firstOperand: number | null;
  operator: string | null;
  resetOnNextInput: boolean;
  hasError: boolean;
}

export const INITIAL_STATE: CalculatorState = {
  currentValue: "0",
  expression: "",
  firstOperand: null,
  operator: null,
  resetOnNextInput: false,
  hasError: false,
};

export function formatNumber(num: number): string {
  if (isNaN(num) || !isFinite(num)) {
    return "Indefinido";
  }
  if (Number.isInteger(num)) {
    return num.toString();
  }
  // Limita até 8 casas decimais e remove zeros à direita
  const fixed = num.toFixed(8);
  return fixed.replace(/\.?0+$/, "");
}

export function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.hasError) {
    return {
      ...INITIAL_STATE,
      currentValue: digit,
    };
  }

  if (state.resetOnNextInput) {
    return {
      ...state,
      currentValue: digit,
      resetOnNextInput: false,
    };
  }

  if (state.currentValue === "0") {
    return {
      ...state,
      currentValue: digit,
    };
  }

  if (state.currentValue.length >= 14) {
    return state;
  }

  return {
    ...state,
    currentValue: state.currentValue + digit,
  };
}

export function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.hasError) {
    return {
      ...INITIAL_STATE,
      currentValue: "0.",
    };
  }

  if (state.resetOnNextInput) {
    return {
      ...state,
      currentValue: "0.",
      resetOnNextInput: false,
    };
  }

  if (state.currentValue.includes(".")) {
    return state;
  }

  return {
    ...state,
    currentValue: state.currentValue + ".",
  };
}

export function toggleSign(state: CalculatorState): CalculatorState {
  if (state.hasError || state.currentValue === "0") {
    return state;
  }

  if (state.currentValue.startsWith("-")) {
    return {
      ...state,
      currentValue: state.currentValue.substring(1),
    };
  }

  return {
    ...state,
    currentValue: "-" + state.currentValue,
  };
}

export function backspace(state: CalculatorState): CalculatorState {
  if (state.hasError) {
    return INITIAL_STATE;
  }

  if (state.resetOnNextInput) {
    return {
      ...state,
      currentValue: "0",
      resetOnNextInput: false,
    };
  }

  if (
    state.currentValue.length > 1 &&
    !(state.currentValue.length === 2 && state.currentValue.startsWith("-"))
  ) {
    return {
      ...state,
      currentValue: state.currentValue.slice(0, -1),
    };
  }

  return {
    ...state,
    currentValue: "0",
  };
}

export function clearAll(): CalculatorState {
  return INITIAL_STATE;
}

export function inputPercentage(state: CalculatorState): CalculatorState {
  if (state.hasError) return state;

  const curr = parseFloat(state.currentValue);
  if (isNaN(curr)) {
    return {
      ...state,
      currentValue: "Erro de cálculo",
      hasError: true,
      resetOnNextInput: true,
    };
  }

  let pctValue: number;
  if (state.firstOperand !== null && (state.operator === "+" || state.operator === "-")) {
    pctValue = (state.firstOperand * curr) / 100.0;
  } else {
    pctValue = curr / 100.0;
  }

  return {
    ...state,
    currentValue: formatNumber(pctValue),
    resetOnNextInput: true,
  };
}

export function setOperator(state: CalculatorState, op: string): CalculatorState {
  if (state.hasError) return state;

  const symbolMap: Record<string, string> = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  };
  const displaySymbol = symbolMap[op] || op;

  const curr = parseFloat(state.currentValue);
  if (isNaN(curr)) {
    return {
      ...state,
      currentValue: "Número inválido",
      hasError: true,
      resetOnNextInput: true,
    };
  }

  // Se já tínhamos primeiro operando e operador e o usuário não acabou de clicar no operador
  if (state.firstOperand !== null && state.operator !== null && !state.resetOnNextInput) {
    const executed = executeMath(state.firstOperand, curr, state.operator);
    if (executed.hasError) {
      return {
        ...state,
        currentValue: executed.message,
        hasError: true,
        firstOperand: null,
        operator: null,
        resetOnNextInput: true,
      };
    }
    const intermediate = executed.result;
    return {
      ...state,
      firstOperand: intermediate,
      operator: op,
      expression: `${formatNumber(intermediate)} ${displaySymbol}`,
      currentValue: formatNumber(intermediate),
      resetOnNextInput: true,
    };
  }

  return {
    ...state,
    firstOperand: curr,
    operator: op,
    expression: `${formatNumber(curr)} ${displaySymbol}`,
    resetOnNextInput: true,
  };
}

export function calculateEqual(state: CalculatorState): CalculatorState {
  if (state.hasError || state.operator === null || state.firstOperand === null) {
    return state;
  }

  const second = parseFloat(state.currentValue);
  if (isNaN(second)) {
    return {
      ...state,
      currentValue: "Entrada inválida",
      hasError: true,
      resetOnNextInput: true,
    };
  }

  const symbolMap: Record<string, string> = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  };
  const displaySymbol = symbolMap[state.operator] || state.operator;

  const exprText = `${formatNumber(state.firstOperand)} ${displaySymbol} ${formatNumber(second)} =`;
  const executed = executeMath(state.firstOperand, second, state.operator);

  if (executed.hasError) {
    return {
      ...state,
      expression: exprText,
      currentValue: executed.message,
      hasError: true,
      firstOperand: null,
      operator: null,
      resetOnNextInput: true,
    };
  }

  return {
    ...state,
    expression: exprText,
    currentValue: formatNumber(executed.result),
    hasError: false,
    firstOperand: null,
    operator: null,
    resetOnNextInput: true,
  };
}

function executeMath(
  a: number,
  b: number,
  op: string
): { hasError: false; result: number } | { hasError: true; message: string } {
  if (op === "+") {
    return { hasError: false, result: a + b };
  }
  if (op === "-") {
    return { hasError: false, result: a - b };
  }
  if (op === "*") {
    return { hasError: false, result: a * b };
  }
  if (op === "/") {
    if (b === 0) {
      return { hasError: true, message: "Não é possível dividir por zero" };
    }
    return { hasError: false, result: a / b };
  }
  return { hasError: true, message: "Operação desconhecida" };
}

// Síntese de áudio sutil de clique (Web Audio API)
let audioCtx: AudioContext | null = null;

export function playKeySound(isAccent = false) {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    const freq = isAccent ? 680 : 420;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch {
    // áudio silencioso se bloqueado
  }
}
