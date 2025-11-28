<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Job extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'employments';

    protected $fillable = [
        'title',
        'description',
        'location',
        'skills',
        'salary',
        'status',
        'user_id',
        'placement',
        'recruiter_id',
        'created_at',
        'updated_at',
    ];

    protected $hidden = [];

    // ***********************
    // RELATIONSHIPS
    // ***********************
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function recruiter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recruiter_id', 'id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'employment_id', 'id');
    }
}
