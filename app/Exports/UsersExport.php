<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithCustomChunkSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Excel;

class UsersExport implements FromQuery, ShouldQueue, WithCustomChunkSize, WithHeadings, WithMapping
{
    use Exportable;

    public function __construct(
        private readonly ?string $from,
        private readonly ?string $to,
    ) {}

    /**
     * Optional Writer Type
     */
    private $writerType = Excel::XLSX;

    public function query()
    {
        $query = User::query()
            ->select([
                'users.id',
                'users.name',
                'users.last_name',
                'users.email',
                'users.email_verified_at',
                'users.created_at',
                'users.updated_at',
                DB::raw("CONCAT(creator.name, ' ', creator.last_name) as created_by"),
                'r.role',
            ])
            ->leftJoin('users as creator', 'users.created_by', '=', 'creator.id')
            ->leftJoin('users_roles as ur', 'users.id', '=', 'ur.user_id')
            ->leftJoin('roles as r', 'ur.role_id', '=', 'r.id');

        if ($this->from && $this->to) {
            $query->whereDate('users.created_at', '>=', $this->from)
                ->whereDate('users.created_at', '<=', $this->to);
        }

        return $query->orderBy('users.id');
    }

    public function headings(): array
    {
        return [
            'id',
            'name',
            'last_name',
            'email',
            'email_verified_at',
            'created_by',
            'role',
            'created_at',
            'updated_at',
        ];
    }

    public function map($user): array
    {
        return [
            $user->id,
            $user->name,
            $user->last_name,
            $user->email,
            $user->email_verified_at ?? 'unverified',
            $user->created_by,
            $user->role,
            $user->created_at,
            $user->updated_at ?? '',
        ];
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
