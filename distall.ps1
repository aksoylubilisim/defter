# Defter Project - Global Build and Versioning Script

# Get current version from kernel
$kernelPath = "kernel/package.json"
if (-not (Test-Path $kernelPath)) {
    Write-Error "Could not find kernel/package.json. Please run from project root."
    exit 1
}

$kernelJson = Get-Content $kernelPath | ConvertFrom-Json
$currentVersion = $kernelJson.version

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Defter Build & Versioning Manager" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Mevcut Versiyon: " -NoNewline
Write-Host $currentVersion -ForegroundColor Yellow

# Prompt for bump
Write-Host "`nVersiyonu artırmak ister misiniz?"
Write-Host "[j] Major  (1.0.0 -> 2.0.0)"
Write-Host "[m] Minor  (1.0.0 -> 1.1.0)"
Write-Host "[p] Patch  (1.0.0 -> 1.0.1)"
Write-Host "[s] Skip   (Versiyonu değiştirme - Enter)"
$choice = Read-Host "`nSeçiminiz"

# Calculate new version
$v = $currentVersion -split '\.'
if ($v.Count -ne 3) {
    Write-Error "Geçersiz versiyon formatı: $currentVersion"
    exit 1
}

$major = [int]$v[0]
$minor = [int]$v[1]
$patch = [int]$v[2]

$bumped = $true
if ($choice -eq 'j') {
    $major++
    $minor = 0
    $patch = 0
} elseif ($choice -eq 'm') {
    $minor++
    $patch = 0
} elseif ($choice -eq 'p') {
    $patch++
} else {
    $bumped = $false
}

$newVersion = "$major.$minor.$patch"

if ($bumped) {
    Write-Host "`nYeni Versiyon: " -NoNewline
    Write-Host $newVersion -ForegroundColor Green
    
    # Update all projects
    $projects = @("kernel", "admin", "client", "web")
    foreach ($p in $projects) {
        $path = "$p/package.json"
        if (Test-Path $path) {
            $json = Get-Content $path -Raw | ConvertFrom-Json
            $json.version = $newVersion
            $json | ConvertTo-Json -Depth 10 | Set-Content $path -Encoding UTF8
            Write-Host "Updated $p to $newVersion" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "`nVersiyon değişikliği yapılmadı." -ForegroundColor Gray
    $newVersion = $currentVersion
}

# Build Process
Write-Host "`n----------------------------------------" -ForegroundColor Cyan
Write-Host "  Build işlemi başlatılıyor..." -ForegroundColor Cyan
Write-Host "----------------------------------------`n" -ForegroundColor Cyan

$projects = @("kernel", "admin", "client", "web")
foreach ($p in $projects) {
    Write-Host ">>> [$p] işleniyor..." -ForegroundColor DarkCyan
    if (Test-Path $p) {
        if ($p -eq "kernel") {
            # For kernel, we just copy files to dist since it's now plain JS
            $dest = "dist/kernel"
            if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force | Out-Null }
            Copy-Item -Path "$p/*.js", "$p/*.json", "$p/.env" -Destination $dest -Force -ErrorAction SilentlyContinue
            Copy-Item -Path "$p/models", "$p/routes", "$p/controllers" -Destination $dest -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host ">>> [$p] dosyaları dist klasörüne kopyalandı." -ForegroundColor Gray
        } else {
            Push-Location $p
            cmd /c "yarn build"
            if ($LASTEXITCODE -ne 0) {
                Write-Host "!!! [$p] build hatası!" -ForegroundColor Red
                Pop-Location
                exit 1
            }
            Pop-Location
        }
    } else {
        Write-Host "!!! [$p] klasörü bulunamadı, atlanıyor." -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Tüm build işlemleri başarıyla tamamlandı!" -ForegroundColor Green
Write-Host "  Versiyon: $newVersion" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green
