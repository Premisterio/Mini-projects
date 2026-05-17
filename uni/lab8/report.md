# Звіт з лабораторної роботи №8

## Тема
Програма резервування кімнат у готелі: постановка задачі.

## Мета
Створення веб-програми з використанням HTML5, CSS3, JavaScript, PHP, MySQL. В даній лабораторній роботі проводиться постановка задачі, створення бази даних та базової структури застосунку.

## Адреса з результатами роботи на сервері
http://<твій-субдомен>.rf.gd

Вихідний код: https://github.com/Premisterio/Mini-projects/tree/main/uni/lab8

---

## Постановка задачі

Необхідно розробити односторінковий веб-застосунок для резервування номерів у готелі. Застосунок складається з:

- **Фронтенд:** HTML5, CSS3, JavaScript (jQuery + DayPilot Scheduler)
- **Бекенд:** PHP з PDO-доступом до MySQL
- **Архітектура:** SPA (Single Page Application), зв'язок клієнта і сервера через AJAX

### Функціональні вимоги
| № | Функція |
|---|---------|
| 1 | Перелік кімнат із фільтром за місткістю |
| 2 | Стан кімнат: Ready / Cleaning / Dirty |
| 3 | Статуси бронювань: New / Confirmed / Arrived / Checked Out / Expired |
| 4 | Створення, редагування, видалення бронювань |
| 5 | Drag & drop і зміна розміру блоків у планувальнику |
| 6 | Заборона накладання бронювань |
| 7 | Модальне вікно редагування |

### Схема бази даних
```
rooms                          reservations
─────────────────────          ──────────────────────────────
id          INT PK             id          INT PK
name        VARCHAR(100)       room_id     INT FK → rooms.id
capacity    INT                name        VARCHAR(200)
status      ENUM               start_date  DATE
            Ready              end_date    DATE
            Cleaning           status      ENUM
            Dirty                          New
                                           Confirmed
                                           Arrived
                                           Checked Out
                                           Expired
                               note        TEXT
```

---

## Результати роботи

### 1. Створення БД у phpMyAdmin

> Вставити скріншот: панель phpMyAdmin після виконання `schema.sql` — видно дві таблиці `rooms` і `reservations`.

### 2. Таблиця `rooms` з тестовими даними

> Вставити скріншот: вміст таблиці rooms (8 записів: Стандарт, Делюкс, Люкс).

### 3. Таблиця `reservations` з тестовими даними

> Вставити скріншот: вміст таблиці reservations (6 тестових бронювань).

### 4. Головна сторінка застосунку в браузері

> Вставити скріншот: index.php відкрита в браузері — навбар, сітка кімнат із кольоровими індикаторами статусу, статус "БД підключена".

---

## Фрагменти коду

### Підключення до БД через PDO
```php
$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER,
    DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);
```
PDO (PHP Data Objects) — уніфікований інтерфейс доступу до БД. `ERRMODE_EXCEPTION` гарантує, що помилки SQL кидають виключення, а не замовчуються.

### SQL — створення таблиць
```sql
CREATE TABLE IF NOT EXISTS rooms (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 1,
    status   ENUM('Ready','Cleaning','Dirty') NOT NULL DEFAULT 'Ready'
);

CREATE TABLE IF NOT EXISTS reservations (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    room_id    INT NOT NULL,
    start_date DATE NOT NULL,
    end_date   DATE NOT NULL,
    status     ENUM('New','Confirmed','Arrived','Checked Out','Expired') NOT NULL DEFAULT 'New',
    note       TEXT,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
```
`FOREIGN KEY ... ON DELETE CASCADE` — при видаленні кімнати всі її бронювання видаляються автоматично.

### Фільтр кімнат на JavaScript
```javascript
function filterRooms(capacity) {
    document.querySelectorAll('.room-card').forEach(card => {
        const match = +capacity === 0 || +card.dataset.capacity === +capacity;
        card.style.display = match ? '' : 'none';
    });
}
```
Фільтрація відбувається на клієнті без запиту до сервера — місткість кожної картки зберігається в `data-capacity`.

---

## Висновки

У ході виконання лабораторної роботи:
- Сформульовано постановку задачі: визначено технологічний стек, функціональні вимоги та схему БД.
- Створено дві таблиці MySQL (`rooms`, `reservations`) з відповідними типами та зовнішнім ключем.
- Наповнено таблицю кімнат 8 тестовими записами трьох категорій (Стандарт, Делюкс, Люкс).
- Розгорнуто базову версію `index.php`, яка підключається до БД через PDO і виводить перелік кімнат із фільтром.

**Критичний аналіз:**
- Використання `ENUM` для статусів зручне, але негнучке — додати новий статус без `ALTER TABLE` неможливо. Альтернатива — окрема таблиця довідників.
- Credentials БД зараз hardcoded у `index.php` — у продакшні слід виносити в `.env` файл поза `htdocs/`.
- Фільтрація лише на клієнті обмежена — при великій кількості кімнат краще фільтрувати через SQL-запит із параметром.
- Наступні 3 лабораторні роботи (9–11) розширять застосунок: AJAX-ендпоінти, DayPilot Scheduler, drag & drop бронювань.
