@echo off
setlocal enabledelayedexpansion
title DevTask - One-Click GitHub Push

:: Change directory to the folder containing this batch script
cd /d "%~dp0"

:: If devtask subfolder exists and we are in root folder, navigate into devtask
if exist "devtask\package.json" (
    cd /d "%~dp0devtask"
)

echo ===================================================
echo           DevTask - One-Click Git Push
echo ===================================================
echo Remote Repository: https://github.com/bhosalesunil/DevTask.git
echo Current Directory: %CD%
echo ===================================================
echo.

:: 1. Check if Git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not found in system PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Initialize Git repo if not already initialized
if not exist ".git" (
    echo [INFO] Git repository not found. Initializing...
    git init
    git branch -M main
    git remote add origin https://github.com/bhosalesunil/DevTask.git
    echo [SUCCESS] Git repository initialized and remote origin set.
    echo.
) else (
    :: Ensure remote origin is set to the correct URL
    git remote get-url origin >nul 2>&1
    if %errorlevel% neq 0 (
        echo [INFO] Setting remote origin...
        git remote add origin https://github.com/bhosalesunil/DevTask.git
    ) else (
        git remote set-url origin https://github.com/bhosalesunil/DevTask.git
    )
)

:: 3. Show status of modified/new files
echo [INFO] Checking file changes...
git status --short
echo.

:: 4. Prompt for commit message
set "commit_msg="
set /p commit_msg="Enter commit message (Press ENTER for auto timestamp): "

if "%commit_msg%"=="" (
    set "commit_msg=Update: %date% %time%"
)

echo.
echo [INFO] Staging all files (git add .)...
git add .

echo [INFO] Committing changes...
git commit -m "%commit_msg%"

if %errorlevel% neq 0 (
    echo [NOTE] No new changes to commit.
)

:: 5. Get current branch name (default to main)
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set "CURRENT_BRANCH=%%i"
if "%CURRENT_BRANCH%"=="" set "CURRENT_BRANCH=main"

echo.
echo [INFO] Pushing to GitHub (%CURRENT_BRANCH%)...
git push -u origin %CURRENT_BRANCH%

if %errorlevel% equ 0 (
    echo.
    echo ===================================================
    echo  [SUCCESS] Code successfully pushed to GitHub!
    echo  Repository: https://github.com/bhosalesunil/DevTask
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo  [WARNING] Push failed or remote has newer changes.
    echo ===================================================
    echo.
    set /p retry_pull="Do you want to pull with rebase and retry push? (Y/N): "
    if /i "!retry_pull!"=="Y" (
        echo.
        echo [INFO] Pulling latest changes from remote...
        git pull --rebase origin %CURRENT_BRANCH%
        echo [INFO] Retrying push...
        git push -u origin %CURRENT_BRANCH%
        if !errorlevel! equ 0 (
            echo.
            echo [SUCCESS] Push completed successfully!
        ) else (
            echo.
            echo [ERROR] Push failed. Please verify your internet connection or GitHub login.
        )
    )
)

echo.
pause
