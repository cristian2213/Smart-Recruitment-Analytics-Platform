<?php

namespace App\Http\Controllers\Dashboard;

use App\Exports\UsersExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserDownloadController extends Controller
{
    public function download_users(Request $request)
    {
        $file_name = 'users-'.now()->format('Y-m-d_H-i-s').'.xlsx';

        return (new UsersExport)->download(
            $file_name,
        );
    }
}
