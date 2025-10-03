<?php

namespace App\Enums\User;

enum RoleEnum: string
{
    case Admin = 'admin';
    case HRManager = 'hr_manager';
    case Recruiter = 'recruiter';
    case Applicant = 'applicant';
}
