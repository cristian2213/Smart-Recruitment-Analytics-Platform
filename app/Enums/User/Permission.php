<?php

namespace App\Enums\User;

enum Permission: string
{
    case Create = 'create';
    case Read = 'read';
    case Update = 'update';
    case Delete = 'delete';
}
