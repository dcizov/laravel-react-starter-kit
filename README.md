<p align="center">
  <img src="https://gist.githubusercontent.com/dcizov/752fc1f7b6e233a83317d5ed84c93634/raw/bf9918e8642de0ec4e405aef23e6e7effaee9e20/laravel-react-logo.svg" width="400" alt="Laravel + React">
</p>

---

# Laravel + React Starter Kit

## Introduction

A React starter kit provides a robust, modern starting point for building Laravel applications with a React frontend using [Inertia](https://inertiajs.com).

Inertia allows you to build modern, single-page React applications using classic server-side routing and controllers — combining the frontend power of React with the backend productivity of Laravel and lightning-fast Vite compilation.

This starter kit uses React 19, TypeScript, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com), and [base-ui](https://base-ui.com/), with PostgreSQL and [Laravel Sail](https://laravel.com/docs/sail) for local development.

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
git clone https://github.com/dcizov/laravel-react-inertia.git
cd laravel-react-inertia

cp .env.example .env

docker run --rm \
  -u "$(id -u):$(id -g)" \
  -v "$(pwd):/var/www/html" \
  -w /var/www/html \
  laravelsail/php84-composer:latest \
  composer install --ignore-platform-reqs
```

### With PHP & Composer

```bash
git clone https://github.com/dcizov/laravel-react-inertia.git
cd laravel-react-inertia

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

## Documentation

This is not an official Laravel starter kit, but the [official React starter kit docs](https://laravel.com/docs/starter-kits) largely apply. Additional resources:

- [Laravel](https://laravel.com/docs)
- [Laravel Learn](https://laravel.com/learn)
- [Laracasts](https://laracasts.com) — thousands of video tutorials on Laravel, PHP, testing, and JavaScript

---

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
