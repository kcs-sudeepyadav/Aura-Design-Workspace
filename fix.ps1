$content = Get-Content -Path 'd:\wamp64\www\velour\velour\src\components\generated\HubPages.tsx' -Raw

$badCode = "let currentUser; if (userStr) { currentUser = JSON.parse(userStr); } else { if (role === 'customer') currentUser = { id: 'c-1', role: 'customer', name: 'Ananya Mehta' }; else if (role === 'manager') currentUser = { id: 'm-1', role: 'manager', name: 'Sarah Jenkins' }; else currentUser = { id: 'admin-1', role: 'admin', name: 'Admin User' }; }"

$cPattern = "(?s)(export const HubCustomerPage: React\.FC<HubPageProps> = .*?)" + [regex]::Escape($badCode)
$content = [regex]::Replace($content, $cPattern, "$1let currentUser; if (userStr) { currentUser = JSON.parse(userStr); } else { currentUser = { id: 'c-1', role: 'customer', name: 'Ananya Mehta' }; }")

$mPattern = "(?s)(export const HubManagerPage: React\.FC<HubPageProps> = .*?)" + [regex]::Escape($badCode)
$content = [regex]::Replace($content, $mPattern, "$1let currentUser; if (userStr) { currentUser = JSON.parse(userStr); } else { currentUser = { id: 'm-1', role: 'manager', name: 'Sarah Jenkins' }; }")

$aPattern = "(?s)(export const HubAdminPage: React\.FC<HubPageProps> = .*?)" + [regex]::Escape($badCode)
$content = [regex]::Replace($content, $aPattern, "$1let currentUser; if (userStr) { currentUser = JSON.parse(userStr); } else { currentUser = { id: 'admin-1', role: 'admin', name: 'Admin User' }; }")

Set-Content -Path 'd:\wamp64\www\velour\velour\src\components\generated\HubPages.tsx' -Value $content
