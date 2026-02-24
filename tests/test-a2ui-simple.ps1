# A2UI Function Test Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "A2UI Function Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$API_BASE = "http://localhost:3001"

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = $null
    )
    
    Write-Host "`nTest: $Name" -ForegroundColor Yellow
    
    try {
        if ($Method -eq "POST") {
            $response = Invoke-WebRequest -Uri $Url -Method POST -ContentType "application/json" -Body $Body
        } else {
            $response = Invoke-WebRequest -Uri $Url -Method GET
        }
        
        $data = $response.Content | ConvertFrom-Json
        
        Write-Host "Success" -ForegroundColor Green
        Write-Host "Status Code: $($response.StatusCode)"
        
        return @{
            Success = $true
            Data = $data
            StatusCode = $response.StatusCode
        }
    }
    catch {
        Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
        
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Test 1: A2UI Visual Design Endpoint
Write-Host "`n----------------------------------------" -ForegroundColor Gray
Write-Host "Test 1: A2UI Visual Design Endpoint" -ForegroundColor Gray
Write-Host "----------------------------------------" -ForegroundColor Gray

$result1 = Test-Endpoint -Name "A2UI Visual Design" -Url "$API_BASE/agent/visual-design" -Method POST -Body '{"question":"Okazaki fragments"}'

if ($result1.Success) {
    Write-Host "Response Data:"
    $result1.Data | ConvertTo-Json -Depth 3 | Out-Host
    
    if ($result1.Data.a2uiTemplate) {
        Write-Host "`nFound A2UI Template" -ForegroundColor Green
        
        $hasSurface = $null -ne $result1.Data.a2uiTemplate.surface
        $hasDataModel = $null -ne $result1.Data.a2uiTemplate.dataModel
        
        Write-Host "  - Surface exists: $hasSurface" -ForegroundColor $(if ($hasSurface) { "Green" } else { "Red" })
        Write-Host "  - DataModel exists: $hasDataModel" -ForegroundColor $(if ($hasDataModel) { "Green" } else { "Red" })
        
        if ($hasSurface -and $hasDataModel) {
            Write-Host "`nP0-2: Surface/DataModel separation is working" -ForegroundColor Green
        } else {
            Write-Host "`nP0-2: Surface/DataModel separation failed" -ForegroundColor Red
        }
    } else {
        Write-Host "`nA2UI Template not found" -ForegroundColor Red
    }
}

# Test 2: User Action Endpoint
Write-Host "`n----------------------------------------" -ForegroundColor Gray
Write-Host "Test 2: User Action Endpoint" -ForegroundColor Gray
Write-Host "----------------------------------------" -ForegroundColor Gray

$result2 = Test-Endpoint -Name "User Action API" -Url "$API_BASE/agent/action" -Method POST -Body '{"type":"click","componentId":"test","action":"test"}'

if ($result2.Success) {
    Write-Host "`nP0-3: User interaction API is working" -ForegroundColor Green
} else {
    Write-Host "`nP0-3: User interaction API failed" -ForegroundColor Red
}

# Test 3: Template Matching
Write-Host "`n----------------------------------------" -ForegroundColor Gray
Write-Host "Test 3: Template Matching" -ForegroundColor Gray
Write-Host "----------------------------------------" -ForegroundColor Gray

$testQuestions = @(
    '{"question":"Okazaki fragments"}',
    '{"question":"Hemophilia pedigree chart"}',
    '{"question":"DNA replication process"}'
)

foreach ($questionJson in $testQuestions) {
    $question = ($questionJson | ConvertFrom-Json).question
    Write-Host "`nQuestion: $question"
    $result = Test-Endpoint -Name "Template Matching" -Url "$API_BASE/agent/visual-design" -Method POST -Body $questionJson
    
    if ($result.Success) {
        if ($result.Data.templateId) {
            Write-Host "  Matched template: $($result.Data.templateId)" -ForegroundColor Green
        } else {
            Write-Host "  No template matched" -ForegroundColor Yellow
        }
    }
}

# Test Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
