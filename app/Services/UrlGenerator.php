<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class UrlGenerator
{
    public function generateSignedUrl(string $named_route, string|int $id, string $hash_value, ?int $expired_at = null): string
    {
        return URL::temporarySignedRoute(
            $named_route,
            now()->addMinutes($expired_at ?? Config::get('auth.verification.expire', 60)),
            [
                'id' => $id,
                'hash' => sha1($hash_value),
            ]
        );
    }
}
