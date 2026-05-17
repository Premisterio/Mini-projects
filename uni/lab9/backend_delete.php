<?php
require '_db.php';
header('Content-Type: application/json');

$id = (int)($_GET['id'] ?? $_POST['id'] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing id']);
    exit;
}

$stmt = db()->prepare('DELETE FROM reservations WHERE id = ?');
$stmt->execute([$id]);

echo json_encode(['deleted' => $stmt->rowCount()]);
