# backend/test-signup.ps1
Write-Host "BitVote Signup Test" -ForegroundColor Cyan
Write-Host ""

# Generate unique email with timestamp
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$random = Get-Random -Minimum 100 -Maximum 999
$email = "voter${timestamp}${random}@test.com"
$password = "Test123456"

Write-Host "Email: $email" -ForegroundColor Yellow

# Sign Up
Write-Host ""
Write-Host "1. Attempting signup..." -ForegroundColor Cyan
try {
    $body = @{
        email = $email
        password = $password
        firstName = "John"
        lastName = "Doe"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "   SUCCESS: Signup successful!" -ForegroundColor Green
    Write-Host "   User ID: $($response.user.id)" -ForegroundColor Gray
    
    # Now try to sign in
    Write-Host ""
    Write-Host "2. Attempting signin..." -ForegroundColor Cyan
    $signinBody = @{
        email = $email
        password = $password
    } | ConvertTo-Json
    
    $signinResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signin" `
        -Method POST `
        -ContentType "application/json" `
        -Body $signinBody
    
    Write-Host "   SUCCESS: Signin successful!" -ForegroundColor Green
    Write-Host "   Welcome, $($signinResponse.user.user_metadata.first_name)!" -ForegroundColor Gray
    
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test complete!" -ForegroundColor Cyan