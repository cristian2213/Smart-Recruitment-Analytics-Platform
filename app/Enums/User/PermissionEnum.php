<?php

namespace App\Enums\User;

enum PermissionEnum: string
{
    // view_<any> gives access to the module (menu item)
    case ViewUsers = 'view_users';
    // global users
    case CreateUsers = 'create_users';
    case ReadUsers = 'read_users';
    case ReadOwnUsers = 'read_own_users';
    case UpdateUsers = 'update_users';
    case UpdateOwnUsers = 'update_own_users';
    case DeleteUsers = 'delete_users';
    case DeleteOwnUsers = 'delete_own_users';

    case ViewJobs = 'view_jobs';
    case CreateJobs = 'create_jobs';
    case ReadJobs = 'read_jobs';
    case ReadOwnJobs = 'read_own_jobs';
    case UpdateJobs = 'update_jobs';
    case UpdateOwnJobs = 'update_own_jobs';
    case UpdateJobsStatus = 'update_jobs_status';
    case DeleteJobs = 'delete_jobs';
    case DeleteOwnJobs = 'delete_own_jobs';

    case ViewApplications = 'view_applications';
    case CreateApplications = 'create_applications';
    case ReadApplications = 'read_applications';
    case ReadOwnApplications = 'read_own_applications';
    case UpdateApplications = 'update_applications';
    case UpdateOwnApplications = 'update_own_applications';
    case DeleteApplications = 'delete_applications';
    case DeleteOwnApplications = 'delete_own_applications';
}
