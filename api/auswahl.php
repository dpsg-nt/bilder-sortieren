<?php
require_once("./_includes.php");
header("Content-Type: application/json");

$access_token = get_access_token();

if (!isset($_GET['year']) || !isset($_GET['event'])) {
    die('?year=...&event=... required');
}

if (str_contains($_GET['year'], '/') || str_contains($_GET['event'], '/')) {
    die('no deep links!');
}

$eventFolder = rawurlencode($_GET['year']).'/'.rawurlencode($_GET['event']);
$auswahlFolder = rawurlencode($_GET['year']).'/'.rawurlencode($_GET['event']).'/Auswahl';
$listFile = $auswahlFolder.'/liste.txt';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $curl = curl_init('https://graph.microsoft.com/v1.0/me/drive/root:'.MICROSOFT_ONEDRIVE_BASE_FOLDER.'/'.$listFile.':/content');
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer '.$access_token,
        'Content-Type: application/json'
    ));
    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if($status == 404) {
        echo json_encode(array('approved' => array(), 'rejected' => array()), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    } else {
        $lines = array_map(fn($val) => trim($val), explode("\n", trim($response)));
        if (str_starts_with($lines[0], '#JSON=')) {
            echo json_encode(json_decode(substr($lines[0], 6)), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        } else {
            echo json_encode(array('approved' => $lines, 'rejected' => array()), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
    }
} else {
    $payload = json_decode(file_get_contents('php://input'));
    if (!isset($payload->approved) || !isset($payload->rejected)) {
        die('{ "error": "payload must be an object" }');
    }
    $fileContent = "#JSON=".json_encode($payload, JSON_UNESCAPED_SLASHES)."\n".join("\n", $payload->approved);

    // get event folder id
    $curl = curl_init('https://graph.microsoft.com/v1.0/me/drive/root:'.MICROSOFT_ONEDRIVE_BASE_FOLDER.'/'.$eventFolder);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer '.$access_token,
        'Content-Type: application/json'
    ));
    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($status != 200) {
        die('{ "error": "failed to find event folder, status code: '.$status.'" }');
    }

    $eventFolderId = json_decode($response)->id;

    // create Auswahl folder
    $curl = curl_init('https://graph.microsoft.com/v1.0/me/drive/items/'.$eventFolderId.'/children');
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode(array('name' => 'Auswahl', 'folder' => (object)[])));
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer '.$access_token,
        'Content-Type: application/json'
    ));
    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($status != 200 && $status != 201) {
        die('{ "error": "failed to create Auswahl folder, status code: '.$status.'" }');
    }

    $auswahlFolderId = json_decode($response)->id;

    $curl = curl_init('https://graph.microsoft.com/v1.0/me/drive/root:'.MICROSOFT_ONEDRIVE_BASE_FOLDER.'/'.$listFile.':/content');
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($curl, CURLOPT_POSTFIELDS, $fileContent);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer '.$access_token,
        'Content-Type: text/plain'
    ));
    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if($status != 200 && $status != 201) {
        die('{ "error": "failed to upload file, status code: '.$status.'" }');
    }
}
