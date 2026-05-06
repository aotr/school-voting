<?php

namespace App\Providers;

use Native\Laravel\Facades\Window;
use Native\Laravel\Facades\GlobalShortcut;
use Native\Laravel\Facades\Menu;
use Native\Laravel\Contracts\ProvidesPhpIni;

class NativeAppServiceProvider implements ProvidesPhpIni
{
    /**
     * Executed once the native application has been booted.
     * Use this method to open windows, register global shortcuts, etc.
     */
    public function boot(): void
    {
        // Open the Main Voter Window
        Window::open()
            ->title('School Voting System - EVM Terminal')
            ->width(1280)
            ->height(900)
            ->minWidth(1024)
            ->minHeight(768)
            ->showDevTools(false)
            ->rememberState();

        // Register a global shortcut to open the Admin Dashboard
        // Use Cmd+Option+A (Mac) or Ctrl+Alt+A (Windows/Linux)
        GlobalShortcut::key('CommandOrControl+Option+A')
            ->event(function () {
                $this->openAdminWindow();
            })
            ->register();

        // Configure the Application Menu
        Menu::create(
            Menu::app(),
            Menu::edit(),
            Menu::view(),
            Menu::window(),
            Menu::label('Admin'),
            Menu::link(route('admin.dashboard'), 'Admin Dashboard', 'CommandOrControl+Option+A')
        );
    }

    /**
     * Helper to open the Admin Window
     */
    protected function openAdminWindow(): void
    {
        Window::open('admin-dashboard')
            ->title('Admin Control Panel')
            ->route('admin.dashboard')
            ->width(1200)
            ->height(800)
            ->rememberState();
    }

    /**
     * Return an array of php.ini directives to be set.
     */
    public function phpIni(): array
    {
        return [
        ];
    }
}
