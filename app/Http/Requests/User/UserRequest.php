<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $httpVerb = request()->getMethod();

        $rules = [
            'name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'],
            'email' => [
                'nullable', 'string', 'email', 'max:255',
            ],
            'password' => [
                'nullable', Password::min(8)->letters()->mixedCase()->numbers()->symbols()->uncompromised(),
            ],
        ];

        if ($httpVerb == 'POST') {
            return [
                'name' => ['required', 'string', 'max:100'],
                'last_name' => ['nullable', 'string', 'max:100'],
                'email' => [
                    'required', 'string', 'email', 'max:255', 'unique:users',
                ],
                'password' => [
                    'required', Password::min(8)->letters()->mixedCase()->numbers()->symbols()->uncompromised(),
                ],
                'created_at' => ['nullable', 'timezone:all'],
                'role' => ['required', 'string', 'exists:roles,role'],
            ];
        }

        // PUT
        return $rules;
    }
}
