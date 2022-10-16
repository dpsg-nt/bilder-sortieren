<?php

require_once("./.config.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit();

if ($_SERVER['HTTP_X_PW_AUTH'] != USER_PASSWORD) {
    header("HTTP/1.0 401 Unauthorized");
    exit('invalid authorization');
}

function get_access_token() {
    if (is_file('./.config.microsoft-access-token.secret')) {
        $access_token = json_decode(file_get_contents('./.config.microsoft-access-token.secret'));
        if ($access_token->expires_at > time() + 30) {
            return $access_token->token;
        }
    }

    // request access_token
    $curl = curl_init('https://login.microsoftonline.com/common/oauth2/v2.0/token');
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, array(
        'client_id' => MICROSOFT_GRAPH_CLIENT_ID,
        'client_secret' => MICROSOFT_GRAPH_CLIENT_SECRET,
        'grant_type' => 'refresh_token',
        'refresh_token' => file_get_contents('./.config.microsoft-refresh-token.secret'),
        'scope' => 'offline_access Files.ReadWrite.All User.Read'
    ));
    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if($status != 200) {
        var_dump($response);
        die("Failed to get a access token.");
    }

    $tokens = json_decode($response);
    // Update the refresh token, this will help that the token does not expire at some point.
    file_put_contents('./.config.microsoft-refresh-token.secret', $tokens->refresh_token);
    file_put_contents('./.config.microsoft-access-token.secret', json_encode(array(
        'expires_at' => time() + $tokens->expires_in,
        'token' => $tokens->access_token
    )));

    return $tokens->access_token;
}
