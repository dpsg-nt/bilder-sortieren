<?php
require_once("./_includes.php");
header("Content-Type: application/json");

$access_token = get_access_token();

$curl = curl_init('https://graph.microsoft.com/v1.0/me/drive/root:'.MICROSOFT_ONEDRIVE_BASE_FOLDER.':/children');
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, array(
    'Authorization: Bearer '.$access_token,
    'Content-Type: application/json'
));
$response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

$folders = array_filter(json_decode($response)->value, fn($value) => str_starts_with($value->name, 'Jahr '));
$result = array_map(fn($value) => $value->name, $folders);

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
