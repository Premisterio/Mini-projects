<?php
require '_db.php';
header('Content-Type: application/json');

$name       = trim($_POST['name']       ?? '');
$room_id    = (int)($_POST['room_id']   ?? 0);
$start_date = $_POST['start_date']      ?? '';
$end_date   = $_POST['end_date']        ?? '';
$note       = trim($_POST['note']       ?? '');

if (!$name || !$room_id || !$start_date || !$end_date) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$stmt = db()->prepare(
    'INSERT INTO reservations (room_id, name, start_date, end_date, status, note)
     VALUES (?, ?, ?, ?, \'New\', ?)'
);
$stmt->execute([$room_id, $name, $start_date, $end_date, $note ?: null]);

echo json_encode(['id' => (int)db()->lastInsertId()]);
