<?php

namespace App\Enums\Job;

enum ApplicationStatus: string
{
    case Pending = 'pending';
    case Seen = 'seen';
    case Rejected = 'rejected';
    case Contracted = 'contracted';
}
