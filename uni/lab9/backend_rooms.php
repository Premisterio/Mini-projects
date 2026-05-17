<?php
require '_db.php';
header('Content-Type: application/json');

$rows = db()->query('SELECT id, name, capacity, status FROM rooms ORDER BY id')->fetchAll(PDO::FETCH_ASSOC);

$result = [];
foreach ($rows as $r) {
    $result[] = [
        'id'       => (int)$r['id'],
        'name'     => $r['name'],
        'capacity' => (int)$r['capacity'],
        'status'   => $r['status'],
    ];
}

echo json_encode($result);
