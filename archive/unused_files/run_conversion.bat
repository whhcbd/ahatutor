@echo off

:: 切换到包含 PDF 文件的目录
cd "C:\Users\16244\MinerU\遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24"

echo 当前目录: %cd%
echo 列出目录中的文件:
dir

:: 暂停以便查看文件列表
echo.
echo 按任意键继续...
pause

:: 运行 Python 转换脚本
python "c:\trae_coding\simple_example.py"

pause
