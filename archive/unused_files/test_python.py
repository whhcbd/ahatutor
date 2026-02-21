import os
import sys

print(f"Python 版本: {sys.version}")
print(f"当前目录: {os.getcwd()}")

# 测试文件路径
pdf_path = r"C:\Users\16244\MinerU\遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24\134d6102-906d-47c2-9c93-422cc9ae538a_origin.pdf"

print(f"\n检查 PDF 文件路径: {pdf_path}")
if os.path.exists(pdf_path):
    print(f"✅ PDF 文件存在")
    print(f"文件大小: {os.path.getsize(pdf_path) / 1024 / 1024:.2f} MB")
else:
    print(f"❌ PDF 文件不存在")

# 测试输出目录
output_dir = r"C:\trae_coding\newfile"
os.makedirs(output_dir, exist_ok=True)
print(f"\n输出目录: {output_dir}")
print(f"目录存在: {os.path.exists(output_dir)}")

print("\n测试完成！")
