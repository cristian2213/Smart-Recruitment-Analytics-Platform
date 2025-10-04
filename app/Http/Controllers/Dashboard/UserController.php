<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\User\PermissionEnum;
use App\Enums\User\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\UserAccessTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    use UserAccessTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $this->userCanOrFail(PermissionEnum::ViewUsers);
        $role = $this->userRole();

        if ($this->isHRManager()) {
            $this->userCanOrFail(PermissionEnum::ReadOwnUsers);
        }

        $users = match ($role) {
            RoleEnum::Admin->value => User::paginate(10),
            RoleEnum::HRManager->value => User::where('created_by', $this->userId())->paginate(10),
            default => [],
        };

        return Inertia::render('dashboard/users', [
            'users' => $users,
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
