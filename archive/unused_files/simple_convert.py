import requests
import os
import zipfile

# 接口地址
API_URL = "http://3a092f40.r6.cpolar.cn/api/convert_pdf"
# 本地需要转换的 PDF 文件路径（使用原始字符串）
FILE_PATH = r"C:\Users\16244\MinerU\遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24\134d6102-906d-47c2-9c93-422cc9ae538a_origin.pdf"
# 输出目录
OUTPUT_DIR = r"C:\trae_coding\newfile"

print("Starting PDF conversion...")
print(f"PDF file: {FILE_PATH}")
print(f"Output directory: {OUTPUT_DIR}")
print(f"API URL: {API_URL}")

# 确保输出目录存在
os.makedirs(OUTPUT_DIR, exist_ok=True)
print("Output directory created")

# 检查文件是否存在
if not os.path.exists(FILE_PATH):
    print(f"ERROR: File not found: {FILE_PATH}")
    exit(1)
else:
    print(f"File found, size: {os.path.getsize(FILE_PATH) / 1024 / 1024:.2f} MB")

try:
    print("Uploading file...")
    with open(FILE_PATH, "rb") as f:
        response = requests.post(API_URL, files={"file": f}, timeout=3600)
    
    print(f"Response status: {response.status_code}")
    
    if response.status_code == 200:
        zip_path = os.path.join(OUTPUT_DIR, "result.zip")
        with open(zip_path, "wb") as f:
            f.write(response.content)
        print(f"Received ZIP file: {zip_path}")
        
        # 解压
        print("Extracting ZIP...")
        with zipfile.ZipFile(zip_path, "r") as zf:
            zf.extractall(OUTPUT_DIR)
        print("Extraction completed")
        
        # 删除 ZIP 文件
        os.remove(zip_path)
        print("ZIP file removed")
        
        # 列出文件
        print("Files in output directory:")
        for root, dirs, files in os.walk(OUTPUT_DIR):
            level = root.replace(OUTPUT_DIR, "").count(os.sep)
            indent = " " * 2 * level
            print(f"{indent}{os.path.basename(root)}/")
            for file in files:
                print(f"{indent}  {file}")
                
    else:
        print(f"Error: {response.status_code}")
        try:
            print(f"Error message: {response.json()}")
        except:
            print(f"Error content: {response.text}")
            
except Exception as e:
    print(f"Exception: {e}")
    import traceback
    traceback.print_exc()

print("Done!")
