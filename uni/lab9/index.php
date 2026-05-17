<?php
define('DB_HOST', 'sql311.infinityfree.com');
define('DB_NAME', 'if0_41948527_lab8');
define('DB_USER', 'if0_41948527');
define('DB_PASS', 'jWpbdRsQhWfLx');

try {
    $pdo = new PDO(
        'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4',
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $db_ok = true;
} catch (PDOException $e) {
    $db_ok  = false;
    $db_err = $e->getMessage();
}

$rooms = $db_ok
    ? $pdo->query('SELECT * FROM rooms ORDER BY id')->fetchAll(PDO::FETCH_ASSOC)
    : [];

$reservations = $db_ok
    ? $pdo->query('SELECT r.*, rm.name AS room_name FROM reservations r JOIN rooms rm ON r.room_id=rm.id ORDER BY r.start_date')->fetchAll(PDO::FETCH_ASSOC)
    : [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hotel Reservation System</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f6f9;color:#1e293b;min-height:100vh}

/* HEADER */
.app-header{background:#1a1f36;color:#fff;padding:0 24px;position:sticky;top:0;z-index:200;box-shadow:0 2px 8px rgba(0,0,0,.25)}
.header-inner{max-width:1200px;margin:0 auto;height:60px;display:flex;align-items:center;gap:32px}
.logo{font-size:20px;font-weight:700}.logo span{color:#60a5fa}
.header-nav{display:flex;gap:20px;flex:1}
.header-nav a{color:rgba(255,255,255,.7);text-decoration:none;font-size:14px;transition:color .2s}
.header-nav a:hover{color:#fff}
.header-status{font-size:12px}
.ok{color:#4ade80}.err{color:#f87171}

/* LAYOUT */
.container{max-width:1200px;margin:32px auto;padding:0 24px;display:flex;flex-direction:column;gap:40px}
.section-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px}
.section-title{font-size:22px;font-weight:700;color:#1a1f36}
.res-count{font-size:13px;color:#94a3b8}
.alert-box{background:#fee2e2;border:1px solid #fca5a5;color:#991b1b;padding:16px 20px;border-radius:8px;font-size:14px}
.empty{color:#94a3b8;font-size:14px}

/* FILTER */
.filter-bar{display:flex;align-items:center;gap:10px;font-size:14px;color:#475569}
.filter-bar select{padding:6px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:14px;background:#fff;cursor:pointer}

/* ROOMS */
.rooms-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px}
.room-card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;border-left:4px solid #94a3b8;cursor:pointer;transition:box-shadow .2s,transform .2s,border-color .2s}
.room-card:hover{box-shadow:0 6px 20px rgba(0,0,0,.1);transform:translateY(-3px);border-left-color:#60a5fa}
.room-card.status-ready{border-left-color:#4ade80}
.room-card.status-cleaning{border-left-color:#facc15}
.room-card.status-dirty{border-left-color:#f87171}
.room-name{font-weight:600;font-size:15px;margin-bottom:10px}
.room-meta{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#64748b}
.room-status{padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase}
.badge-ready{background:#dcfce7;color:#166534}
.badge-cleaning{background:#fef9c3;color:#854d0e}
.badge-dirty{background:#fee2e2;color:#991b1b}
.room-hint{margin-top:10px;font-size:12px;color:#60a5fa;opacity:0;transition:opacity .2s}
.room-card:hover .room-hint{opacity:1}

/* TABLE */
.res-table-wrap{overflow-x:auto}
.res-table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.07)}
.res-table th{background:#1a1f36;color:#fff;padding:12px 14px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:.06em}
.res-table td{padding:12px 14px;border-bottom:1px solid #f1f5f9;font-size:14px;vertical-align:middle}
.res-table tr:last-child td{border-bottom:none}
.res-table tr:hover td{background:#f8fafc}
.td-id{color:#94a3b8;font-size:12px}
.td-name{font-weight:600}
.td-note{color:#94a3b8;font-size:13px;max-width:160px}

/* STATUS PILLS */
.status-pill{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.st-new{background:#dbeafe;color:#1e40af}
.st-confirmed{background:#dcfce7;color:#166534}
.st-arrived{background:#d1fae5;color:#065f46}
.st-checked-out{background:#f1f5f9;color:#475569}
.st-expired{background:#fee2e2;color:#991b1b}

.btn-edit{padding:5px 12px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;transition:background .2s}
.btn-edit:hover{background:#dbeafe}

/* MODAL */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:500;align-items:center;justify-content:center;padding:20px}
.modal-overlay.active{display:flex}
.modal{background:#fff;border-radius:12px;width:100%;max-width:480px;box-shadow:0 20px 60px rgba(0,0,0,.2);overflow:hidden;animation:modalIn .2s ease}
@keyframes modalIn{from{opacity:0;transform:translateY(-12px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
.modal-head{display:flex;justify-content:space-between;align-items:center;padding:20px 24px 16px;border-bottom:1px solid #e2e8f0}
.modal-head h3{font-size:17px;font-weight:700;color:#1a1f36}
.modal-close{background:none;border:none;font-size:18px;color:#94a3b8;cursor:pointer;padding:0 4px;transition:color .2s}
.modal-close:hover{color:#1e293b}

/* FORMS */
.modal form{padding:20px 24px 24px}
.form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
label{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#64748b;font-weight:600}
input[type="text"],input[type="date"],select,textarea{padding:10px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:14px;color:#1e293b;background:#fff;transition:border-color .2s;font-family:inherit;width:100%}
input:focus,select:focus,textarea:focus{outline:none;border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.15)}
textarea{resize:vertical}
.form-actions{display:flex;gap:10px;padding-top:8px}
button{padding:10px 20px;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:opacity .2s}
button:hover{opacity:.85}
.btn-save{background:#1a1f36;color:#fff}
.btn-delete{background:#fee2e2;color:#991b1b}
.btn-cancel{background:#f1f5f9;color:#475569;margin-left:auto}

/* FOOTER */
.app-footer{text-align:center;padding:20px;font-size:13px;color:#94a3b8;border-top:1px solid #e2e8f0}

@media(max-width:640px){
  .header-nav{display:none}
  .rooms-grid{grid-template-columns:1fr 1fr}
  .form-row{grid-template-columns:1fr}
}
</style>
</head>
<body>

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
  <div class="alert-box"><strong>DB error:</strong> <?= htmlspecialchars($db_err) ?></div>
  <?php endif; ?>

  <!-- ROOMS -->
  <section id="rooms">
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
    <div class="rooms-grid">
      <?php foreach ($rooms as $room): ?>
      <div class="room-card status-<?= strtolower($room['status']) ?>"
           data-capacity="<?= $room['capacity'] ?>"
           onclick="openNewModal(<?= $room['id'] ?>, '<?= htmlspecialchars($room['name'], ENT_QUOTES) ?>')"
           title="Click to reserve">
        <div class="room-name"><?= htmlspecialchars($room['name']) ?></div>
        <div class="room-meta">
          <span>👥 <?= $room['capacity'] ?></span>
          <span class="room-status badge-<?= strtolower($room['status']) ?>"><?= $room['status'] ?></span>
        </div>
        <div class="room-hint">+ New reservation</div>
      </div>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- RESERVATIONS -->
  <section id="reservations">
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
          <tr><th>#</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Status</th><th>Note</th><th></th></tr>
        </thead>
        <tbody>
          <?php foreach ($reservations as $res): ?>
          <tr>
            <td class="td-id"><?= $res['id'] ?></td>
            <td class="td-name"><?= htmlspecialchars($res['name']) ?></td>
            <td><?= htmlspecialchars($res['room_name']) ?></td>
            <td><?= $res['start_date'] ?></td>
            <td><?= $res['end_date'] ?></td>
            <td><span class="status-pill st-<?= strtolower(str_replace([' '], '-', $res['status'])) ?>"><?= $res['status'] ?></span></td>
            <td class="td-note"><?= htmlspecialchars($res['note'] ?? '—') ?></td>
            <td><button class="btn-edit" onclick="openEditModal(
              <?= $res['id'] ?>,
              '<?= htmlspecialchars($res['name'], ENT_QUOTES) ?>',
              '<?= $res['start_date'] ?>',
              '<?= $res['end_date'] ?>',
              '<?= $res['status'] ?>',
              '<?= htmlspecialchars($res['note'] ?? '', ENT_QUOTES) ?>'
            )">Edit</button></td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <?php endif; ?>
  </section>

</main>

<footer class="app-footer">Software Engineering &nbsp;|&nbsp; Hrehul Volodymyr</footer>

<!-- MODAL: NEW -->
<div class="modal-overlay" id="newModal">
  <div class="modal">
    <div class="modal-head">
      <h3>New Reservation — <span id="newRoomName"></span></h3>
      <button class="modal-close" onclick="closeModal('newModal')">✕</button>
    </div>
    <form onsubmit="submitNew(event)">
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

<!-- MODAL: EDIT -->
<div class="modal-overlay" id="editModal">
  <div class="modal">
    <div class="modal-head">
      <h3>Edit Reservation</h3>
      <button class="modal-close" onclick="closeModal('editModal')">✕</button>
    </div>
    <form onsubmit="submitEdit(event)">
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
        <button type="button" class="btn-delete" onclick="deleteRes()">Delete</button>
        <button type="button" class="btn-cancel" onclick="closeModal('editModal')">Cancel</button>
      </div>
    </form>
  </div>
</div>

<script>
function filterRooms(cap) {
  document.querySelectorAll('.room-card').forEach(c => {
    c.style.display = (+cap === 0 || +c.dataset.capacity === +cap) ? '' : 'none';
  });
}

function openModal(id)  { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
document.querySelectorAll('.modal-overlay').forEach(o =>
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); })
);

function openNewModal(roomId, roomName) {
  document.getElementById('newRoomId').value   = roomId;
  document.getElementById('newRoomName').textContent = roomName;
  const today = new Date().toISOString().slice(0,10);
  const tmrw  = new Date(Date.now()+86400000).toISOString().slice(0,10);
  document.getElementById('newStart').value = today;
  document.getElementById('newEnd').value   = tmrw;
  openModal('newModal');
}

async function submitNew(e) {
  e.preventDefault();
  const r = await fetch('backend_create.php', {method:'POST', body: new FormData(e.target)});
  const j = await r.json();
  if (j.id) { closeModal('newModal'); location.reload(); }
  else alert('Error: ' + (j.error || 'unknown'));
}

function openEditModal(id, name, start, end, status, note) {
  document.getElementById('editId').value     = id;
  document.getElementById('editName').value   = name;
  document.getElementById('editStart').value  = start;
  document.getElementById('editEnd').value    = end;
  document.getElementById('editStatus').value = status;
  document.getElementById('editNote').value   = note;
  openModal('editModal');
}

async function submitEdit(e) {
  e.preventDefault();
  const r = await fetch('backend_update.php', {method:'POST', body: new FormData(e.target)});
  const j = await r.json();
  if (j.updated !== undefined) { closeModal('editModal'); location.reload(); }
  else alert('Error: ' + (j.error || 'unknown'));
}

async function deleteRes() {
  const id = document.getElementById('editId').value;
  if (!confirm('Delete this reservation?')) return;
  const r = await fetch('backend_delete.php?id=' + id);
  const j = await r.json();
  if (j.deleted !== undefined) { closeModal('editModal'); location.reload(); }
}
</script>
</body>
</html>
