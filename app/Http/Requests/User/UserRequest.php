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
                'nullable', 'string', 'email', 'max:255', 'unique:users',
            ],
            'password' => [
                'nullable', 'confirmed', Password::min(8)->letters()->mixedCase()->numbers()->symbols()->uncompromised(),
            ],
            'created_at' => ['nullable', 'timezone:all'],
        ];

        if ($httpVerb == 'POST') {
            return [
                'name' => $this->override_1st_item('required', $rules['name']),
                'last_name' => $rules['last_name'],
                'email' => $this->override_1st_item('required', $rules['email']),
                'password' => $this->override_1st_item('required', $rules['password']),
                'created_at' => $rules['created_at'],
                'role' => ['required', 'string', 'exists:roles,role'],
            ];
        }

        // PUT
        return $rules;
    }

    private function override_1st_item(array|string $new_items, array $target): array
    {
        array_shift($target);
        array_unshift($target, $new_items);

        return $target;
    }
}
