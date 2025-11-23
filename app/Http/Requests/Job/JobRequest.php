<?php

namespace App\Http\Requests\Job;

use Illuminate\Foundation\Http\FormRequest;

class JobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'skills' => ['required', 'string', 'max:255'],
            'salary' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:255'],
            'placement' => ['required', 'string', 'max:255'],
            'recruiter_id' => ['required', 'integer'],
        ];
    }
}
