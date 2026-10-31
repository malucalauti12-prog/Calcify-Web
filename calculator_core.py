"""
=============================================================================
PROJETO: Calcify
MÓDULO: calculator_core.py
DESCRIÇÃO: Motor matemático puro, regras de negócio e histórico de cálculos.
=============================================================================
"""

import math
from typing import List, Dict, Optional


class CalculatorLogic:
    """
    Classe responsável pela regra de negócios e cálculo das operações.
    Gerencia o estado atual: expressão, valor exibido, histórico e flags de erro.
    """

    def __init__(self):
        # VARIÁVEIS DE ESTADO:
        self.expression: str = ""       # Expressão secundária (ex: "12 + 5 ×")
        self.current_value: str = "0"   # Valor em destaque no visor principal
        self.first_operand: Optional[float] = None  # Primeiro número da operação
        self.operator: Optional[str] = None         # Operador atual (+, -, *, /)
        self.reset_on_next_input: bool = False      # Flag: limpa ao digitar novo número
        self.has_error: bool = False                 # Flag: indica estado de erro amigável
        
        # HISTÓRICO DE CÁLCULOS:
        # Lista com os últimos cálculos realizados [{"expression": "...", "result": "..."}]
        self.history: List[Dict[str, str]] = []

    def clear_all(self):
        """Limpa toda a calculadora (equivalente ao botão AC)."""
        self.expression = ""
        self.current_value = "0"
        self.first_operand = None
        self.operator = None
        self.reset_on_next_input = False
        self.has_error = False

    def clear_history(self):
        """Limpa o histórico de operações realizadas."""
        self.history.clear()

    def backspace(self):
        """Apaga o último caractere digitado (botão ⌫)."""
        if self.has_error:
            self.clear_all()
            return

        if self.reset_on_next_input:
            self.current_value = "0"
            self.reset_on_next_input = False
            return

        # CONDICIONAL: se tiver mais de um caractere, remove o último. Senão, vira "0".
        if len(self.current_value) > 1 and not (len(self.current_value) == 2 and self.current_value.startswith("-")):
            self.current_value = self.current_value[:-1]
        else:
            self.current_value = "0"

    def input_digit(self, digit: str):
        """Insere um algarismo (0 a 9) no visor."""
        if self.has_error:
            self.clear_all()

        if self.reset_on_next_input:
            self.current_value = digit
            self.reset_on_next_input = False
        else:
            if self.current_value == "0":
                self.current_value = digit
            else:
                if len(self.current_value) < 14:
                    self.current_value += digit

    def input_decimal(self):
        """Insere ponto decimal (.) tratando validação de duplicidade."""
        if self.has_error:
            self.clear_all()

        if self.reset_on_next_input:
            self.current_value = "0."
            self.reset_on_next_input = False
            return

        # CONDICIONAL: evita que o usuário digite "5..2"
        if "." not in self.current_value:
            self.current_value += "."

    def toggle_sign(self):
        """Inverte o sinal do número atual (+/-)."""
        if self.has_error or self.current_value == "0":
            return

        if self.current_value.startswith("-"):
            self.current_value = self.current_value[1:]
        else:
            self.current_value = "-" + self.current_value

    def input_percentage(self):
        """
        Calcula a porcentagem (%):
        - Contextual com operador (+ ou -): calcula a porcentagem do valor base
        - Isolado: divide por 100
        """
        if self.has_error:
            return

        try:
            curr = float(self.current_value)
            if self.first_operand is not None and self.operator in ("+", "-"):
                pct_value = (self.first_operand * curr) / 100.0
                self.current_value = self._format_number(pct_value)
            else:
                pct_value = curr / 100.0
                self.current_value = self._format_number(pct_value)
            self.reset_on_next_input = True
        except (ValueError, OverflowError):
            self.set_friendly_error("Erro de cálculo")

    def set_operator(self, op: str):
        """Define um operador (+, −, ×, ÷) e encadeia operações pendentes."""
        if self.has_error:
            return

        symbol_map = {"+": "+", "-": "−", "*": "×", "/": "÷"}
        display_symbol = symbol_map.get(op, op)

        try:
            curr = float(self.current_value)

            # Se já tínhamos um operando e operador, calcula em cadeia (ex: 2 + 3 + 4)
            if self.first_operand is not None and self.operator is not None and not self.reset_on_next_input:
                success = self._execute_operation(self.first_operand, curr, self.operator)
                if not success:
                    return

            self.first_operand = float(self.current_value)
            self.operator = op
            self.expression = f"{self._format_number(self.first_operand)} {display_symbol}"
            self.reset_on_next_input = True

        except ValueError:
            self.set_friendly_error("Número inválido")

    def calculate_equal(self):
        """Executa a operação pendente, exibe o resultado e grava no histórico."""
        if self.has_error:
            return

        if self.operator is None or self.first_operand is None:
            return

        try:
            second_operand = float(self.current_value)
            symbol_map = {"+": "+", "-": "−", "*": "×", "/": "÷"}
            display_symbol = symbol_map.get(self.operator, self.operator)

            full_expression = f"{self._format_number(self.first_operand)} {display_symbol} {self._format_number(second_operand)} ="
            self.expression = full_expression

            success = self._execute_operation(self.first_operand, second_operand, self.operator)
            
            # Se a operação foi bem-sucedida, adiciona ao histórico
            if success:
                self.history.append({
                    "expression": full_expression,
                    "result": self.current_value
                })
                # Mantém até 30 registros no histórico para não sobrecarregar
                if len(self.history) > 30:
                    self.history.pop(0)

            self.first_operand = None
            self.operator = None
            self.reset_on_next_input = True

        except ValueError:
            self.set_friendly_error("Entrada inválida")

    def _execute_operation(self, a: float, b: float, op: str) -> bool:
        """Realiza as operações matemáticas básicas com tratamento de erros."""
        try:
            if op == "+":
                result = a + b
            elif op == "-":
                result = a - b
            elif op == "*":
                result = a * b
            elif op == "/":
                if b == 0:
                    self.set_friendly_error("Não é possível dividir por zero")
                    return False
                result = a / b
            else:
                return False

            self.current_value = self._format_number(result)
            return True

        except ZeroDivisionError:
            self.set_friendly_error("Não é possível dividir por zero")
            return False
        except OverflowError:
            self.set_friendly_error("Número muito grande")
            return False
        except Exception:
            self.set_friendly_error("Erro de cálculo")
            return False

    def set_friendly_error(self, message: str):
        """Define um estado de erro amigável sem travar o aplicativo."""
        self.current_value = message
        self.has_error = True
        self.first_operand = None
        self.operator = None
        self.reset_on_next_input = True

    def _format_number(self, num: float) -> str:
        """Formata o número para exibição limpa."""
        if math.isnan(num) or math.isinf(num):
            return "Indefinido"
        if num.is_integer():
            return str(int(num))
        return f"{num:.8f}".rstrip("0").rstrip(".")
