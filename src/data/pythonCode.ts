export interface CodeConcept {
  id: string;
  label: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
  lines: number[];
}

export const PYTHON_CALCIFY_CODE = `"""
=============================================================================
PROJETO: Calcify
DESCRIÇÃO: Calculadora moderna em Python com interface gráfica Tkinter.
RECURSOS ADICIONADOS:
  - 🎨 Alternância entre Tema Escuro e Tema Claro (Dark / Light Mode)
  - 📜 Histórico de Cálculos retrátil (não polui a estética da aplicação)
  - ⚡ 4 Operações Básicas (+, −, ×, ÷), Porcentagem (%) e Edição (⌫, AC)
  - 🛡️ Tratamento defensivo de erros (divisão por zero amigável)
SLOGAN: "Make numbers simple."
=============================================================================
"""

import sys
import math

try:
    import tkinter as tk
    from tkinter import font as tkfont
except ImportError:
    print("[ERRO] Tkinter não encontrado. No Windows, o Tkinter vem instalado com o Python.")
    sys.exit(1)

# Suporte a High-DPI no Windows (elimina textos borrados)
try:
    from ctypes import windll
    windll.shcore.SetProcessDpiAwareness(1)
except Exception:
    pass


# =============================================================================
# 1. TEMAS & PALETA DE CORES (Escuro e Claro)
# =============================================================================
THEMES = {
    "dark": {
        "name": "Escuro",
        "bg": "#15151D",              # Fundo principal
        "card": "#1C1C27",            # Fundo do visor e cards
        "btn_num": "#252535",         # Botões numéricos secundários
        "btn_num_hover": "#34344A",   # Hover dos números
        "btn_op": "#27223D",          # Botões de operadores (+, −, ×, ÷)
        "btn_op_hover": "#3A3459",    # Hover dos operadores
        "accent": "#A78BFA",          # Lilás de destaque principal
        "accent_hover": "#BBA4FB",    # Hover do destaque
        "accent_text": "#15151D",     # Texto no botão igual (=)
        "text_main": "#FFFFFF",       # Texto principal branco
        "text_muted": "#8E8EA8",      # Texto secundário (histórico/slogan)
        "border": "#2B2B3D",          # Bordas sutis
        "error": "#F87171",           # Alerta de erro
        "badge_bg": "#27203F",        # Fundo do badge 'C'
    },
    "light": {
        "name": "Claro",
        "bg": "#F4F4F8",              # Fundo claro minimalista
        "card": "#FFFFFF",            # Card branco puro
        "btn_num": "#E5E5EE",         # Botões numéricos cinza suave
        "btn_num_hover": "#D8D8E5",   # Hover claro
        "btn_op": "#EBE7FA",          # Operadores em tom lilás pastel
        "btn_op_hover": "#DDD6F8",    # Hover operadores
        "accent": "#7C3AED",          # Roxo vibrante de destaque
        "accent_hover": "#6D28D9",    # Hover destaque
        "accent_text": "#FFFFFF",     # Texto branco no botão igual
        "text_main": "#15151D",       # Texto quase preto de alto contraste
        "text_muted": "#6E6E85",      # Texto secundário suave
        "border": "#D8D8E5",          # Bordas suaves
        "error": "#DC2626",           # Vermelho de erro
        "badge_bg": "#EBE7FA",        # Fundo do badge 'C'
    }
}


# =============================================================================
# 2. LÓGICA MATEMÁTICA & HISTÓRICO (Regra de Negócio)
# =============================================================================
class CalculatorLogic:
    """
    Controla os cálculos, o estado da calculadora e o histórico de operações.
    """

    def __init__(self):
        # VARIÁVEIS DE ESTADO:
        self.current_value = "0"
        self.expression = ""
        self.first_operand = None
        self.operator = None
        self.reset_on_next_input = False
        self.has_error = False

        # HISTÓRICO DE CÁLCULOS:
        self.history = []

    def clear_all(self):
        """Ação do botão AC: limpa todos os valores atuais."""
        self.current_value = "0"
        self.expression = ""
        self.first_operand = None
        self.operator = None
        self.reset_on_next_input = False
        self.has_error = False

    def clear_history(self):
        """Limpa todo o histórico gravado."""
        self.history.clear()

    def backspace(self):
        """Ação do botão ⌫: apaga o último caractere digitado."""
        if self.has_error:
            self.clear_all()
            return

        if self.reset_on_next_input:
            self.current_value = "0"
            self.reset_on_next_input = False
            return

        # CONDIÇÃO: remove o último caractere se houver mais de um
        if len(self.current_value) > 1 and not (len(self.current_value) == 2 and self.current_value.startswith("-")):
            self.current_value = self.current_value[:-1]
        else:
            self.current_value = "0"

    def input_digit(self, digit: str):
        """Insere um algarismo de 0 a 9."""
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
        """Insere o ponto decimal sem permitir repetição (ex: 3.14)."""
        if self.has_error:
            self.clear_all()

        if self.reset_on_next_input:
            self.current_value = "0."
            self.reset_on_next_input = False
            return

        # CONDIÇÃO: apenas insere se ainda não tiver ponto
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
        """Calcula porcentagem comercial ou proporcional."""
        if self.has_error:
            return

        try:
            curr = float(self.current_value)
            if self.first_operand is not None and self.operator in ("+", "-"):
                pct = (self.first_operand * curr) / 100.0
                self.current_value = self._format_number(pct)
            else:
                pct = curr / 100.0
                self.current_value = self._format_number(pct)
            self.reset_on_next_input = True
        except (ValueError, OverflowError):
            self.set_friendly_error("Erro de cálculo")

    def set_operator(self, op: str):
        """Define o operador (+, −, ×, ÷) e encadeia operações pendentes."""
        if self.has_error:
            return

        symbol_map = {"+": "+", "-": "−", "*": "×", "/": "÷"}
        display_symbol = symbol_map.get(op, op)

        try:
            curr = float(self.current_value)

            if self.first_operand is not None and self.operator is not None and not self.reset_on_next_input:
                ok = self._execute_operation(self.first_operand, curr, self.operator)
                if not ok:
                    return

            self.first_operand = float(self.current_value)
            self.operator = op
            self.expression = f"{self._format_number(self.first_operand)} {display_symbol}"
            self.reset_on_next_input = True

        except ValueError:
            self.set_friendly_error("Entrada inválida")

    def calculate_equal(self):
        """Executa a conta, exibe o resultado e grava no histórico."""
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

            if success:
                self.history.append({
                    "expression": full_expression,
                    "result": self.current_value
                })
                if len(self.history) > 30:
                    self.history.pop(0)

            self.first_operand = None
            self.operator = None
            self.reset_on_next_input = True

        except ValueError:
            self.set_friendly_error("Entrada inválida")

    def _execute_operation(self, a: float, b: float, op: str) -> bool:
        """Executa as operações matemáticas com tratamento amigável de erro."""
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
        """Apresenta erro amigável sem congelar a aplicação."""
        self.current_value = message
        self.has_error = True
        self.first_operand = None
        self.operator = None
        self.reset_on_next_input = True

    def _format_number(self, num: float) -> str:
        """Formata o número eliminando .0 redundante."""
        if math.isnan(num) or math.isinf(num):
            return "Indefinido"
        if num.is_integer():
            return str(int(num))
        return f"{num:.8f}".rstrip("0").rstrip(".")


# =============================================================================
# 3. INTERFACE VISUAL (Tkinter GUI com Tema Escuro / Claro e Histórico)
# =============================================================================
class CalcifyApp:
    """
    Interface com Tkinter que suporta:
    - Alternância dinâmica entre Tema Claro e Tema Escuro
    - Histórico retrátil que não polui o visual
    - Teclado físico e layout responsivo
    """

    def __init__(self, root: tk.Tk):
        self.root = root
        self.logic = CalculatorLogic()
        self.current_theme_key = "dark"
        self.is_history_open = False

        self.root.title("Calcify - Make numbers simple.")
        self.root.geometry("400x670")
        self.root.minsize(360, 600)

        self.buttons_registry = []

        self._setup_typography()
        self._build_header()
        self._build_display()
        self._build_history_drawer()
        self._build_keypad()
        self._bind_keyboard()

        self.apply_theme()

    def _setup_typography(self):
        families = tkfont.families()
        chosen = "Segoe UI"
        for candidate in ["Space Grotesk", "Inter", "Segoe UI", "Helvetica", "Arial"]:
            if candidate in families:
                chosen = candidate
                break

        self.font_title = (chosen, 17, "bold")
        self.font_subtitle = (chosen, 9)
        self.font_expr = (chosen, 12)
        self.font_result = (chosen, 30, "bold")
        self.font_key = (chosen, 15, "bold")
        self.font_small = (chosen, 10)

    def _build_header(self):
        self.header_frame = tk.Frame(self.root)
        self.header_frame.pack(fill="x", padx=22, pady=(16, 8))

        top_row = tk.Frame(self.header_frame)
        top_row.pack(fill="x")

        brand_box = tk.Frame(top_row)
        brand_box.pack(side="left")

        self.lbl_badge = tk.Label(
            brand_box,
            text=" C ",
            font=(self.font_title[0], 11, "bold"),
            padx=5,
            pady=3,
            relief="flat"
        )
        self.lbl_badge.pack(side="left", padx=(0, 8))

        self.lbl_title = tk.Label(brand_box, text="Calcify", font=self.font_title)
        self.lbl_title.pack(side="left")

        actions_box = tk.Frame(top_row)
        actions_box.pack(side="right")

        self.btn_theme = tk.Button(
            actions_box,
            text="☀️ Claro",
            font=self.font_small,
            bd=0,
            padx=8,
            pady=3,
            cursor="hand2",
            relief="flat",
            command=self.toggle_theme
        )
        self.btn_theme.pack(side="left", padx=4)

        self.btn_history = tk.Button(
            actions_box,
            text="📜 Histórico",
            font=self.font_small,
            bd=0,
            padx=8,
            pady=3,
            cursor="hand2",
            relief="flat",
            command=self.toggle_history
        )
        self.btn_history.pack(side="left")

        self.lbl_slogan = tk.Label(
            self.header_frame,
            text="Make numbers simple.",
            font=self.font_subtitle
        )
        self.lbl_slogan.pack(anchor="w", pady=(2, 0))

    def _build_display(self):
        self.display_card = tk.Frame(self.root, padx=18, pady=14)
        self.display_card.pack(fill="x", padx=20, pady=(6, 10))

        self.lbl_expr = tk.Label(self.display_card, text="", font=self.font_expr, anchor="e")
        self.lbl_expr.pack(fill="x")

        self.lbl_result = tk.Label(self.display_card, text="0", font=self.font_result, anchor="e")
        self.lbl_result.pack(fill="x", pady=(2, 0))

    def _build_history_drawer(self):
        self.history_frame = tk.Frame(self.root, padx=12, pady=8)

        h_top = tk.Frame(self.history_frame)
        h_top.pack(fill="x", pady=(0, 4))

        self.lbl_hist_title = tk.Label(h_top, text="Histórico de Cálculos", font=(self.font_small[0], 9, "bold"))
        self.lbl_hist_title.pack(side="left")

        self.btn_clear_hist = tk.Button(
            h_top,
            text="Limpar",
            font=(self.font_small[0], 8),
            bd=0,
            cursor="hand2",
            relief="flat",
            command=self.on_clear_history
        )
        self.btn_clear_hist.pack(side="right")

        self.hist_listbox = tk.Listbox(
            self.history_frame,
            height=4,
            font=(self.font_small[0], 10),
            bd=0,
            highlightthickness=0,
            selectmode="single"
        )
        self.hist_listbox.pack(fill="both", expand=True)
        self.hist_listbox.bind("<Double-Button-1>", self.on_restore_history_item)

    def _build_keypad(self):
        self.pad_frame = tk.Frame(self.root)
        self.pad_frame.pack(fill="both", expand=True, padx=20, pady=(0, 18))

        for col in range(4):
            self.pad_frame.columnconfigure(col, weight=1, uniform="col")
        for row in range(5):
            self.pad_frame.rowconfigure(row, weight=1, uniform="row")

        layout = [
            [("AC", "clear", self.on_clear), ("⌫", "action", self.on_backspace), ("%", "op", lambda: self.on_operator("%")), ("÷", "op", lambda: self.on_operator("/"))],
            [("7", "num", lambda: self.on_digit("7")), ("8", "num", lambda: self.on_digit("8")), ("9", "num", lambda: self.on_digit("9")), ("×", "op", lambda: self.on_operator("*"))],
            [("4", "num", lambda: self.on_digit("4")), ("5", "num", lambda: self.on_digit("5")), ("6", "num", lambda: self.on_digit("6")), ("−", "op", lambda: self.on_operator("-"))],
            [("1", "num", lambda: self.on_digit("1")), ("2", "num", lambda: self.on_digit("2")), ("3", "num", lambda: self.on_digit("3")), ("+", "op", lambda: self.on_operator("+"))],
            [("±", "action", self.on_toggle_sign), ("0", "num", lambda: self.on_digit("0")), (".", "num", self.on_decimal), ("=", "equal", self.on_equal)]
        ]

        for r, row_items in enumerate(layout):
            for c, (text, kind, command) in enumerate(row_items):
                btn = tk.Button(
                    self.pad_frame,
                    text=text,
                    font=self.font_key,
                    bd=0,
                    relief="flat",
                    cursor="hand2",
                    command=command
                )
                btn.grid(row=r, column=c, padx=4, pady=4, sticky="nsew")
                self.buttons_registry.append((btn, kind))

    def toggle_theme(self):
        self.current_theme_key = "light" if self.current_theme_key == "dark" else "dark"
        self.apply_theme()

    def apply_theme(self):
        t = THEMES[self.current_theme_key]
        self.root.configure(bg=t["bg"])
        self.header_frame.configure(bg=t["bg"])
        for child in self.header_frame.winfo_children():
            child.configure(bg=t["bg"])
            for sub in child.winfo_children():
                if sub not in (self.btn_theme, self.btn_history, self.lbl_badge):
                    sub.configure(bg=t["bg"])

        self.lbl_badge.configure(bg=t["badge_bg"], fg=t["accent"])
        self.lbl_title.configure(fg=t["text_main"], bg=t["bg"])
        self.lbl_slogan.configure(fg=t["text_muted"], bg=t["bg"])

        self.btn_theme.configure(
            text="☀️ Claro" if self.current_theme_key == "dark" else "🌙 Escuro",
            bg=t["btn_num"],
            fg=t["text_main"],
            activebackground=t["btn_num_hover"],
            activeforeground=t["text_main"]
        )
        self.btn_history.configure(
            bg=t["accent"] if self.is_history_open else t["btn_num"],
            fg=t["accent_text"] if self.is_history_open else t["text_main"],
            activebackground=t["accent_hover"] if self.is_history_open else t["btn_num_hover"],
            activeforeground=t["accent_text"] if self.is_history_open else t["text_main"]
        )

        self.display_card.configure(bg=t["card"])
        self.lbl_expr.configure(bg=t["card"], fg=t["text_muted"])
        self.lbl_result.configure(
            bg=t["card"],
            fg=t["error"] if self.logic.has_error else t["text_main"]
        )

        self.history_frame.configure(bg=t["card"])
        for child in self.history_frame.winfo_children():
            child.configure(bg=t["card"])
            for sub in child.winfo_children():
                if sub != self.btn_clear_hist:
                    sub.configure(bg=t["card"])
        self.lbl_hist_title.configure(fg=t["text_main"], bg=t["card"])
        self.btn_clear_hist.configure(bg=t["btn_num"], fg=t["text_muted"])
        self.hist_listbox.configure(
            bg=t["bg"],
            fg=t["text_main"],
            selectbackground=t["accent"],
            selectforeground=t["accent_text"]
        )

        self.pad_frame.configure(bg=t["bg"])
        for btn, kind in self.buttons_registry:
            if kind == "equal":
                bg = t["accent"]
                fg = t["accent_text"]
                hover = t["accent_hover"]
            elif kind in ("op", "action", "clear"):
                bg = t["btn_op"]
                fg = t["accent"] if kind in ("op", "clear") else t["text_main"]
                hover = t["btn_op_hover"]
            else:
                bg = t["btn_num"]
                fg = t["text_main"]
                hover = t["btn_num_hover"]

            btn.configure(bg=bg, fg=fg, activebackground=hover, activeforeground=fg)
            btn.bind("<Enter>", lambda e, b=btn, h=hover: b.config(bg=h))
            btn.bind("<Leave>", lambda e, b=btn, base=bg: b.config(bg=base))

    def toggle_history(self):
        self.is_history_open = not self.is_history_open
        if self.is_history_open:
            self.history_frame.pack(fill="x", padx=20, pady=(0, 10), after=self.display_card)
            self._refresh_history_list()
        else:
            self.history_frame.pack_forget()
        self.apply_theme()

    def _refresh_history_list(self):
        self.hist_listbox.delete(0, tk.END)
        if not self.logic.history:
            self.hist_listbox.insert(tk.END, "  Nenhum cálculo registrado ainda.")
        else:
            for item in reversed(self.logic.history):
                self.hist_listbox.insert(tk.END, f"  {item['expression']} {item['result']}")

    def on_restore_history_item(self, event):
        selection = self.hist_listbox.curselection()
        if selection and self.logic.history:
            idx = len(self.logic.history) - 1 - selection[0]
            if 0 <= idx < len(self.logic.history):
                item = self.logic.history[idx]
                self.logic.current_value = item["result"]
                self.logic.expression = item["expression"]
                self.logic.reset_on_next_input = True
                self.update_view()

    def on_clear_history(self):
        self.logic.clear_history()
        self._refresh_history_list()

    def update_view(self):
        t = THEMES[self.current_theme_key]
        self.lbl_expr.config(text=self.logic.expression)
        val = self.logic.current_value

        if self.logic.has_error:
            self.lbl_result.config(text=val, fg=t["error"], font=(self.font_result[0], 14, "bold"))
        else:
            size = 30 if len(val) <= 7 else (22 if len(val) <= 10 else 16)
            self.lbl_result.config(text=val, fg=t["text_main"], font=(self.font_result[0], size, "bold"))

        if self.is_history_open:
            self._refresh_history_list()

    def on_digit(self, digit: str):
        self.logic.input_digit(digit)
        self.update_view()

    def on_decimal(self):
        self.logic.input_decimal()
        self.update_view()

    def on_clear(self):
        self.logic.clear_all()
        self.update_view()

    def on_backspace(self):
        self.logic.backspace()
        self.update_view()

    def on_toggle_sign(self):
        self.logic.toggle_sign()
        self.update_view()

    def on_operator(self, op: str):
        if op == "%":
            self.logic.input_percentage()
        else:
            self.logic.set_operator(op)
        self.update_view()

    def on_equal(self):
        self.logic.calculate_equal()
        self.update_view()

    def _bind_keyboard(self):
        for d in "0123456789":
            self.root.bind(d, lambda e, digit=d: self.on_digit(digit))
        self.root.bind(".", lambda e: self.on_decimal())
        self.root.bind(",", lambda e: self.on_decimal())
        self.root.bind("+", lambda e: self.on_operator("+"))
        self.root.bind("-", lambda e: self.on_operator("-"))
        self.root.bind("*", lambda e: self.on_operator("*"))
        self.root.bind("/", lambda e: self.on_operator("/"))
        self.root.bind("%", lambda e: self.on_operator("%"))
        self.root.bind("<Return>", lambda e: self.on_equal())
        self.root.bind("<KP_Enter>", lambda e: self.on_equal())
        self.root.bind("=", lambda e: self.on_equal())
        self.root.bind("<BackSpace>", lambda e: self.on_backspace())
        self.root.bind("<Escape>", lambda e: self.on_clear())
        self.root.bind("c", lambda e: self.on_clear())
        self.root.bind("C", lambda e: self.on_clear())


if __name__ == "__main__":
    root_window = tk.Tk()
    calc_app = CalcifyApp(root_window)
    root_window.mainloop()
`;

