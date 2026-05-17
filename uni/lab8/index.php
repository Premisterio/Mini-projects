<?php
define('DB_HOST', 'sql311.byetcluster.com');
define('DB_NAME', 'your_db_name');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $db_ok = true;
} catch (PDOException $e) {
    $db_ok  = false;
    $db_err = $e->getMessage();
}

$rooms        = $db_ok ? $pdo->query('SELECT * FROM rooms ORDER BY id')->fetchAll(PDO::FETCH_ASSOC) : [];
$reservations = $db_ok ? $pdo->query(
    'SELECT r.*, rm.name AS room_name FROM reservations r JOIN rooms rm ON r.room_id = rm.id ORDER BY r.start_date'
)->fetchAll(PDO::FETCH_ASSOC) : [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hotel Reservation System</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<!-- HEADER -->
<header class="app-header">
  <div class="header-inner">
    <div class="logo">🏨 Hotel<span>Book</span></div>
    <nav class="header-nav">
      <a href="#rooms">Rooms</a>
      <a href="#reservations">Reservations</a>
    </nav>
    <div class="header-status <?= $db_ok ? 'ok' : 'err' ?>">
      <?= $db_ok ? '● DB connected' : '● DB error' ?>
    </div>
  </div>
</header>

<main class="container">

  <?php if (!$db_ok): ?>
  <div class="alert-box">
    <strong>DB connection error:</strong> <?= htmlspecialchars($db_err) ?>
  </div>
  <?php endif; ?>

  <!-- ROOMS -->
  <section id="rooms" class="section">
    <div class="section-head">
      <h2 class="section-title">Rooms</h2>
      <div class="filter-bar">
        <label>Capacity:</label>
        <select onchange="filterRooms(this.value)">
          <option value="0">All</option>
          <option value="1">1 person</option>
          <option value="2">2 persons</option>
          <option value="3">3 persons</option>
          <option value="4">4 persons</option>
        </select>
      </div>
    </div>

    <div class="rooms-grid" id="roomsGrid">
      <?php if (empty($rooms)): ?>
        <p class="empty">No rooms found.</p>
      <?php else: ?>
        <?php foreach ($rooms as $room): ?>
        <div class="room-card status-<?= strtolower(str_replace(' ', '-', $room['status'])) ?>"
             data-capacity="<?= $room['capacity'] ?>"
             data-id="<?= $room['id'] ?>"
             onclick="openNewModal(<?= $room['id'] ?>, '<?= htmlspecialchars($room['name'], ENT_QUOTES) ?>')"
             title="Click to make a reservation">
          <div class="room-name"><?= htmlspecialchars($room['name']) ?></div>
          <div class="room-meta">
            <span class="room-capacity">👥 <?= $room['capacity'] ?></span>
            <span class="room-status badge-<?= strtolower(str_replace(' ', '-', $room['status'])) ?>">
              <?= htmlspecialchars($room['status']) ?>
            </span>
          </div>
          <div class="room-hint">+ New reservation</div>
        </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </section>

  <!-- RESERVATIONS -->
  <section id="reservations" class="section">
    <div class="section-head">
      <h2 class="section-title">Reservations</h2>
      <span class="res-count"><?= count($reservations) ?> total</span>
    </div>

    <?php if (empty($reservations)): ?>
      <p class="empty">No reservations yet. Click a room above to add one.</p>
    <?php else: ?>
    <div class="res-table-wrap">
      <table class="res-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Guest</th>
            <th>Room</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Status</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="resTableBody">
          <?php foreach ($reservations as $res): ?>
          <tr data-id="<?= $res['id'] ?>">
            <td class="td-id"><?= $res['id'] ?></td>
            <td class="td-name"><?= htmlspecialchars($res['name']) ?></td>
            <td><?= htmlspecialchars($res['room_name']) ?></td>
            <td><?= $res['start_date'] ?></td>
            <td><?= $res['end_date'] ?></td>
            <td><span class="status-pill st-<?= strtolower(str_replace([' ','_'], '-', $res['status'])) ?>">
              <?= htmlspecialchars($res['status']) ?>
            </span></td>
            <td class="td-note"><?= htmlspecialchars($res['note'] ?? '—') ?></td>
            <td>
              <button class="btn-edit" onclick="openEditModal(<?= $res['id'] ?>)">Edit</button>
            </td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <?php endif; ?>
  </section>

</main>

<footer class="app-footer">
  Software Engineering &nbsp;|&nbsp; Hrehul Volodymyr
</footer>

<!-- ══════════════ MODAL: NEW RESERVATION ══════════════ -->
<div class="modal-overlay" id="newModal">
  <div class="modal">
    <div class="modal-head">
      <h3>New Reservation — <span id="newRoomName"></span></h3>
      <button class="modal-close" onclick="closeModal('newModal')">✕</button>
    </div>
    <form id="newForm" onsubmit="submitNew(event)">
      <input type="hidden" id="newRoomId" name="room_id">

      <div class="form-group">
        <label>Guest Name</label>
        <input type="text" name="name" required placeholder="Full name">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Check-in</label>
          <input type="date" name="start_date" id="newStart" required>
        </div>
        <div class="form-group">
          <label>Check-out</label>
          <input type="date" name="end_date" id="newEnd" required>
        </div>
      </div>
      <div class="form-group">
        <label>Note</label>
        <textarea name="note" rows="2" placeholder="Optional"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-save">Save</button>
        <button type="button" class="btn-cancel" onclick="closeModal('newModal')">Cancel</button>
      </div>
    </form>
  </div>
</div>

<!-- ══════════════ MODAL: EDIT RESERVATION ══════════════ -->
<div class="modal-overlay" id="editModal">
  <div class="modal">
    <div class="modal-head">
      <h3>Edit Reservation</h3>
      <button class="modal-close" onclick="closeModal('editModal')">✕</button>
    </div>
    <form id="editForm" onsubmit="submitEdit(event)">
      <input type="hidden" id="editId" name="id">

      <div class="form-group">
        <label>Guest Name</label>
        <input type="text" id="editName" name="name" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Check-in</label>
          <input type="date" id="editStart" name="start_date" required>
        </div>
        <div class="form-group">
          <label>Check-out</label>
          <input type="date" id="editEnd" name="end_date" required>
        </div>
      </div>
      <div class="form-group">
        <label>Status</label>
        <select id="editStatus" name="status">
          <option>New</option>
          <option>Confirmed</option>
          <option>Arrived</option>
          <option>Checked Out</option>
          <option>Expired</option>
        </select>
      </div>
      <div class="form-group">
        <label>Note</label>
        <textarea id="editNote" name="note" rows="2"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-save">Update</button>
        <button type="button" class="btn-delete" onclick="deleteReservation()">Delete</button>
        <button type="button" class="btn-cancel" onclick="closeModal('editModal')">Cancel</button>
      </div>
    </form>
  </div>
</div>

<script>
// ── FILTER ──
function filterRooms(cap) {
  document.querySelectorAll('.room-card').forEach(c => {
    c.style.display = (+cap === 0 || +c.dataset.capacity === +cap) ? '' : 'none';
  });
}

// ── MODAL HELPERS ──
function openModal(id)  { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(o =>
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); })
);

