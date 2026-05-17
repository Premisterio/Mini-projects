# Звіт з лабораторної роботи №9

## Тема
Програма резервування кімнат у готелі: створення основних файлів бекенду.

## Мета
Створити основні файли серверної частини з доступом до бази даних через PDO. Реалізувати JSON-ендпоінти для отримання даних, HTML-форми для введення бронювань та PHP-скрипти для CRUD-операцій.

## Посилання на файли на сервері
- `http://твій-сайт.rf.gd/lab8/backend_rooms.php`
- `http://твій-сайт.rf.gd/lab8/backend_events.php`
- `http://твій-сайт.rf.gd/lab8/new.php`
- `http://твій-сайт.rf.gd/lab8/edit.php?id=1`

---

## Створені файли

| Файл | Призначення |
|------|-------------|
| `_db.php` | Підключення до MySQL через PDO (singleton) |
| `backend_rooms.php` | JSON-ендпоінт: список кімнат |
| `backend_events.php` | JSON-ендпоінт: список бронювань |
| `new.php` | Форма створення нового бронювання |
| `edit.php` | Форма редагування бронювання |
| `backend_create.php` | Створення бронювання (INSERT) |
| `backend_update.php` | Оновлення бронювання (UPDATE) |
| `backend_delete.php` | Видалення бронювання (DELETE) |
| `form.css` | Стилі для форм |

---

## Результати роботи

### 1. backend_rooms.php — JSON масив кімнат
> Скріншот: браузер відкрив `backend_rooms.php`, відображається JSON:
```json
[
  {"id":1,"name":"101 - Standard","capacity":1,"status":"Ready"},
  {"id":2,"name":"102 - Standard","capacity":1,"status":"Cleaning"},
  ...
]
```

### 2. backend_events.php — JSON масив бронювань
> Скріншот: браузер відкрив `backend_events.php`, відображається JSON:
```json
[
  {"id":1,"resource":1,"text":"John Smith","start":"2026-05-18","end":"2026-05-21","status":"Arrived","note":"Early check-in"},
  ...
]
```

### 3. new.php — форма нового бронювання
> Скріншот: браузер відкрив `new.php`, відображається форма з полями Guest Name, Start Date, End Date, Note.

### 4. edit.php — форма редагування
> Скріншот: браузер відкрив `edit.php?id=1`, форма заповнена даними бронювання, є вибір статусу та кнопки Update / Delete.

---

## Фрагменти коду

### _db.php — singleton підключення
```php
function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    }
    return $pdo;
}
```
Singleton через `static $pdo` — з'єднання створюється один раз за запит і повторно використовується всіма скриптами.

### backend_rooms.php — JSON відповідь
```php
header('Content-Type: application/json');
$rows = db()->query('SELECT id, name, capacity, status FROM rooms ORDER BY id')
            ->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($result);
```
`Content-Type: application/json` повідомляє браузеру та AJAX-клієнту формат відповіді.

### backend_create.php — захищений INSERT
```php
$stmt = db()->prepare(
    'INSERT INTO reservations (room_id, name, start_date, end_date, status, note)
     VALUES (?, ?, ?, ?, "New", ?)'
);
$stmt->execute([$room_id, $name, $start_date, $end_date, $note ?: null]);
```
Prepared statements з параметрами `?` захищають від SQL-ін'єкцій.

### backend_update.php — підтримка POST і PUT
```php
$data = $_POST;
if (empty($data)) {
    parse_str(file_get_contents('php://input'), $data);
}
```
Скрипт приймає дані як з HTML-форми (POST), так і з AJAX fetch із методом PUT.

### backend_delete.php — видалення за id
```php
$id = (int)($_GET['id'] ?? $_POST['id'] ?? 0);
$stmt = db()->prepare('DELETE FROM reservations WHERE id = ?');
$stmt->execute([$id]);
echo json_encode(['deleted' => $stmt->rowCount()]);
```
Приймає id через GET (посилання) або POST (AJAX). `rowCount()` повертає кількість видалених рядків.

---

## Висновки

У ході роботи створено повноцінний бекенд для готельної системи:
- **JSON API** (`backend_rooms.php`, `backend_events.php`) — ендпоінти для передачі даних у форматі JSON через AJAX.
- **HTML-форми** (`new.php`, `edit.php`) — інтерфейс для введення та редагування бронювань.
- **CRUD-скрипти** (`backend_create.php`, `backend_update.php`, `backend_delete.php`) — серверна обробка операцій з БД.

**Критичний аналіз:**
- Усі запити до БД використовують prepared statements — захист від SQL-ін'єкцій.
- Credentials БД винесені в окремий `_db.php`, але він все ще знаходиться в `htdocs/` — в реальному проекті слід розмістити поза публічною директорією.
- Відсутня CSRF-валідація форм — у навчальному контексті прийнятно, але в продакшні обов'язкова.
- Наступна лабораторна (10) інтегрує DayPilot Scheduler і з'єднає фронтенд із цими ендпоінтами через AJAX.
