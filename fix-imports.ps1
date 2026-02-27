# 批量替换导入路径脚本
$backendDir = "c:\trae_coding\AhaTutor\src\backend\src"

# 查找所有 TypeScript 文件
$files = Get-ChildItem -Path $backendDir -Filter "*.ts" -Recurse

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # 替换 @shared/types/* 为 @ahatutor/shared/types/*
    $newContent = $content -replace "from '@shared/types/", "from '@ahatutor/shared/types/"
    
    # 如果内容有变化，写回文件
    if ($newContent -ne $content) {
        Set-Content $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($file.FullName)"
        $count++
    }
}

Write-Host "`nTotal files updated: $count"
