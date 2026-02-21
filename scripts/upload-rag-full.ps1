$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🚀 开始上传遗传学教材到RAG知识库..." -ForegroundColor Green

$DOCUMENT_PATH = "C:\Users\16244\MinerU\遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24\full.md"
$API_URL = "http://localhost:3001/api/rag/documents"

if (-not (Test-Path $DOCUMENT_PATH)) {
    Write-Host "❌ File not found: $DOCUMENT_PATH" -ForegroundColor Red
    exit 1
}

$content = [System.IO.File]::ReadAllText($DOCUMENT_PATH, [System.Text.Encoding]::UTF8)
$stats = Get-Item $DOCUMENT_PATH
Write-Host "📄 File size: $([math]::Round($stats.Length / 1MB, 2)) MB" -ForegroundColor Cyan

$body = @{
    name = "Genetics Textbook 4th Edition"
    type = "text"
    content = $content
    metadata = @{
        title = "Genetics Textbook 4th Edition"
        author = "Liu Zudong, Wu Yanhua, Qiao Shouyi, Zhao Shouyuan"
        publisher = "Higher Education Press"
        year = "2021"
        source = "MinerU"
        type = "textbook"
        topics = @("genetics", "biology", "textbook")
        originalPath = $DOCUMENT_PATH
    }
} | ConvertTo-Json -Depth 10 -Compress

Write-Host "📤 Uploading to API..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $API_URL -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 300

    if ($response.StatusCode -eq 201) {
        $result = $response.Content | ConvertFrom-Json

        Write-Host "`n✅ Upload successful!" -ForegroundColor Green
        Write-Host "   Document ID: $($result.id)" -ForegroundColor White
        Write-Host "   Name: $($result.name)" -ForegroundColor White
        Write-Host "   Status: $($result.status)" -ForegroundColor White
        Write-Host "   Chunk Count: $($result.chunkCount)" -ForegroundColor White
        Write-Host "   Processed At: $($result.processedAt)" -ForegroundColor White

        Write-Host "`n📊 View knowledge base stats:" -ForegroundColor Cyan
        Write-Host "   GET http://localhost:3001/api/rag/stats" -ForegroundColor Gray
    } else {
        Write-Host "❌ Upload failed: HTTP $($response.StatusCode)" -ForegroundColor Red
        Write-Host $response.Content -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
    exit 1
}
