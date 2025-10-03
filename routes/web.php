<?php

use App\Http\Controllers\Dashboard\JobController;
use App\Http\Controllers\Dashboard\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->prefix('dashboard')->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard/dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class)->names('dashboard.users');

    Route::resource('jobs', JobController::class)->names('dashboard.jobs');
});

// Route::middleware('auth')->group(function () {
Route::middleware([])
    ->prefix('dashboard')
    ->group(function () {
        // ROUTE: admin/dashboard
        // - Watch, Create, Update, Delete users by tabs (HR Manager, Recruiter, Applicant)
        // - Watch, Create, Update, Delete Jobs
        // --- Can assign, unassign a Recruiter to a Job
        // --- Can assign, unassign a Applicant to a Job
        // --- Can update a Job status (Draft, Published, Closed)
        // - Watch Analytics (Applicants Analytics, Jobs Analytics, Users Analytics)
        // Can see Notes, Emails, Interviews sent by his Recruiters to Applicants
        // Can Notify everyone about something important

        // ROUTE: hr-manager/dashboard
        // - Watch, Create, Update, Delete Recruiters
        // - Watch, Create, Update, Delete (ONLY OWN) Jobs
        // --- Can assign, unassign a Recruiter to a Job
        // --- Can update a Job status (Draft, Published, Closed)
        // - Can see all Applicants and their Applications
        // - Can see the performance of his Recruiters
        // --- Can see Notes, Emails, Interviews sent by his Recruiters to Applicants
        // - Watch Analytics (Applicants Analytics, Jobs Analytics, Recruiter Analytics)

        // ROUTE: recruiter/dashboard
        // - Watch Analytics
        // --- Counts (Total Applicants, Total Jobs, Total Applications, Total Interviews, Total Hired, Total Rejected)
        // - Watch, Update (ONLY OWN) Jobs
        // --- Update Job status (Draft, Published, Closed)
        // - Program Interviews
        // --- Send a email to the Applicant with the Interview Schedule
        // --- After Interview, Filter potential Applicants to Hire or Reject
        // --- Hire the best Applicant from the previous list and Close the Job
        // --- Reject the rest from the previous list
        // He is Notified when:
        // --- He is assigned to a new Job
        // --- A new Applicant applies to his assigned Job

        // ROUTE: applicant/dashboard
        // - Watch All applied Jobs
        // - Can Apply to a Job
        // --- Can Watch, Upload, Update, Delete his Resume
        // --- Can See the percentage of Match with the Job
        // --- Can see the amount of Applications for the Job
        // --- Can See the Interview Schedule
        // --- Can Accept or Decline the Interview
        // --- Can See the Interview Results
        // --- Can Leave the Application
        // He is Notified when:
        // --- A new Interview is scheduled
        // --- The Interview Results are available
        // --- Emails, Notes or Notifications is sent from the Recruiter
        // - Watch Analytics (Only own Applications)

        // ROUTE: public/jobs
        // - Applicants can Apply to a Job
        // --- Can Upload a Resume, but needs to create an account first
    });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
