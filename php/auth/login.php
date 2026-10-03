<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.', [], 405);
}

$email = trim((string) ($_POST['email'] ?? ''));
$password = (string) ($_POST['password'] ?? '');

if ($email === '' || $password === '') {
    jsonResponse(false, 'Email and password are required.', [], 400);
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare('SELECT id, name, email, password FROM admins WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$admin = $stmt->fetch();

if (!$admin) {
    jsonResponse(false, 'Invalid login credentials.', [], 401);
}

$storedPassword = (string) $admin['password'];
$valid = password_verify($password, $storedPassword) || hash_equals($storedPassword, $password);

if (!$valid) {
    jsonResponse(false, 'Invalid login credentials.', [], 401);
}

$_SESSION['admin_id'] = (int) $admin['id'];
$_SESSION['admin_name'] = $admin['name'];
$_SESSION['admin_email'] = $admin['email'];

jsonResponse(true, 'Login successful.', ['redirect' => '../admin/dashboard.html'], 200);
