<?php

namespace App\Http\Requests\Job;

use App\Enums\Job\JobPlacement;
use App\Enums\Job\JobStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $method = $this->method();

        if ($method === 'POST') {
            return [
                'title' => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
                'location' => ['required', 'string', 'max:255'],
                'skills' => ['required', 'json'],
                'salary' => ['required', 'numeric', 'min:200'],
                'status' => ['required', Rule::enum(JobStatus::class)],
                'placement' => ['required', Rule::enum(JobPlacement::class)],
                'recruiter_id' => ['required', 'exists:users,id'],
            ];
        }

        if ($method === 'PUT') {
            return [
                'title' => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
                'location' => ['required', 'string', 'max:255'],
                'skills' => ['required', 'json'],
                'salary' => ['required', 'numeric', 'min:200'],
                'status' => ['required', Rule::enum(JobStatus::class)],
                'placement' => ['required', Rule::enum(JobPlacement::class)],
                'recruiter_id' => ['required', 'exists:users,id'],
            ];
        }
    }
}
