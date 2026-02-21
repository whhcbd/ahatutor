import os

# 搜索目录
search_dir = r"C:\Users\16244\MinerU"

print(f"Searching for PDF files in: {search_dir}")
print("=" * 80)

# 递归搜索 PDF 文件
pdf_files = []
for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.lower().endswith('.pdf'):
            pdf_path = os.path.join(root, file)
            pdf_files.append(pdf_path)
            print(f"Found PDF: {pdf_path}")

print("=" * 80)
print(f"Total PDF files found: {len(pdf_files)}")

if pdf_files:
    print("\nFirst PDF file:")
    print(pdf_files[0])
    
    # 将第一个 PDF 文件路径保存到文件
    with open(r"c:\trae_coding\pdf_path.txt", "w", encoding="utf-8") as f:
        f.write(pdf_files[0])
    print("\nPDF path saved to: c:\trae_coding\pdf_path.txt")
else:
    print("No PDF files found!")
