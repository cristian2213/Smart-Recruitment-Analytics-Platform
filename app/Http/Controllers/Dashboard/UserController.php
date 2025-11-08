<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\User\PermissionEnum;
use App\Enums\User\RoleEnum;
use App\Exports\UsersExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserRequest;
use App\Models\Role;
use App\Models\User;
use App\Notifications\VerifyEmailNotification;
use App\Services\StorageService;
use App\Services\UrlGenerator;
use App\Traits\UserAccessTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    use UserAccessTrait;

    public function __construct(
        private readonly UrlGenerator $url_generator,
        private readonly StorageService $storage_service,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $searchQuery = $request->query('query');

        $this->userCanOrFail(PermissionEnum::ViewUsers);
        $role = $this->userRole();

        if ($this->isHRManager()) {
            $this->userCanOrFail(PermissionEnum::ReadOwnUsers);
        }

        $searchCb = function (Builder $query) use ($searchQuery) {
            $query->where(function ($q) use ($searchQuery) {
                $q->where('id', 'like', "%{$searchQuery}%")
                    ->orWhere('name', 'like', "%{$searchQuery}%")
                    ->orWhere('last_name', 'like', "%{$searchQuery}%")
                    ->orWhere('email', 'like', "%{$searchQuery}%")
                    ->orWhereHas('roles', function ($subQ) use ($searchQuery) {
                        $subQ->where('role', 'like', "%{$searchQuery}%");
                    })
                    ->orWhere('created_at', 'like', "%{$searchQuery}%");
            });
        };

        $users = match ($role) {
            RoleEnum::Admin->value => User::with(['creator:id,name', 'roles:id,role'])
                ->select([
                    'id',
                    'uuid',
                    'name',
                    'last_name',
                    'email',
                    'email_verified_at',
                    'updated_at',
                    'created_by',
                ])
                ->when($searchQuery, $searchCb)
                ->latest('id')
                ->paginate(10)
                ->withQueryString(),
            RoleEnum::HRManager->value => User::with('roles:id,role')
                ->where('created_by', $this->userId())
                ->when($searchQuery, $searchCb)
                ->latest('id')
                ->paginate(10)
                ->withQueryString(),
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

        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');

            $file_name = Str::random(6).'.'.$avatar->extension();

            $save_path = "users/{$user->id}/avatar/{$file_name}";

            $s3_path = $this->storage_service->uploadToS3(
                $avatar,
                $save_path,
            );

            if ($s3_path) {
                $validated['avatar'] = $s3_path;
            }
        }

        $role = Role::where('role', $validated['role'])->first();
        $user->roles()->attach($role->id);
        $verification_url = $this->url_generator->generateSignedUrl(
            'verification.verify',
            $user->uuid,
            $user->email
        );
        $user->notify(
            new VerifyEmailNotification($verification_url)
        );

        return back()->with('message', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @deprecated it wan't implemented
     */
    // public function show(string $id): RedirectResponse|Response
    // {
    //     $this->userCanOrFail(PermissionEnum::ViewShowUser);

    //     if ($this->isAdmin()) {
    //         $this->userCanOrFail(PermissionEnum::ReadUsers);
    //         $user = User::where('uuid', $id)->first();
    //     }

    //     if ($this->isHRManager()) {
    //         $this->userCanOrFail(PermissionEnum::ReadOwnUsers);
    //         $user = User::where([
    //             'created_by' => $this->userId(),
    //             'uuid' => $id,
    //         ])->first();
    //     }

    //     if (! $user) {
    //         // throw new Exception('User not found.');
    //         return back()->withErrors('User not found.');
    //     }

    //     return Inertia::render('dashboard/user', [
    //         'user' => $user,
    //         'mode' => 'show',
    //     ]);
    // }

    /**
     * Show the form for editing the specified resource.
     *
     * * @deprecated it wan't implemented
     */
    // public function edit(string $id, UserRequest $request)
    // {
    //     $this->userCanOrFail(PermissionEnum::ViewEditUser);

    //     if ($this->isAdmin()) {
    //         $this->userCanOrFail(PermissionEnum::ReadUsers);
    //         $user = User::where('uuid', $id)->first();
    //     }

    //     if ($this->isHRManager()) {
    //         $this->userCanOrFail(PermissionEnum::ReadOwnUsers);
    //         $user = User::where([
    //             'created_by' => $this->userId(),
    //             'uuid' => $id,
    //         ])->first();
    //     }

    //     if (! $user) {
    //         return back()->withErrors('User not found.');
    //     }

    //     return Inertia::render('dashboard/user', [
    //         'user' => $user,
    //         'mode' => 'edit',
    //     ]);
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, string $id)
    {

        if (
            ! $this->userCan(PermissionEnum::UpdateUsers) &&
            ! $this->userCan(PermissionEnum::UpdateOwnUsers)
        ) {
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

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        if (
            isset($validated['email']) &&
            $validated['email'] != $user->email
        ) {
            $emailExists = User::where('email', $validated['email'])->first();
            if ($emailExists) {
                return back()->withErrors('Email already exists.');
            }

            $this->forceLogout($user);
            $user->email = $validated['email'];
            $user->email_verified_at = null;
            $verification_url = $this->url_generator->generateSignedUrl(
                'verification.verify',
                $user->uuid,
                $validated['email']
            );
            $user->notify(
                new VerifyEmailNotification($verification_url)
            );
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

    public function download_users(Request $request)
    {
        if (
            ! $this->userCan(PermissionEnum::DownloadUsers) &&
            ! $this->userCan(PermissionEnum::DownloadOwnUsers)
        ) {
            return back()->withErrors('You do not have permissions to download users.');
        }

        $from = $request->query('from');
        $to = $request->query('to');

        $file_name = 'users-'.$from.'_'.$to.'.xlsx';

        return (new UsersExport($from, $to))->download(
            $file_name,
        );
    }
}
