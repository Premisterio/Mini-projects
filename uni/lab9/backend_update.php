<?php
require '_db.php';
header('Content-Type: application/json');

$data = $_POST;
if (empty($data)) {
    parse_str(file_get_contents('php://input'), $data);
}

$id         = (int)($data['id']         ?? 0);
$name       = trim($data['name']        ?? '');
$start_date = $data['start_date']       ?? '';
$end_date   = $data['end_date']         ?? '';
$status     = $data['status']           ?? 'New';
$note       = trim($data['note']        ?? '');
$room_id    = (int)($data['room_id']    ?? 0);

if (!$id || !$name || !$start_date || !$end_date) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$allowed = ['New', 'Confirmed', 'Arrived', 'Checked Out', 'Expired'];
if (!in_array($status, $allowed, true)) {
    $status = 'New';
}

$sql    = 'UPDATE reservations SET name=?, start_date=?, end_date=?, status=?, note=?';
$params = [$name, $start_date, $end_date, $status, $note ?: null];

if ($room_id > 0) {
    $sql     .= ', room_id=?';
    $params[] = $room_id;
}

$sql     .= ' WHERE id=?';
$params[] = $id;

$stmt = db()->prepare($sql);
$stmt->execute($params);

echo json_encode(['updated' => $stmt->rowCount()]);
