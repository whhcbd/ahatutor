# 设置变量
$apiUrl = "http://3a092f40.r6.cpolar.cn/api/convert_pdf"
$pdfPath = "C:\Users\16244\MinerU\遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24\134d6102-906d-47c2-9c93-422cc9ae538a_origin.pdf"
$outputZip = "C:\trae_coding\result.zip"
$outputDir = "C:\trae_coding\newfile"

# 确保输出目录存在
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

Write-Host "Starting PDF conversion..."
Write-Host "PDF file: $pdfPath"
Write-Host "Output directory: $outputDir"
Write-Host "API URL: $apiUrl"

# 检查 PDF 文件是否存在
if (-not (Test-Path $pdfPath)) {
    Write-Host "ERROR: PDF file not found!" -ForegroundColor Red
    exit 1
} else {
    $fileSize = (Get-Item $pdfPath).Length / 1MB
    Write-Host "PDF file exists, size: $fileSize.ToString('0.00') MB" -ForegroundColor Green
}

try {
    Write-Host "Uploading file..." -ForegroundColor Yellow
    
    # 创建 WebClient 对象
    $webClient = New-Object System.Net.WebClient
    
    # 创建 multipart/form-data 请求
    $boundary = [System.Guid]::NewGuid().ToString()
    $webClient.Headers.Add("Content-Type", "multipart/form-data; boundary=$boundary")
    
    # 构建请求体
    $fileBytes = [System.IO.File]::ReadAllBytes($pdfPath)
    $fileName = [System.IO.Path]::GetFileName($pdfPath)
    
    $body = ""
    $body += "--$boundary`r`n"
    $body += "Content-Disposition: form-data; name=""file""; filename=""$fileName""`r`n"
    $body += "Content-Type: application/pdf`r`n`r`n"
    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
    
    $endBoundaryBytes = [System.Text.Encoding]::UTF8.GetBytes("`r`n--$boundary--`r`n")
    
    # 合并字节数组
    $fullBody = New-Object System.Collections.Generic.List[System.Byte]
    $fullBody.AddRange($bodyBytes)
    $fullBody.AddRange($fileBytes)
    $fullBody.AddRange($endBoundaryBytes)
    
    # 发送请求
    $responseBytes = $webClient.UploadData($apiUrl, "POST", $fullBody.ToArray())
    
    # 保存响应
    [System.IO.File]::WriteAllBytes($outputZip, $responseBytes)
    
    Write-Host "Conversion successful! Result saved to $outputZip" -ForegroundColor Green
    
    # 解压文件
    Write-Host "Extracting files..." -ForegroundColor Yellow
    Expand-Archive -Path $outputZip -DestinationPath $outputDir -Force
    
    Write-Host "Extraction completed!" -ForegroundColor Green
    
    # 删除临时 zip 文件
    Remove-Item $outputZip -Force
    
    # 显示输出目录中的文件
    Write-Host "Files in output directory:" -ForegroundColor Cyan
    Get-ChildItem -Path $outputDir -Recurse | ForEach-Object {
        $indent = "  " * ($_.FullName.Replace($outputDir, "").Split("\\").Count - 1)
        if ($_.PSIsContainer) {
            Write-Host "${indent}DIR: $($_.Name)" -ForegroundColor Blue
        } else {
            $fileSize = $_.Length / 1KB
            Write-Host "${indent}FILE: $($_.Name) ($($fileSize.ToString('0.00')) KB)" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Conversion process completed!" -ForegroundColor Green
