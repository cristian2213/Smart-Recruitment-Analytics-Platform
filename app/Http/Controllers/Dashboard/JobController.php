<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\User\PermissionEnum;
use App\Enums\User\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Traits\UserAccessTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    use UserAccessTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $searchQuery = $request->query('query');

        $this->userCanOrFail(PermissionEnum::ViewJobs);
        $role = $this->userRole();

        if ($this->isHRManager()) {
            $this->userCanOrFail(PermissionEnum::ReadOwnJobs);
        }

        $searchCb = function (Builder $query) use ($searchQuery) {
            $query->where(function ($q) use ($searchQuery) {
                $q->where('id', 'like', "%{$searchQuery}%")
                    ->orWhere('title', 'like', "%{$searchQuery}%")
                    ->orWhere('location', 'like', "%{$searchQuery}%")
                    ->orWhere('salary', 'like', "%{$searchQuery}%")
                    ->orWhere('status', 'like', "%{$searchQuery}%")
                    ->orWhere('created_at', 'like', "%{$searchQuery}%");
            });
        };

        $jobs = match ($role) {
            RoleEnum::Admin->value => Job::with(['creator:id,name,avatar', 'recruiter:id,name,avatar'])
                ->select([
                    'id',
                    'title',
                    'location',
                    'salary',
                    'status',
                    'user_id',
                    'recruiter_id',
                    'created_at',
                    'updated_at',
                ])
                ->withCount('applications')
                ->when($searchQuery, $searchCb)
                ->latest('id')
                ->paginate(10)
                ->withQueryString(),

            RoleEnum::HRManager->value => Job::with(['creator:id,name', 'recruiter:id,name'])
                ->select([
                    'id',
                    'title',
                    'location',
                    'salary',
                    'status',
                    'user_id',
                    'recruiter_id',
                    'created_at',
                    'updated_at',
                ])
                ->where('user_id', $this->userId())
                ->when($searchQuery, $searchCb)
                ->latest('id')
                ->paginate(10)
                ->withQueryString(),
            default => [],
        };

        return Inertia::render('dashboard/job-menu/jobs', [
            'jobs' => $jobs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
