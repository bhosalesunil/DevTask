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

:: 2. Check and Configure Git User Identity (Name & Email)
git config user.name >nul 2>&1
set "NAME_STATUS=%errorlevel%"
git config user.email >nul 2>&1
set "EMAIL_STATUS=%errorlevel%"

if %NAME_STATUS% neq 0 (
    echo [SETUP] Git user name is not set.
    set /p git_user_name="Enter your Name (Press Enter for 'Sunil Bhosale'): "
    if "!git_user_name!"=="" set "git_user_name=Sunil Bhosale"
    git config --global user.name "!git_user_name!"
    echo [SUCCESS] Git user.name set to: !git_user_name!
    echo.
)

if %EMAIL_STATUS% neq 0 (
    echo [SETUP] Git user email is not set.
    set /p git_user_email="Enter your Email (Press Enter for 'bhosalesunil@users.noreply.github.com'): "
    if "!git_user_email!"=="" set "git_user_email=bhosalesunil@users.noreply.github.com"
    git config --global user.email "!git_user_email!"
    echo [SUCCESS] Git user.email set to: !git_user_email!
    echo.
)

:: 3. Initialize Git repo if not already initialized
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

:: Ensure default branch name is main
git branch -M main >nul 2>&1

:: 4. Show status of modified/new files
echo [INFO] Checking file changes...
git status --short
echo.

:: 5. Prompt for commit message
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

:: Check if HEAD commit exists
git rev-parse --verify HEAD >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] No commits exist in this repository to push!
    echo Please verify your git configuration.
    echo.
    pause
    exit /b 1
)

:: 6. Push to GitHub
echo.
echo [INFO] Pushing to GitHub (main)...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ===================================================
    echo  [SUCCESS] Code successfully pushed to GitHub!
    echo  Repository: https://github.com/bhosalesunil/DevTask
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo  [WARNING] Push failed.
    echo  This usually happens if the remote repository has
    echo  commits that you do not have locally (e.g. README/License).
    echo ===================================================
    echo.
    echo Options:
    echo  [1] Pull remote changes and merge (Recommended)
    echo  [2] Force push (Overwrites remote with your local code)
    echo  [3] Exit
    echo.
    set /p choice="Select an option (1, 2, or 3): "
    
    if "!choice!"=="1" (
        echo.
        echo [INFO] Pulling remote changes with rebase...
        git pull origin main --rebase --allow-unrelated-histories
        echo [INFO] Retrying push...
        git push -u origin main
        if !errorlevel! equ 0 (
            echo.
            echo [SUCCESS] Push completed successfully!
        ) else (
            echo.
            echo [ERROR] Push failed. If there are merge conflicts, please resolve them.
        )
    ) else if "!choice!"=="2" (
        echo.
        echo [INFO] Force pushing to main...
        git push -u origin main --force
        if !errorlevel! equ 0 (
            echo.
            echo [SUCCESS] Force push completed successfully!
        ) else (
            echo.
            echo [ERROR] Force push failed. Please check your GitHub permissions.
        )
    )
)

echo.
pause
