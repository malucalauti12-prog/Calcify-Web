@echo off
title Calcify - Make numbers simple.
echo ========================================================
echo  Iniciando Calcify - Calculadora Moderna em Python
echo ========================================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python nao foi encontrado no seu PATH do Windows!
    echo Por favor, instale o Python em https://www.python.org/downloads/
    echo Lembre-se de marcar a opcao "Add python.exe to PATH".
    echo.
    pause
    exit /b
)

python calcify.py
if %errorlevel% neq 0 (
    echo.
    echo Ocorreu um problema ao executar calcify.py.
    pause
)
