-- Таблиця кімнат готелю
CREATE TABLE IF NOT EXISTS rooms (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    capacity    INT          NOT NULL DEFAULT 1,
    status      ENUM('Ready','Cleaning','Dirty') NOT NULL DEFAULT 'Ready'
);

-- Таблиця бронювань
CREATE TABLE IF NOT EXISTS reservations (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    room_id     INT          NOT NULL,
    name        VARCHAR(200) NOT NULL,
    start_date  DATE         NOT NULL,
    end_date    DATE         NOT NULL,
    status      ENUM('New','Confirmed','Arrived','Checked Out','Expired') NOT NULL DEFAULT 'New',
    note        TEXT,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Тестові дані — кімнати
INSERT INTO rooms (name, capacity, status) VALUES
('101 — Стандарт', 1, 'Ready'),
('102 — Стандарт', 1, 'Cleaning'),
('103 — Стандарт', 2, 'Ready'),
('201 — Делюкс',   2, 'Ready'),
('202 — Делюкс',   2, 'Dirty'),
('203 — Делюкс',   3, 'Ready'),
('301 — Люкс',     2, 'Ready'),
('302 — Люкс',     4, 'Ready');

-- Тестові дані — бронювання
INSERT INTO reservations (room_id, name, start_date, end_date, status, note) VALUES
(1, 'Іваненко Олег',     '2026-05-18', '2026-05-21', 'Arrived',    'Ранній заїзд'),
(2, 'Петренко Марія',    '2026-05-20', '2026-05-25', 'Confirmed',  NULL),
(3, 'Сидоренко Іван',    '2026-05-19', '2026-05-22', 'New',        'Потрібне ліжечко'),
(5, 'Коваль Тетяна',     '2026-05-22', '2026-05-26', 'New',        NULL),
(7, 'Мельник Андрій',    '2026-05-18', '2026-05-20', 'Checked Out','Пізній виїзд'),
(8, 'Бойко Людмила',     '2026-05-24', '2026-05-28', 'Confirmed',  'VIP гість');