// ── NEW RESERVATION ──
function openNewModal(roomId, roomName) {
  document.getElementById('newRoomId').value = roomId;
  document.getElementById('newRoomName').textContent = roomName;
  const today = new Date().toISOString().slice(0,10);
  const next  = new Date(Date.now() + 86400000).toISOString().slice(0,10);
  document.getElementById('newStart').value = today;
  document.getElementById('newEnd').value   = next;
  document.getElementById('newForm').reset();
  document.getElementById('newRoomId').value = roomId;
  document.getElementById('newStart').value  = today;
  document.getElementById('newEnd').value    = next;
  openModal('newModal');
}

async function submitNew(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const res  = await fetch('backend_create.php', { method: 'POST', body: data });
  const json = await res.json();
  if (json.id) { closeModal('newModal'); location.reload(); }
  else alert('Error: ' + (json.error || 'Unknown'));
}

// ── EDIT RESERVATION ──
async function openEditModal(id) {
  const res  = await fetch('backend_events.php');
  const list = await res.json();
  const item = list.find(r => r.id === id);
  if (!item) return;

  document.getElementById('editId').value     = item.id;
  document.getElementById('editName').value   = item.text;
  document.getElementById('editStart').value  = item.start;
  document.getElementById('editEnd').value    = item.end;
  document.getElementById('editNote').value   = item.note || '';
  document.getElementById('editStatus').value = item.status;
  openModal('editModal');
}

async function submitEdit(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const res  = await fetch('backend_update.php', { method: 'POST', body: data });
  const json = await res.json();
  if (json.updated !== undefined) { closeModal('editModal'); location.reload(); }
  else alert('Error: ' + (json.error || 'Unknown'));
}

async function deleteReservation() {
  const id = document.getElementById('editId').value;
  if (!confirm('Delete this reservation?')) return;
  const res  = await fetch('backend_delete.php?id=' + id);
  const json = await res.json();
  if (json.deleted !== undefined) { closeModal('editModal'); location.reload(); }
}
</script>

</body>
</html>
