try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/agent/visualize/tools" -Method GET -ContentType "application/json" -TimeoutSec 10
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response:"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
}
