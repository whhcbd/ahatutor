@echo off

python -c "
import requests

# 接口地址
API_URL = 'http://3a092f40.r6.cpolar.cn/api/convert_pdf'
# 本地需要转换的 PDF 文件路径
FILE_PATH = 'C:\\Users\\16244\\MinerU\\遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24\\134d6102-906d-47c2-9c93-422cc9ae538a_origin.pdf'

print('🚀 正在上传文件并等待服务器 RTX 4090 解析，请稍候...')

try:
    with open(FILE_PATH, 'rb') as f:
        # 使用 files 参数上传文件
        response = requests.post(API_URL, files={'file': f})
        
    # 判断是否成功
    if response.status_code == 200:
        # 将返回的二进制流保存为 zip 文件
        zip_filename = 'result.zip'
        with open(zip_filename, 'wb') as f_out:
            f_out.write(response.content)
        print(f'✅ 解析成功！结果已保存至当前目录的 {zip_filename}')
    else:
        print(f'❌ 解析失败，状态码: {response.status_code}')
        print('错误信息:', response.json())

except Exception as e:
    print(f'⚠️ 请求发生异常: {e}')
"

pause
