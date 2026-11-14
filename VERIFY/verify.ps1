$ErrorActionPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path -LiteralPath (Join-Path $root 'index.html'))) {
    Write-Host ''
    Write-Host '  找不到仓库根目录。' -ForegroundColor Yellow
    Write-Host '  请把 VERIFY 文件夹整个放进仓库根目录（与 index.html 同级），再运行本脚本。'
    Write-Host ''
    exit 1
}

$expected = [ordered]@{
    'index.html'             = 'a0470286da6f650e9527c127df057de9bd31cfddd92aec77f69dd8a696c705e8'
    'assets/css/style.css'   = 'fbe4b5366582dd69f5438685035cdddaf2988ba79977e353f7056e9079539168'
    'assets/js/main.js'      = 'e0557338537d44f34853e255823fb6790c01db857115530634440dc2a62324cc'
    'assets/js/i18n.js'      = '276b090c16d9c7d51f255c8171d63bc8918b872c55d92881c08597966d9444ab'
    'data/machinery.json'    = '60e58f555cfe2ecbc91551fdd35b6c34d2d3f310c1663046fe91e80528549a71'
    'data/porcelain.json'    = '43282e2151f092f8891ca224eb9d47d4ce92d11e3185e664774cd13b61417134'
    'data/products.json'     = 'bb28dee254c5e429838215a8c11edd1bfb07fa31b8f5628266db10540cfe5758'
    'data/site.json'         = 'c1af4869e67dbfe81654dc87aa6f00ebec8e32521a8ca17661c7df88621d402d'
}

Write-Host ''
Write-Host '  昭盛元官网 最终版 V3.1 - 文件完整性校验' -ForegroundColor Cyan
Write-Host '  仓库根目录：' $root
Write-Host '  ------------------------------------------------------------'

$bad = 0
foreach ($f in $expected.Keys) {
    $p = Join-Path $root $f
    if (-not (Test-Path -LiteralPath $p)) {
        Write-Host '  [缺失]    ' $f -ForegroundColor Red
        $bad++
        continue
    }
    $actual = (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLower()
    if ($actual -eq $expected[$f]) {
        Write-Host '  [OK]      ' $f -ForegroundColor Green
    } else {
        Write-Host '  [不一致]  ' $f -ForegroundColor Red
        Write-Host '             期望：' $expected[$f]
        Write-Host '             实际：' $actual
        $bad++
    }
}

Write-Host '  ------------------------------------------------------------'
if ($bad -eq 0) {
    Write-Host '  全部一致（8/8）：仓库就是最终版，可以放心 commit + push。' -ForegroundColor Green
} else {
    Write-Host ('  有 {0} 个文件不是最终版 —— 页面会出现半加载。' -f $bad) -ForegroundColor Red
    Write-Host '  修复：把 Zhaoshengyuan-Site 里的【全部文件】复制进仓库根目录，选择覆盖，再运行本脚本。'
    Write-Host '  注意：不要只覆盖报错的那几个文件，也不要在合并冲突框里选带 origin/main 前缀的选项。'
}
Write-Host ''
