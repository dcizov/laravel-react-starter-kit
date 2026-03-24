<p align="center">
  <img src="https://gist.githubusercontent.com/dcizov/752fc1f7b6e233a83317d5ed84c93634/raw/bf9918e8642de0ec4e405aef23e6e7effaee9e20/laravel-react-logo.svg" width="400" alt="Laravel + React">
</p>

---

## About This Starter Kit

This React starter kit provides a robust, modern starting point for building Laravel applications with a React frontend using [Inertia](https://inertiajs.com).

Inertia allows you to build modern, single-page React applications using classic server-side routing and controllers — combining the frontend power of React with the backend productivity of Laravel and lightning-fast Vite compilation.

### Tech Stack

| Layer      | Technology                                                                                                                                                                                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Backend    | Laravel — [routing](https://laravel.com/docs/routing), [IoC container](https://laravel.com/docs/container), [Eloquent ORM](https://laravel.com/docs/eloquent), [migrations](https://laravel.com/docs/migrations), [queues](https://laravel.com/docs/queues), [broadcasting](https://laravel.com/docs/broadcasting) |
| Frontend   | React 19, TypeScript, Tailwind CSS                                                                                                                                                                                                                                                                                 |
| Components | [shadcn/ui](https://ui.shadcn.com) and [base-ui](https://base-ui.com/)                                                                                                                                                                                                                                             |

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

- [Starter Kits](https://laravel.com/docs/starter-kits)
- [Laravel](https://laravel.com/docs)
- [Laravel Sail](https://laravel.com/docs/sail)
- [Laravel Learn](https://laravel.com/learn)
- [Laracasts](https://laracasts.com) — thousands of video tutorials on Laravel, PHP, testing, and JavaScript

---

## Contributing

Thank you for considering contributing! Please read the [contribution guide](https://laravel.com/docs/contributions).

## Code of Conduct

Please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability, please e-mail Taylor Otwell at [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
