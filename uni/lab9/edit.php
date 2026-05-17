<?php
require '_db.php';

$id  = (int)($_GET['id'] ?? 0);
$res = [];
if ($id > 0) {
    $stmt = db()->prepare('SELECT * FROM reservations WHERE id = ?');
    $stmt->execute([$id]);
    $res = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Edit Reservation</title>
<link rel="stylesheet" href="form.css">
</head>
<body>
<form class="res-form" method="post" action="backend_update.php">

    <h2>Edit Reservation</h2>

    <input type="hidden" name="id" value="<?= $id ?>">

    <div class="form-group">
        <label for="name">Guest Name</label>
        <input type="text" id="name" name="name" required
               value="<?= htmlspecialchars($res['name'] ?? '') ?>">
    </div>

    <div class="form-row">
        <div class="form-group">
            <label>Start Date</label>
            <input type="date" name="start_date"
                   value="<?= htmlspecialchars($res['start_date'] ?? '') ?>">
        </div>
        <div class="form-group">
            <label>End Date</label>
            <input type="date" name="end_date"
                   value="<?= htmlspecialchars($res['end_date'] ?? '') ?>">
        </div>
    </div>

    <div class="form-group">
        <label for="status">Booking Status</label>
        <select id="status" name="status">
            <?php foreach (['New','Confirmed','Arrived','Checked Out','Expired'] as $s): ?>
                <option value="<?= $s ?>" <?= ($res['status'] ?? '') === $s ? 'selected' : '' ?>>
                    <?= $s ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>

    <div class="form-group">
        <label for="note">Note</label>
        <textarea id="note" name="note" rows="3"><?= htmlspecialchars($res['note'] ?? '') ?></textarea>
    </div>

    <div class="form-actions">
        <button type="submit" class="btn-save">Update</button>
        <button type="button" class="btn-delete"
                onclick="if(confirm('Delete this reservation?')) window.location='backend_delete.php?id=<?= $id ?>'">
            Delete
        </button>
        <button type="button" class="btn-cancel" onclick="window.parent.postMessage('close','*')">Cancel</button>
    </div>

</form>
</body>
</html>
