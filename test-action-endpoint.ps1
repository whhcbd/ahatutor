# Test User Action Endpoint

Write-Host "Testing User Action Endpoint..." -ForegroundColor Yellow

try {
    $body = @{
        type = "click"
        componentId = "test_component"
        action = "test_action"
        data = @{ testValue = "123" }
        messageId = "test_message_123"
        timestamp = (Get-Date).Ticks
    } | ConvertTo-Json

    Write-Host "Request Body: $body" -ForegroundColor Cyan

    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/agent/action" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing

    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorResponse = $reader.ReadToEnd()
        Write-Host "Error Response: $errorResponse" -ForegroundColor Red
    }
}
