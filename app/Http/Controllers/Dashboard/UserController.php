<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\User\PermissionEnum;
use App\Enums\User\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserRequest;
use App\Models\Role;
use App\Models\User;
use App\Traits\UserAccessTrait;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Str;

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
            RoleEnum::Admin->value => User::latest()->paginate(10),
            RoleEnum::HRManager->value => User::where('created_by', $this->userId())->latest()->paginate(10),
            default => [],
        };

        return Inertia::render('dashboard/user-menu/users', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request): RedirectResponse
    {
        $this->userCanOrFail(PermissionEnum::CreateUsers);

        $validated = $request->validated();
        $validated['created_by'] = $this->userId();
        $validated['password'] = Hash::make(Str::random(12));
        $validated['uuid'] = Str::uuid()->toString();

        if (
            $this->isHRManager() &&
             $validated['role'] != RoleEnum::Recruiter->value
        ) {
            return back()->withErrors('You can only create users with role "Recruiter"');
        }

        $user = User::create($validated);
        $role = Role::where('role', $validated['role'])->first();
        $user->roles()->attach($role->id);
        $user->sendEmailVerificationNotification();

        return back()->with('message', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): RedirectResponse|Response
    {
        $this->userCanOrFail(PermissionEnum::ViewShowUser);

        if ($this->isAdmin()) {
            $this->userCanOrFail(PermissionEnum::ReadUsers);
            $user = User::where('uuid', $id)->first();
        }

        if ($this->isHRManager()) {
            $this->userCanOrFail(PermissionEnum::ReadOwnUsers);
            $user = User::where([
                'created_by' => $this->userId(),
                'uuid' => $id,
            ])->first();
        }

        if (! $user) {
            // throw new Exception('User not found.');
            return back()->withErrors('User not found.');
        }

        return Inertia::render('dashboard/user', [
            'user' => $user,
            'mode' => 'show',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id, UserRequest $request)
    {
        $this->userCanOrFail(PermissionEnum::ViewEditUser);

        if ($this->isAdmin()) {
            $this->userCanOrFail(PermissionEnum::ReadUsers);
            $user = User::where('uuid', $id)->first();
        }

        if ($this->isHRManager()) {
            $this->userCanOrFail(PermissionEnum::ReadOwnUsers);
            $user = User::where([
                'created_by' => $this->userId(),
                'uuid' => $id,
            ])->first();
        }

        if (! $user) {
            return back()->withErrors('User not found.');
        }

        return Inertia::render('dashboard/user', [
            'user' => $user,
            'mode' => 'edit',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, string $id)
    {
        if (
            ! $this->userCan(PermissionEnum::UpdateUsers) &&
            ! $this->userCan(PermissionEnum::UpdateOwnUsers)
        ) {
            // return response()->json(['message' => 'You do not have permission to update this user.'], 403);
            return back()->withErrors('You do not have permission to update this user.');
        }

        $validated = $request->validated();
        if ($this->isAdmin()) {
            $user = User::where('uuid', $id)->first();
        }

        if ($this->isHRManager()) {
            $user = User::where([
                'uuid' => $id,
                'created_by' => $this->userId(),
            ])->first();
        }

        if (! $user) {
            return back()->withErrors('User not found.');
        }

        if (
            $validated['email'] &&
            $validated['email'] != $user->email
        ) {
            $emailExists = User::where('email', $validated['email'])->first();
            if ($emailExists) {
                return back()->withErrors('Email already exists.');
            }
            $user->email = $validated['email'];
            $user->save();
            $user->sendEmailVerificationNotification();
        }

        if ($validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return back()->with('message', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (
            ! $this->userCan(PermissionEnum::DeleteUsers) &&
            ! $this->userCan(PermissionEnum::DeleteOwnUsers)
        ) {
            return back()->withErrors('You do not have permission to delete this user.');
        }

        if ($this->currentUser()->uuid == $id) {
            // return response()->json(['message' => 'You cannot delete your own account.'], 400);
            return back()->withErrors('You cannot delete your own account.');
        }

        if ($this->isAdmin()) {
            $user = User::where('uuid', $id)->first();
        }

        if ($this->isHRManager()) {
            $user = User::where([
                'uuid' => $id,
                'created_by' => $this->userId(),
            ])->first();
        }

        if (! $user) {
            return back()->withErrors('User not found.');
        }

        $user->delete();

        return back()->with('message', 'User deleted successfully.');
    }
}
