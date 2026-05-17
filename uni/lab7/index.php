<?php
session_start();

function new_game(): void {
    $_SESSION['board']  = array_fill(0, 9, '');
    $_SESSION['turn']   = 'X';
    $_SESSION['winner'] = null;
    $_SESSION['score']  = $_SESSION['score'] ?? ['X' => 0, 'O' => 0, 'D' => 0];
}

function check_winner(array $b): ?string {
    $lines = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6],
    ];
    foreach ($lines as $l) {
        if ($b[$l[0]] !== '' && $b[$l[0]] === $b[$l[1]] && $b[$l[1]] === $b[$l[2]]) {
            return $b[$l[0]];
        }
    }
    return in_array('', $b, true) ? null : 'D';
}

if (!isset($_SESSION['board'])) {
    new_game();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['reset'])) {
        new_game();
    } elseif (isset($_POST['cell']) && $_SESSION['winner'] === null) {
        $cell = (int)$_POST['cell'];
        if ($cell >= 0 && $cell < 9 && $_SESSION['board'][$cell] === '') {
            $_SESSION['board'][$cell] = $_SESSION['turn'];
            $result = check_winner($_SESSION['board']);
            if ($result !== null) {
                $_SESSION['winner'] = $result;
                $_SESSION['score'][$result]++;
            } else {
                $_SESSION['turn'] = $_SESSION['turn'] === 'X' ? 'O' : 'X';
            }
        }
    }
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

$board  = $_SESSION['board'];
$turn   = $_SESSION['turn'];
$winner = $_SESSION['winner'];
$score  = $_SESSION['score'];

$status = match (true) {
    $winner === 'D'   => 'Нічия!',
    $winner !== null  => "Переміг гравець «{$winner}»!",
    default           => "Хід гравця «{$turn}»",
};
?>
<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Хрестики-нолики на PHP</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<main class="game">
    <h1>Хрестики-нолики</h1>

    <div class="status <?= $winner ? 'status-end' : '' ?>">
        <?= htmlspecialchars($status) ?>
    </div>

    <div class="scoreboard">
        <div class="score"><span>X</span><strong><?= $score['X'] ?></strong></div>
        <div class="score"><span>Нічиї</span><strong><?= $score['D'] ?></strong></div>
        <div class="score"><span>O</span><strong><?= $score['O'] ?></strong></div>
    </div>

    <form method="post" class="board">
        <?php foreach ($board as $i => $mark): ?>
            <button
                type="submit"
                name="cell"
                value="<?= $i ?>"
                class="cell <?= $mark ? 'cell-'.strtolower($mark) : '' ?>"
                <?= ($mark !== '' || $winner !== null) ? 'disabled' : '' ?>
            ><?= htmlspecialchars($mark) ?></button>
        <?php endforeach; ?>
    </form>

    <form method="post">
        <button type="submit" name="reset" value="1" class="reset-btn">Нова гра</button>
    </form>

    <footer>Лабораторна робота №7 · PHP + sessions</footer>
</main>

</body>
</html>
