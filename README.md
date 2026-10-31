# Calcify - "Make numbers simple."

Simplicidade nos detalhes, eficiência nos cálculos. Uma experiência moderna que combina praticidade, precisão e design intuitivo.

## 🎓 Contexto do projeto

O Calcify foi desenvolvido como parte do **Desafio 1 da Imersão Engenharia de Software: Dev na Era da IA**, promovida pela [Alura](https://www.alura.com.br/).

A proposta do desafio envolveu a criação de uma calculadora utilizando o **Google AI Studio** como ferramenta de apoio ao desenvolvimento.

Durante a atividade, foram trabalhados conceitos de lógica de programação, operações matemáticas e construção de aplicações. O projeto também passou por aprimoramentos posteriores, incluindo funcionalidades adicionais e melhorias na experiência do usuário.

**Ferramentas utilizadas no desenvolvimento:**
- [Alura](https://www.alura.com.br/) — plataforma responsável pela imersão.
- [Google AI Studio](https://aistudio.google.com/) — ferramenta de IA utilizada como apoio na criação e evolução do projeto.
- Python e Tkinter — tecnologias utilizadas na implementação da calculadora.

---

## 🎨 Identidade Visual (Design System)
- **Fundo Principal:** Grafite quase preto (`#15151D`)
- **Card do Visor:** Grafite profundo (`#1C1C27`)
- **Botões Secundários (Números):** Cinza escuro (`#252535`)
- **Botões de Operadores:** Tom escuro com toque lilás (`#27223D`)
- **Cor de Destaque (Accent):** Lilás Calcify (`#A78BFA`)
- **Textos:** Branco puro (`#FFFFFF`) e Muted (`#8E8EA8`)
- **Tipografia:** Space Grotesk / Inter / Segoe UI
- **Logo:** Símbolo "C" em lilás e slogan *"Make numbers simple."*

---

## 📁 Estrutura de Arquivos do Projeto

```text
calcify/
│
├── calcify.py            # Aplicação principal completa (GUI + Lógica)
├── calculator_core.py    # Módulo de lógica matemática pura (Clean Code)
├── test_calcify.py       # Bateria de testes unitários automatizados
├── run_windows.bat       # Atalho executável de dois cliques para Windows
└── README.md             # Documentação e instruções completas
```

---

## 💻 Instruções para Executar no Windows

### Passo 1: Verificar se o Python está instalado
Abra o **Prompt de Comando (CMD)** ou o **PowerShell** no Windows e digite:
```cmd
python --version
```
> Se o Python não estiver instalado:
> 1. Baixe a versão mais recente em [python.org](https://www.python.org/downloads/).
> 2. **IMPORTANTE:** Durante a instalação, marque a caixinha **"Add python.exe to PATH"**!
> 3. Certifique-se de que a opção **"tcl/tk and IDLE"** (que inclui o Tkinter) está selecionada.

### Passo 2: Executar a Calculadora
Navegue até a pasta do projeto e execute:
```cmd
python calcify.py
```
*Ou simplesmente dê um duplo clique no arquivo `run_windows.bat`!*

---

## 🧪 Como Rodar os Testes Unitários

Para testar todas as operações matemáticas e garantir que nenhum erro ocorra:
```cmd
python -m unittest test_calcify.py
```
Resultado esperado:
```text
...........
----------------------------------------------------------------------
Ran 11 tests in 0.001s

OK
```

---

## ⌨️ Atalhos de Teclado Suportados

| Tecla | Função |
|---|---|
| `0–9` | Inserir números |
| `.` | Inserir separador decimal |
| `+` | Adição |
| `-` | Subtração |
| `*` | Multiplicação |
| `/` | Divisão |
| `%` | Porcentagem |
| `Enter` ou `=` | Calcular resultado |
| `Backspace` | Apagar o último caractere |
| `Esc` ou `C` | Limpar a operação atual |

---

⭐ Se você gostou do projeto, deixe uma estrela no repositório!
