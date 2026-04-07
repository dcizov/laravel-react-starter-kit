<p align="center">
  <img src="https://gist.githubusercontent.com/dcizov/752fc1f7b6e233a83317d5ed84c93634/raw/bf9918e8642de0ec4e405aef23e6e7effaee9e20/laravel-react-logo.svg" width="400" alt="Laravel + React">
</p>

---

# Laravel + React Starter Kit

## Introduction

A React starter kit provides a robust, modern starting point for building Laravel applications with a React frontend using [Inertia](https://inertiajs.com).

Inertia allows you to build modern, single-page React applications using classic server-side routing and controllers — combining the frontend power of React with the backend productivity of Laravel and lightning-fast Vite compilation.

This starter kit uses React 19, TypeScript, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com), and [base-ui](https://base-ui.com/), with PostgreSQL and [Laravel Sail](https://laravel.com/docs/sail) for local development. It ships with role-based access control via [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission) and a tasks feature as a working CRUD reference.

---

## Features

- **Authentication** — login, registration, password reset, email verification, and two-factor authentication via Laravel Fortify
- **Role-based access control** — roles, permissions, and user management pages powered by Spatie Laravel Permission
- **Tasks management** — full CRUD with bulk operations as a reference feature
- **Data table** — reusable component with sorting, filtering, pagination, and column visibility
- **Reusable dialogs** — delete and bulk-delete confirmation dialogs

---

## Requirements

- [Docker](https://www.docker.com/) — required for Laravel Sail
- **PHP 8.4+ & Composer** — only needed if bootstrapping without Docker

---

## Installation

> [!NOTE]
> `vendor/bin/sail` doesn't exist in a freshly cloned repo until Composer dependencies are installed.
> Choose the method below that matches your local setup.

### Without PHP (Docker only)

```bash
git clone https://github.com/dcizov/laravel-react-starter-kit.git
cd laravel-react-starter-kit

cp .env.example .env

docker run --rm \
  -u "$(id -u):$(id -g)" \
  -v "$(pwd):/var/www/html" \
  -w /var/www/html \
  laravelsail/php85-composer:latest \
  composer install --ignore-platform-reqs
```

### With PHP & Composer

```bash
git clone https://github.com/dcizov/laravel-react-starter-kit.git
cd laravel-react-starter-kit

cp .env.example .env
composer install
```

---

## Starting the Dev Environment

```bash
sail up -d
sail artisan key:generate
sail artisan migrate
sail pnpm install
sail pnpm dev
```

The app will be available at [**http://localhost**](http://localhost).

> [!TIP]
> Add a shell alias so you don't have to type `vendor/bin/sail` every time:
>
> ```bash
> alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'
> ```
>
> Add it to your `~/.bashrc` or `~/.zshrc` and restart your shell.

---

## Developer Tools

The following tools are pre-configured and active in the local development environment:

- **[Laravel Debugbar](https://github.com/barryvdh/laravel-debugbar)** — in-browser debug toolbar for queries, requests, and performance profiling. Available automatically when `APP_DEBUG=true`.
- **[Laravel IDE Helper](https://github.com/barryvdh/laravel-ide-helper)** — generates PHPDoc annotations and meta files for IDE autocompletion. Runs automatically via Composer post-update hook.
- **[Husky](https://typicode.github.io/husky/) + [Commitlint](https://commitlint.js.org/)** — enforces [Conventional Commits](https://www.conventionalcommits.org/) via git hooks.
- **[lint-staged](https://github.com/lint-staged/lint-staged)** — runs ESLint and Prettier only on staged files before each commit.
- **[Xdebug](https://xdebug.org/)** — available in the Sail container for step debugging and test coverage.

---

## CI / Code Quality

Two GitHub Actions workflows ship with the kit:

- **tests** — runs the full PHPUnit suite against a PHP 8.3 / 8.4 / 8.5 matrix on every push and pull request.
- **lint** — runs Pint, Prettier, and ESLint on every push and pull request.

---

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
