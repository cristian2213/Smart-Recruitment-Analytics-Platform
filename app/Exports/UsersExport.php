<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Excel;

class UsersExport implements FromQuery, WithHeadings
{
    use Exportable;

    /**
     * Optional Writer Type
     */
    private $writerType = Excel::XLSX;

    public function query()
    {
        return User::query()->select('id', 'name', 'last_name');
    }

    public function headings(): array
    {
        return ['#', 'Name', 'Last name'];
    }
}
