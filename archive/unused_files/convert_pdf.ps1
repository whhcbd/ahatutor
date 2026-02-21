# 设置变量
$apiUrl = "http://3a092f40.r6.cpolar.cn/api/convert_pdf"
$pdfPath = "C:\Users\16244\MinerU\遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24\134d6102-906d-47c2-9c93-422cc9ae538a_origin.pdf"
$outputZip = "C:\trae_coding\result.zip"
$outputDir = "C:\trae_coding\newfile"

# 确保输出目录存在
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

Write-Host "🚀 开始 PDF 转换流程..."
Write-Host "📄 PDF 文件路径: $pdfPath"
Write-Host "📁 输出目录: $outputDir"
Write-Host "🔗 API 接口: $apiUrl"

# 检查 PDF 文件是否存在
if (-not (Test-Path $pdfPath)) {
    Write-Host "❌ 错误: PDF 文件不存在！" -ForegroundColor Red
    exit 1
} else {
    $fileSize = (Get-Item $pdfPath).Length / 1MB
    Write-Host "✅ PDF 文件存在，大小: $fileSize.ToString('0.00') MB" -ForegroundColor Green
}

try {
    Write-Host "📤 正在上传文件..." -ForegroundColor Yellow
    
    # 创建 multipart/form-data 请求
    $form = @{
        file = Get-Item $pdfPath
    }
    
    # 发送请求
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Form $form -TimeoutSec 3600
    
    # 保存响应
    $response | Out-File -FilePath $outputZip -Encoding Byte
    
    Write-Host "✅ 解析成功！结果已保存至 $outputZip" -ForegroundColor Green
    
    # 解压文件
    Write-Host "🔄 正在解压文件..." -ForegroundColor Yellow
    Expand-Archive -Path $outputZip -DestinationPath $outputDir -Force
    
    Write-Host "✅ 解压完成！" -ForegroundColor Green
    
    # 删除临时 zip 文件
    Remove-Item $outputZip -Force
    
    # 显示输出目录中的文件
    Write-Host "📁 输出目录文件列表:" -ForegroundColor Cyan
    Get-ChildItem -Path $outputDir -Recurse | ForEach-Object {
        $indent = "  " * ($_.FullName.Replace($outputDir, "").Split("\\").Count - 1)
        if ($_.PSIsContainer) {
            Write-Host "$indent📁 $($_.Name)" -ForegroundColor Blue
        } else {
            $fileSize = $_.Length / 1KB
            Write-Host "$indent📄 $($_.Name) ($($fileSize.ToString('0.00')) KB)" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "⚠️ 请求发生异常: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "\n转换流程完成！" -ForegroundColor Green
