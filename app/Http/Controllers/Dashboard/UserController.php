<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\User\PermissionEnum;
use App\Enums\User\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserUpdateRequest;
use App\Models\Role;
use App\Models\User;
use App\Traits\UserAccessTrait;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->userCanOrFail(PermissionEnum::CreateUsers);

        $validated = $request->validated();
        $validated['created_by'] = $this->userId();
        $validated['password'] = Hash::make($validated['password']);

        if (
            $this->isHRManager() &&
             $validated['role'] != RoleEnum::Recruiter->value
        ) {
            return back()->with('error', 'You can only create users with role "Recruiter"');
        }

        $user = User::create($validated);
        $role = Role::where('role', $validated['role'])->first();
        $user->roles()->attach($role->id);

        return back()->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $uuid): RedirectResponse|Response
    {
        if ($this->isAdmin()) {
            $this->userCanOrFail(PermissionEnum::ReadUsers);
            $user = User::where('uuid', $uuid)->first();
        }

        if ($this->isHRManager()) {
            $this->userCanOrFail(PermissionEnum::ReadOwnUsers);
            $user = User::where([
                'created_by' => $this->userId(),
                'uuid' => $uuid,
            ])->first();
        }

        if (! $user) {
            return back()->with('error', 'User not found.');
        }

        return Inertia::render('dashboard/user', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id, UserUpdateRequest $request)
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