export const CODE_CONCEPTS: CodeConcept[] = [
  {
    id: "themes",
    label: "🎨 Temas (Escuro / Claro)",
    color: "#C084FC",
    badgeBg: "rgba(192, 132, 252, 0.15)",
    badgeBorder: "rgba(192, 132, 252, 0.3)",
    description: "Dicionário THEMES contendo as paletas visualmente testadas e a função apply_theme() que altera as cores do Tkinter instantaneamente.",
    lines: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 432, 436]
  },
  {
    id: "history",
    label: "📜 Histórico de Cálculos",
    color: "#38BDF8",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeBorder: "rgba(56, 189, 248, 0.3)",
    description: "Lista self.history gravada a cada calculate_equal(), com método clear_history() e painel retrátil que não polui o visual da calculadora.",
    lines: [96, 107, 219, 220, 221, 222, 223, 224, 396, 495, 504, 512, 522]
  },
  {
    id: "variables",
    label: "Variáveis & Estado",
    color: "#34D399",
    badgeBg: "rgba(52, 211, 153, 0.15)",
    badgeBorder: "rgba(52, 211, 153, 0.3)",
    description: "Variáveis de controle como self.current_value, self.expression, self.first_operand e constantes de tema.",
    lines: [87, 88, 89, 90, 91, 92, 96, 275, 276]
  },
  {
    id: "functions",
    label: "Funções & Métodos",
    color: "#A78BFA",
    badgeBg: "rgba(167, 139, 250, 0.15)",
    badgeBorder: "rgba(167, 139, 250, 0.3)",
    description: "Métodos que organizam o fluxo como input_digit(), set_operator(), calculate_equal(), backspace() e _format_number().",
    lines: [99, 107, 111, 129, 144, 158, 168, 186, 209, 232, 264, 271, 432, 436, 495, 504, 512, 522]
  },
  {
    id: "conditions",
    label: "Condições (if/elif/else)",
    color: "#FBBF24",
    badgeBg: "rgba(251, 191, 36, 0.15)",
    badgeBorder: "rgba(251, 191, 36, 0.3)",
    description: "Estruturas de decisão que validam pontos repetidos, controlam números iniciais com zero e protegem contra entradas inválidas.",
    lines: [113, 117, 123, 131, 135, 138, 146, 150, 156, 160, 163, 170, 174, 195, 211, 215, 237, 239, 241, 243, 245]
  },
  {
    id: "math_ops",
    label: "Operações Matemáticas",
    color: "#60A5FA",
    badgeBg: "rgba(96, 165, 250, 0.15)",
    badgeBorder: "rgba(96, 165, 250, 0.3)",
    description: "Operações aritméticas fundamentais de adição (+), subtração (−), multiplicação (×), divisão (÷) e porcentagem (%).",
    lines: [175, 178, 238, 240, 242, 248]
  },
  {
    id: "error_handling",
    label: "Tratamento de Erros (try/except)",
    color: "#F87171",
    badgeBg: "rgba(248, 113, 113, 0.15)",
    badgeBorder: "rgba(248, 113, 113, 0.3)",
    description: "Captura defensiva de ZeroDivisionError, ValueError e OverflowError, exibindo mensagens amigáveis sem travar a aplicação.",
    lines: [172, 181, 191, 203, 214, 226, 236, 245, 246, 253, 256, 259]
  }
];

