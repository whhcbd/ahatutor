# Test Available API Endpoints

Write-Host "Testing Available API Endpoints..." -ForegroundColor Yellow

$endpoints = @(
    @{ Name = "Health Check"; Url = "http://localhost:3001/api/agent/quick" },
    @{ Name = "Visualize Ask"; Url = "http://localhost:3001/api/agent/visualize/ask" },
    @{ Name = "Action Endpoint"; Url = "http://localhost:3001/api/agent/action" },
    @{ Name = "SSE Endpoint"; Url = "http://localhost:3001/api/agent/visualize/ask/stream" }
)

foreach ($endpoint in $endpoints) {
    Write-Host "`nTesting: $($endpoint.Name)" -ForegroundColor Cyan
    Write-Host "URL: $($endpoint.Url)" -ForegroundColor Gray
    
    try {
        if ($endpoint.Name -eq "Visualize Ask") {
            $body = '{"concept":"test","question":"test"}' | ConvertTo-Json
            $response = Invoke-WebRequest -Uri $endpoint.Url -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
        } elseif ($endpoint.Name -eq "Action Endpoint") {
            $body = '{"type":"click","componentId":"test","action":"test","timestamp":123}' | ConvertTo-Json
            $response = Invoke-WebRequest -Uri $endpoint.Url -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
        } else {
            $response = Invoke-WebRequest -Uri $endpoint.Url -Method GET -UseBasicParsing
        }
        
        Write-Host "Success - Status: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed - Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
