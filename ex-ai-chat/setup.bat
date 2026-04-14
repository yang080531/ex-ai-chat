@echo off
echo ==========================================
echo 前任AI - 安卓APP打包环境配置
echo ==========================================
echo.

REM 检查Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Node.js，请先安装：https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] 检测到Node.js版本：
node --version
echo.

echo [2/5] 安装依赖...
call npm install
if errorlevel 1 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)
echo.

echo [3/5] 添加安卓平台...
call npx cap add android
if errorlevel 1 (
    echo [警告] 添加平台失败，可能已存在
)
echo.

echo [4/5] 同步项目...
call npx cap sync
echo.

echo [5/5] 完成！
echo.
echo 接下来：
echo 1. 运行 'npx cap open android' 打开Android Studio
echo 2. 在Android Studio中点击 Build -^> Build APK
echo.
echo 或者在浏览器测试：
echo   npx serve .
echo.
pause
