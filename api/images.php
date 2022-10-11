<?php
require_once("./_includes.php");
header("Content-Type: application/json");

if (!isset($_GET['year']) || !isset($_GET['event'])) {
    die('?year=...&event=... required');
}

if (str_contains($_GET['year'], '/') || str_contains($_GET['event'], '/')) {
    die('no deep links!');
}

$access_token = get_access_token();

function fetch_link($link) {
    global $access_token;

    $curl = curl_init($link);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer '.$access_token,
        'Content-Type: application/json'
    ));
    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    # echo $link.": Status = ".$status."\n" . $response."\n\n";

    return json_decode($response);
}

function list_children_paginated($link) {
    $response = fetch_link($link);
    if (property_exists($response, '@odata.nextLink')) {
        return array_merge(
            $response->value,
            fetch_link($response->{"@odata.nextLink"})->value
        );
    } else {
        return $response->value;
    }
}

function list_files_recursively($folder) {
    $allObjects = list_children_paginated('https://graph.microsoft.com/v1.0/me/drive/root:'.MICROSOFT_ONEDRIVE_BASE_FOLDER.'/'.$folder.':/children?$expand=thumbnails');
    $files = array();

    foreach ($allObjects as $value) {
        if ($value->name == 'Auswahl') {
            continue;
        } else if (property_exists($value, 'folder')) {
            $recursiveFiles = list_files_recursively($folder . '/' . rawurlencode($value->name));
            foreach ($recursiveFiles as $file) {
                $files[] = $file;
            }
        } else if (property_exists($value, 'file') && property_exists($value, 'thumbnails') && property_exists($value, 'photo')) {
            $files[] = $value;
        }
    }
    return $files;
}

$all_files = list_files_recursively(rawurlencode($_GET['year']).'/'.rawurlencode($_GET['event']));

echo json_encode(array_map(fn($file) => array(
        'id' => $file->id,
        'name' => $file->name,
        'path' => urldecode($file->parentReference->path),
        'captureDate' => property_exists($file->photo, 'takenDateTime') ? $file->photo->takenDateTime : null,
        'thumbnail' => $file->thumbnails[0]->large->url,
        'full' => $file->{"@microsoft.graph.downloadUrl"}
), $all_files), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