export interface OperationExample {
  title: string;
  category: string;
  steps: string[];
  displayExpr: string;
  expectedResult: string;
  explanation: string;
  keysSequence: string[];
}

export const OPERATION_EXAMPLES: OperationExample[] = [
  {
    title: "Adição Simples",
    category: "Básico",
    steps: ["Digitar 15", "Pressionar +", "Digitar 27", "Pressionar ="],
    displayExpr: "15 + 27 =",
    expectedResult: "42",
    explanation: "Soma direta entre dois números inteiros positivos.",
    keysSequence: ["1", "5", "+", "2", "7", "="]
  },
  {
    title: "Subtração com Decimais",
    category: "Decimais",
    steps: ["Digitar 100.5", "Pressionar −", "Digitar 35.25", "Pressionar ="],
    displayExpr: "100.5 − 35.25 =",
    expectedResult: "65.25",
    explanation: "Subtração precisa com casas decimais e validação de ponto único.",
    keysSequence: ["1", "0", "0", ".", "5", "-", "3", "5", ".", "2", "5", "="]
  },
  {
    title: "Multiplicação",
    category: "Básico",
    steps: ["Digitar 12", "Pressionar ×", "Digitar 8", "Pressionar ="],
    displayExpr: "12 × 8 =",
    expectedResult: "96",
    explanation: "Multiplicação entre números inteiros com símbolo moderno ×.",
    keysSequence: ["1", "2", "*", "8", "="]
  },
  {
    title: "Divisão Exata",
    category: "Básico",
    steps: ["Digitar 100", "Pressionar ÷", "Digitar 4", "Pressionar ="],
    displayExpr: "100 ÷ 4 =",
    expectedResult: "25",
    explanation: "Divisão formatada sem zeros à direita desnecessários (.0 omitido).",
    keysSequence: ["1", "0", "0", "/", "4", "="]
  },
  {
    title: "Divisão por Zero (Amigável)",
    category: "Tratamento de Erro",
    steps: ["Digitar 50", "Pressionar ÷", "Digitar 0", "Pressionar ="],
    displayExpr: "50 ÷ 0 =",
    expectedResult: "Não é possível dividir por zero",
    explanation: "Evita o crash do programa capturando ZeroDivisionError e exibindo aviso elegante.",
    keysSequence: ["5", "0", "/", "0", "="]
  },
  {
    title: "Porcentagem Comercial",
    category: "Porcentagem",
    steps: ["Digitar 200", "Pressionar +", "Digitar 10", "Pressionar %", "Pressionar ="],
    displayExpr: "200 + 20 =",
    expectedResult: "220",
    explanation: "Calcula 10% de 200 (que é 20) e soma ao total, muito comum no comércio.",
    keysSequence: ["2", "0", "0", "+", "1", "0", "%", "="]
  },
  {
    title: "Apagar Último Dígito (⌫)",
    category: "Edição",
    steps: ["Digitar 1289", "Pressionar ⌫", "Digitar 5", "Pressionar ="],
    displayExpr: "",
    expectedResult: "1285",
    explanation: "Permite corrigir erros de digitação sem precisar reiniciar com AC.",
    keysSequence: ["1", "2", "8", "9", "backspace", "5"]
  }
];
