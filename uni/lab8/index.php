<?php
// ── DB CONFIG ── замінити на свої дані з InfinityFree Control Panel
define('DB_HOST', 'sql.infinityfree.com');
define('DB_NAME', 'your_db_name');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $db_ok = true;
} catch (PDOException $e) {
    $db_ok  = false;
    $db_err = $e->getMessage();
}

// Завантажити кімнати для відображення
$rooms = [];
if ($db_ok) {
    $rooms = $pdo->query('SELECT * FROM rooms ORDER BY id')->fetchAll(PDO::FETCH_ASSOC);
}
?>
<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Готельна система резервування</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<header class="app-header">
    <div class="header-inner">
        <div class="logo">🏨 Hotel<span>Book</span></div>
        <nav class="header-nav">
            <a href="#rooms">Кімнати</a>
            <a href="#reservations">Бронювання</a>
        </nav>
        <div class="header-status <?= $db_ok ? 'ok' : 'err' ?>">
            <?= $db_ok ? '● БД підключена' : '● БД: помилка' ?>
        </div>
    </div>
</header>

<main class="container">

    <?php if (!$db_ok): ?>
    <div class="alert-box">
        <strong>Помилка підключення до БД:</strong><br>
        <?= htmlspecialchars($db_err) ?>
    </div>
    <?php endif; ?>

    <section id="rooms" class="section">
        <h2 class="section-title">Кімнати готелю</h2>

        <div class="filter-bar">
            <label>Фільтр за місткістю:</label>
            <select id="capacityFilter" onchange="filterRooms(this.value)">
                <option value="0">Усі</option>
                <option value="1">1 особа</option>
                <option value="2">2 особи</option>
                <option value="3">3 особи</option>
                <option value="4">4 особи</option>
            </select>
        </div>

        <div class="rooms-grid" id="roomsGrid">
            <?php if (empty($rooms)): ?>
                <p class="empty">Кімнати не знайдено.</p>
            <?php else: ?>
                <?php foreach ($rooms as $room): ?>
                <div class="room-card status-<?= strtolower(str_replace(' ', '-', $room['status'])) ?>"
                     data-capacity="<?= $room['capacity'] ?>">
                    <div class="room-name"><?= htmlspecialchars($room['name']) ?></div>
                    <div class="room-meta">
                        <span class="room-capacity">👥 <?= $room['capacity'] ?></span>
                        <span class="room-status"><?= htmlspecialchars($room['status']) ?></span>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </section>

    <section id="reservations" class="section">
        <h2 class="section-title">Бронювання <span class="coming-soon">(наступні лаби)</span></h2>
        <p class="muted">Тут буде DayPilot Scheduler із підтримкою drag &amp; drop — реалізується в лаб. 9–11.</p>
    </section>

</main>

<footer class="app-footer">
    Спеціальність: Комп'ютерні науки &nbsp;|&nbsp; Студент: Грегуль Володимир
</footer>

<script>
function filterRooms(capacity) {
    const cards = document.querySelectorAll('.room-card');
    cards.forEach(card => {
        const match = +capacity === 0 || +card.dataset.capacity === +capacity;
        card.style.display = match ? '' : 'none';
    });
}
</script>

</body>
</html>
