<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
// use Illuminate\Foundation\Auth\EmailVerificationRequest;
// use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the user's email address as verified.
     */
    public function verify_email(Request $request, $id, $hash)
    {
        $user = User::select(['id', 'email'])->where('uuid', $id)->first();

        if (! $user) {
            return response()->redirectTo(route('login'))->withErrors('User not found', 'verify-email');
        }

        if ($user->hasVerifiedEmail()) {
            return response()->redirectTo(route('login'))->withErrors('Email already verified', 'verify-email');
        }

        $user_hash = sha1($user->email);
        if (! hash_equals($hash, $user_hash)) {
            return response()->redirectTo(route('login'))->withErrors('Invalid link', 'verify-email');
        }

        $user->markEmailAsVerified();

        return response()->redirectTo(route('login'))->with('message', 'Email verified successfully');
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    // public function verify_in_auth(EmailVerificationRequest $request): RedirectResponse
    // {
    //     if ($request->user()->hasVerifiedEmail()) {
    //         return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    //     }

    //     $request->fulfill();

    //     return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    // }
}
