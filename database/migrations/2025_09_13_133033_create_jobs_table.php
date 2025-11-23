<?php

use App\Enums\Job\ApplicationStatus;
use App\Enums\Job\InterviewStatus;
use App\Enums\Job\JobPlacement;
use App\Enums\Job\JobStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateJobsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employments', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('location');
            $table->json('skills');
            $table->string('salary', 24)->nullable();
            $table->enum('status', JobStatus::cases())->default(JobStatus::Draft);
            $table->enum('placement', JobPlacement::cases())->default(JobPlacement::Remote);
            $table->timestampsTz();
            $table->softDeletes();
            $table->foreignId('user_id')->constrained('users')->noActionOnDelete();
            $table->foreignId('recruiter_id')->constrained('users')->noActionOnDelete();
        });

        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index();
            $table->float('match_score')->default(0);
            $table->enum('status', ApplicationStatus::cases())->default(ApplicationStatus::Pending);
            $table->timestampsTz();
            $table->softDeletes();
            $table->foreignId('user_id')->constrained('users')->noActionOnDelete();
            $table->foreignId('employment_id')->constrained('employments')->noActionOnDelete();
        });

        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('link');
            $table->enum('was_confirmed', InterviewStatus::cases())->default(InterviewStatus::No);
            $table->timestampsTz();
            $table->softDeletes();
            $table->foreignId('application_id')->constrained('applications')->noActionOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interviews');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('employments');
    }
};
