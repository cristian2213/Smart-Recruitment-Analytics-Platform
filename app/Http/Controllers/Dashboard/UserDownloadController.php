<?php

namespace App\Http\Controllers\Dashboard;

use App\Exports\UsersExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserDownloadController extends Controller
{
    public function download_users(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        $file_name = 'users-'.now()->format('Y-m-d_H-i-s').'.xlsx';

        return (new UsersExport($from, $to))->download(
            $file_name,
        );
    }
}
