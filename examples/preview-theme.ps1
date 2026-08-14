#Requires -Version 7.0
<#
.SYNOPSIS
  PowerShell sample for Frontier Themes syntax preview.
#>

param(
    [string]$Brand = 'openai',
    [ValidateSet('dark', 'light')]
    [string]$Mode = 'dark'
)

$ErrorActionPreference = 'Stop'

function Get-ThemePath {
    param([string]$Id, [string]$ThemeMode)
    Join-Path $PSScriptRoot "..\themes\$Id-$ThemeMode.json"
}

function Write-ThemeSummary {
    param([string]$Path)
    $theme = Get-Content -Raw -Path $Path | ConvertFrom-Json
    Write-Host "Loaded $($theme.name) with $($theme.tokenColors.Count) token rules" -ForegroundColor Cyan
}

$themePath = Get-ThemePath -Id $Brand -Mode $Mode
if (-not (Test-Path $themePath)) {
    throw "Theme not found: $themePath"
}

Write-ThemeSummary -Path $themePath
