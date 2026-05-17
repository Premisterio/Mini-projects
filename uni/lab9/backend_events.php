<?php
require '_db.php';
header('Content-Type: application/json');

$rows = db()->query(
    'SELECT id, room_id, name, start_date, end_date, status, note
     FROM reservations ORDER BY start_date'
)->fetchAll(PDO::FETCH_ASSOC);

$result = [];
foreach ($rows as $r) {
    $result[] = [
        'id'       => (int)$r['id'],
        'resource' => (int)$r['room_id'],
        'text'     => $r['name'],
        'start'    => $r['start_date'],
        'end'      => $r['end_date'],
        'status'   => $r['status'],
        'note'     => $r['note'],
    ];
}

echo json_encode($result);
