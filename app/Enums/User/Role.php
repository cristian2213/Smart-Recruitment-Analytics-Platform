<?php

namespace App\Enums\User;

enum Role: string
{
    case Admin = 'admin';
    case HRManager = 'hr_manager';
    case Recruiter = 'recruiter';
    case Applicant = 'applicant';
}

