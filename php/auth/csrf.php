<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/auth.php';

jsonResponse(true, 'CSRF token loaded.', ['csrf_token' => csrfToken()], 200);
