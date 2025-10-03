<?php

namespace App\Enums\User;

enum PermissionEnum: string
{
    // USERS
    case ViewUsers = 'view_users';
    case CreateUsers = 'create_users';
    case ReadUsers = 'read_users';
    case UpdateUsers = 'update_users';
    case DeleteUsers = 'delete_users';

    // JOBS
    case ViewJobs = 'view_jobs';
    case CreateJobs = 'create_jobs';
    case ReadJobs = 'read_jobs';
    case UpdateJobs = 'update_jobs';
    case DeleteJobs = 'delete_jobs';

    // APPLICATIONS
    // case CreateApplications = 'create_applications';
    // case ReadApplications = 'read_applications';
    // case UpdateApplications = 'update_applications';
    // case DeleteApplications = 'delete_applications';
}
