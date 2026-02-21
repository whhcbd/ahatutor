import requests
import zipfile
import os

API_URL = "http://3a092f40.r6.cpolar.cn/api/convert_pdf"
FILE_PATH = r"C:\Users\16244\MinerU\遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24\134d6102-906d-47c2-9c93-422cc9ae538a_origin.pdf"
OUTPUT_DIR = r"C:\trae_coding\newfile"

os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Start uploading...")

try:
    with open(FILE_PATH, "rb") as f:
        response = requests.post(API_URL, files={"file": f}, timeout=600)
    
    if response.status_code == 200:
        zip_path = os.path.join(OUTPUT_DIR, "result.zip")
        with open(zip_path, "wb") as f_out:
            f_out.write(response.content)
        print("Success! Saved to", zip_path)
        
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(OUTPUT_DIR)
        print("Extracted to", OUTPUT_DIR)
    else:
        print("Failed. Status:", response.status_code)
        print("Error:", response.text)

except Exception as e:
    print("Error:", str(e))
    import traceback
    traceback.print_exc()
