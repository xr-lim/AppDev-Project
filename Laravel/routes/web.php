<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// ------------------------------
// Welcome / Home Page
// ------------------------------

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// ------------------------------
// Authentication Pages (React)
// ------------------------------

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

Route::post('/logout', function () {
    auth()->logout();
    return redirect('/login');
})->name('logout');

// ------------------------------
// After login → Admin Dashboard
// ------------------------------
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

