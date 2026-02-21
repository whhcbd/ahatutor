import os
FILE_PATH = r"C:\Users\16244\MinerU\遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24\134d6102-906d-47c2-9c93-422cc9ae538a_origin.pdf"
print(f"File exists: {os.path.exists(FILE_PATH)}")
if os.path.exists(FILE_PATH):
    print(f"File size: {os.path.getsize(FILE_PATH)} bytes")
else:
    print("File not found!")
    mineru_dir = r"C:\Users\16244\MinerU"
    if os.path.exists(mineru_dir):
        print("MinerU directory contents:")
        for item in os.listdir(mineru_dir):
            print(f"  {item}")
