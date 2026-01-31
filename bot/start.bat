@echo off
title FROM PROMPT TO RESULT - Telegram Bot Launcher
color 0A
mode con: cols=80 lines=25

echo ========================================
echo    FROM PROMPT TO RESULT - Telegram Bot
echo ========================================
echo.

echo Шаг 1: Проверяю текущую папку...
cd /d "%~dp0"
echo Текущая папка: %cd%
echo.

echo Шаг 2: Проверяю Node.js...
node --version
if errorlevel 1 (
    echo.
    echo ОШИБКА: Node.js не установлен или не найден!
    echo 1. Скачайте Node.js с https://nodejs.org/
    echo 2. Установите его
    echo 3. Перезагрузите компьютер
    echo.
    pause
    exit /b 1
)

echo Шаг 3: Устанавливаю зависимости...
call npm install
if errorlevel 1 (
    echo.
    echo ОШИБКА: Не удалось установить зависимости!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ВСЕ ПРЕДВАРИТЕЛЬНЫЕ ПРОВЕРКИ ПРОЙДЕНЫ
echo    ЗАПУСКАЮ БОТА...
echo ========================================
echo.
echo Окно НЕ закрывайте!
echo Если будет ошибка - она появится здесь.
echo.
echo Для остановки бота нажмите Ctrl+C
echo ========================================
echo.

node index.js

if errorlevel 1 (
    echo.
    echo ========================================
    echo    БОТ ЗАКРЫЛСЯ С ОШИБКОЙ!
    echo ========================================
    echo.
)

pause