"""
=============================================================================
SUITE DE TESTES UNITÁRIOS: Calcify
Projeto: Engenharia de Software - Testes Automatizados
=============================================================================
"""

import unittest
from calculator_core import CalculatorLogic


class TestCalculatorLogic(unittest.TestCase):
    def setUp(self):
        """Executado antes de cada teste individual."""
        self.calc = CalculatorLogic()

    def test_initial_state(self):
        """Verifica o estado inicial da calculadora."""
        self.assertEqual(self.calc.current_value, "0")
        self.assertEqual(self.calc.expression, "")
        self.assertFalse(self.calc.has_error)

    def test_addition(self):
        """Teste de Adição: 15 + 27 = 42"""
        self.calc.input_digit("1")
        self.calc.input_digit("5")
        self.calc.set_operator("+")
        self.calc.input_digit("2")
        self.calc.input_digit("7")
        self.calc.calculate_equal()
        self.assertEqual(self.calc.current_value, "42")
        self.assertIn("15 + 27 =", self.calc.expression)

    def test_subtraction(self):
        """Teste de Subtração: 100 - 35 = 65"""
        self.calc.input_digit("1")
        self.calc.input_digit("0")
        self.calc.input_digit("0")
        self.calc.set_operator("-")
        self.calc.input_digit("3")
        self.calc.input_digit("5")
        self.calc.calculate_equal()
        self.assertEqual(self.calc.current_value, "65")

    def test_multiplication(self):
        """Teste de Multiplicação: 12 * 8 = 96"""
        self.calc.input_digit("1")
        self.calc.input_digit("2")
        self.calc.set_operator("*")
        self.calc.input_digit("8")
        self.calc.calculate_equal()
        self.assertEqual(self.calc.current_value, "96")

    def test_division(self):
        """Teste de Divisão: 100 / 4 = 25"""
        self.calc.input_digit("1")
        self.calc.input_digit("0")
        self.calc.input_digit("0")
        self.calc.set_operator("/")
        self.calc.input_digit("4")
        self.calc.calculate_equal()
        self.assertEqual(self.calc.current_value, "25")

    def test_division_by_zero(self):
        """Teste de Divisão por Zero: deve gerar mensagem amigável sem travar."""
        self.calc.input_digit("5")
        self.calc.set_operator("/")
        self.calc.input_digit("0")
        self.calc.calculate_equal()
        self.assertTrue(self.calc.has_error)
        self.assertEqual(self.calc.current_value, "Não é possível dividir por zero")

    def test_percentage_standalone(self):
        """Teste de Porcentagem isolada: 50% = 0.5"""
        self.calc.input_digit("5")
        self.calc.input_digit("0")
        self.calc.input_percentage()
        self.assertEqual(self.calc.current_value, "0.5")

    def test_percentage_with_addition(self):
        """Teste de Porcentagem comercial: 200 + 10% (10% de 200 = 20) -> 200 + 20 = 220"""
        self.calc.input_digit("2")
        self.calc.input_digit("0")
        self.calc.input_digit("0")
        self.calc.set_operator("+")
        self.calc.input_digit("1")
        self.calc.input_digit("0")
        self.calc.input_percentage()
        self.assertEqual(self.calc.current_value, "20")
        self.calc.calculate_equal()
        self.assertEqual(self.calc.current_value, "220")

    def test_backspace(self):
        """Teste do botão Apagar (⌫): 123 -> 12 -> 1 -> 0"""
        self.calc.input_digit("1")
        self.calc.input_digit("2")
        self.calc.input_digit("3")
        self.calc.backspace()
        self.assertEqual(self.calc.current_value, "12")
        self.calc.backspace()
        self.assertEqual(self.calc.current_value, "1")
        self.calc.backspace()
        self.assertEqual(self.calc.current_value, "0")

    def test_clear_all(self):
        """Teste do botão AC: reseta todos os valores."""
        self.calc.input_digit("9")
        self.calc.set_operator("+")
        self.calc.input_digit("9")
        self.calc.clear_all()
        self.assertEqual(self.calc.current_value, "0")
        self.assertEqual(self.calc.expression, "")
        self.assertIsNone(self.calc.first_operand)

    def test_decimal_prevention(self):
        """Teste de validação: previne múltiplos pontos decimais (ex: 3.1.4)."""
        self.calc.input_digit("3")
        self.calc.input_decimal()
        self.calc.input_digit("1")
    def test_history(self):
        """Teste de Histórico: verifica se operações calculadas são gravadas."""
        self.assertEqual(len(self.calc.history), 0)
        # 10 + 5 = 15
        self.calc.input_digit("1")
        self.calc.input_digit("0")
        self.calc.set_operator("+")
        self.calc.input_digit("5")
        self.calc.calculate_equal()
        self.assertEqual(len(self.calc.history), 1)
        self.assertEqual(self.calc.history[0]["result"], "15")

        # 4 * 3 = 12
        self.calc.input_digit("4")
        self.calc.set_operator("*")
        self.calc.input_digit("3")
        self.calc.calculate_equal()
        self.assertEqual(len(self.calc.history), 2)
        self.assertEqual(self.calc.history[1]["result"], "12")

        # Limpar histórico
        self.calc.clear_history()
        self.assertEqual(len(self.calc.history), 0)


if __name__ == "__main__":
    unittest.main()
