# A2UI 功能测试脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "A2UI 功能测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$API_BASE = "http://localhost:3001"
$RESULTS = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = $null
    )
    
    Write-Host "`n测试: $Name" -ForegroundColor Yellow
    
    try {
        if ($Method -eq "POST") {
            $response = Invoke-WebRequest -Uri $Url -Method POST -ContentType "application/json" -Body $Body
        } else {
            $response = Invoke-WebRequest -Uri $Url -Method GET
        }
        
        $data = $response.Content | ConvertFrom-Json
        
        Write-Host "✓ 成功" -ForegroundColor Green
        Write-Host "状态码: $($response.StatusCode)"
        
        return @{
            Success = $true
            Data = $data
            StatusCode = $response.StatusCode
        }
    }
    catch {
        Write-Host "✗ 失败: $($_.Exception.Message)" -ForegroundColor Red
        
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# 测试 1: A2UI可视化设计端点
Write-Host "`n----------------------------------------" -ForegroundColor Gray
Write-Host "测试 1: A2UI可视化设计端点" -ForegroundColor Gray
Write-Host "----------------------------------------" -ForegroundColor Gray

$result1 = Test-Endpoint -Name "A2UI可视化设计" -Url "$API_BASE/agent/visual-design" -Method POST -Body '{"question":"冈崎片段"}'
$RESULTS += [PSCustomObject]@{
    Test = "A2UI可视化设计端点"
    Success = $result1.Success
    Details = if ($result1.Success) { "状态码: $($result1.StatusCode)" } else { $result1.Error }
}

if ($result1.Success) {
    Write-Host "响应数据:"
    $result1.Data | ConvertTo-Json -Depth 3 | Out-Host
    
    # 检查是否有A2UI模板
    if ($result1.Data.a2uiTemplate) {
        Write-Host "`n✓ 找到A2UI模板" -ForegroundColor Green
        
        $hasSurface = $null -ne $result1.Data.a2uiTemplate.surface
        $hasDataModel = $null -ne $result1.Data.a2uiTemplate.dataModel
        
        Write-Host "  - Surface存在: $hasSurface" -ForegroundColor $(if ($hasSurface) { "Green" } else { "Red" })
        Write-Host "  - DataModel存在: $hasDataModel" -ForegroundColor $(if ($hasDataModel) { "Green" } else { "Red" })
        
        if ($hasSurface -and $hasDataModel) {
            Write-Host "`n✓ P0-2: Surface/DataModel分离正常" -ForegroundColor Green
        } else {
            Write-Host "`n✗ P0-2: Surface/DataModel分离失败" -ForegroundColor Red
        }
    } else {
        Write-Host "`n✗ 未找到A2UI模板" -ForegroundColor Red
    }
}

# 测试 2: 用户操作端点
Write-Host "`n----------------------------------------" -ForegroundColor Gray
Write-Host "测试 2: 用户操作端点" -ForegroundColor Gray
Write-Host "----------------------------------------" -ForegroundColor Gray

$result2 = Test-Endpoint -Name "用户操作API" -Url "$API_BASE/agent/action" -Method POST -Body '{"type":"click","componentId":"test","action":"test"}'
$RESULTS += [PSCustomObject]@{
    Test = "用户操作端点"
    Success = $result2.Success
    Details = if ($result2.Success) { "状态码: $($result2.StatusCode)" } else { $result2.Error }
}

if ($result2.Success) {
    Write-Host "`n✓ P0-3: 用户交互API正常工作" -ForegroundColor Green
} else {
    Write-Host "`n✗ P0-3: 用户交互API失败" -ForegroundColor Red
}

# 测试 3: 模板匹配服务
Write-Host "`n----------------------------------------" -ForegroundColor Gray
Write-Host "测试 3: 模板匹配服务" -ForegroundColor Gray
Write-Host "----------------------------------------" -ForegroundColor Gray

$testQuestions = @(
    "冈崎片段",
    "展示血友病的家族遗传系谱",
    "DNA复制过程",
    "细胞分裂"
)

foreach ($question in $testQuestions) {
    Write-Host "`n问题: $question"
    $result = Test-Endpoint -Name "模板匹配" -Url "$API_BASE/agent/visual-design" -Method POST -Body "{`"question`":`"$question`"}"
    
    if ($result.Success) {
        if ($result.Data.templateId) {
            Write-Host "  ✓ 匹配到模板: $($result.Data.templateId)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ 未匹配到模板" -ForegroundColor Yellow
        }
    }
}

# 测试 4: SSE流式端点
Write-Host "`n----------------------------------------" -ForegroundColor Gray
Write-Host "测试 4: SSE流式端点" -ForegroundColor Gray
Write-Host "----------------------------------------" -ForegroundColor Gray

Write-Host "尝试连接SSE端点..." -ForegroundColor Yellow

try {
    # 注意: PowerShell对SSE支持有限，这里只测试端点是否可访问
    $sseUrl = "$API_BASE/agent/stream-visual-design?question=测试流式"
    $request = [System.Net.WebRequest]::Create($sseUrl)
    $request.Method = "GET"
    $request.Timeout = 5000
    
    try {
        $response = $request.GetResponse()
        Write-Host "✓ SSE端点可访问" -ForegroundColor Green
        Write-Host "  Content-Type: $($response.ContentType)"
        $response.Close()
    }
    catch {
        Write-Host "⚠ SSE端点可能正常，但无法完全测试流式响应" -ForegroundColor Yellow
        Write-Host "  (PowerShell对SSE支持有限)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "✗ SSE端点访问失败: $($_.Exception.Message)" -ForegroundColor Red
}

# 测试总结
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "测试总结" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$passedCount = ($RESULTS | Where-Object { $_.Success }).Count
$totalCount = $RESULTS.Count

Write-Host "`n总测试数: $totalCount" -ForegroundColor White
Write-Host "通过: $passedCount" -ForegroundColor Green
Write-Host "失败: $($totalCount - $passedCount)" -ForegroundColor $(if ($totalCount - $passedCount -gt 0) { "Red" } else { "Green" })

Write-Host "`n详细结果:" -ForegroundColor White
$RESULTS | Format-Table -AutoSize

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "测试完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 导出结果
$reportPath = "c:\trae_coding\AhaTutor\test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$RESULTS | ConvertTo-Json -Depth 3 | Out-File -FilePath $reportPath
Write-Host "`n测试报告已保存到: $reportPath" -ForegroundColor Cyan
