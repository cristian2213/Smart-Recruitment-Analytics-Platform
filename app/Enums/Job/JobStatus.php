<?php

namespace App\Enums\Job;

enum JobStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Closed = 'closed';
}

enum JobPlacement: string
{
    case Remote = 'remote';
    case OnSite = 'onsite';
}
