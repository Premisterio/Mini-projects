<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>New Reservation</title>
<link rel="stylesheet" href="form.css">
</head>
<body>
<form class="res-form" method="post" action="backend_create.php">

    <h2>New Reservation</h2>

    <input type="hidden" name="room_id"    value="<?= htmlspecialchars($_GET['room_id']   ?? '') ?>">
    <input type="hidden" name="start_date" value="<?= htmlspecialchars($_GET['start_date'] ?? '') ?>">
    <input type="hidden" name="end_date"   value="<?= htmlspecialchars($_GET['end_date']   ?? '') ?>">

    <div class="form-group">
        <label for="name">Guest Name</label>
        <input type="text" id="name" name="name" required placeholder="Full name">
    </div>

    <div class="form-row">
        <div class="form-group">
            <label>Start Date</label>
            <input type="date" name="start_date_visible"
                   value="<?= htmlspecialchars($_GET['start_date'] ?? '') ?>" readonly>
        </div>
        <div class="form-group">
            <label>End Date</label>
            <input type="date" name="end_date_visible"
                   value="<?= htmlspecialchars($_GET['end_date'] ?? '') ?>" readonly>
        </div>
    </div>

    <div class="form-group">
        <label for="note">Note</label>
        <textarea id="note" name="note" rows="3" placeholder="Optional note"></textarea>
    </div>

    <div class="form-actions">
        <button type="submit" class="btn-save">Save</button>
        <button type="button" class="btn-cancel" onclick="window.parent.postMessage('close','*')">Cancel</button>
    </div>

</form>
</body>
</html>
