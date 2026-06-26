<?php
// 1. Get the current time (Setting it to Brisbane/Queensland local time)
date_default_timezone_set('Australia/Brisbane');
$timestamp = date('Y-m-d h:i:s A');

// 2. Log the event to a text file
$log_entry = "Email opened at: " . $timestamp . "\n";
file_put_contents('opens_log.txt', $log_entry, FILE_APPEND);

// 3. Output a real, transparent 1x1 GIF pixel so the email app doesn't break
header('Content-Type: image/gif');
echo base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
exit;
?>