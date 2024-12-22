
# Epistelle

Epistelle is a simple blog platform built with Next.js, Supabase, and Tailwind CSS. It enables users to create, manage, and share blogs seamlessly with premium and non-premium user distinctions.

## Features

### Public Features
- Explore public blogs.
- View blog details.
- Access `About Us` and `Contact Us` pages.

### User Features
- Register and log in.
- Manage personal blogs (Create, Edit, Delete).

### Premium Features
- Unlimited blog posts.

### Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase
- **Payment Integration**: Stripe

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Folder Structure](#folder-structure)
4. [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/nathija-nimantha/epistelle.git
    ```

2. Navigate to the project directory:

    ```bash
    cd epistelle
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up Supabase:
   - Create a Supabase project.
   - Copy the `supabase` credentials into `.env.local`:

     ```env
     NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
     SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
     ```

5. Set up Stripe:
   - Obtain a Stripe API key and update `.env.local`:

     ```env
     STRIPE_SECRET_KEY=<your-stripe-secret-key>
     ```

6. Run the development server:

    ```bash
    npm run dev
    ```

7. Open the app in your browser at [http://localhost:3000](http://localhost:3000).

## Usage

### Non-Premium Users
- Limited to creating 5 blogs.
- Upgrade to premium for unlimited blogging.

### Premium Users
- Post unlimited blogs.

## Folder Structure

```
epistelle/
├── app/
│   ├── about-us/
│   ├── contact-us/
│   ├── public-blogs/
│   │   ├── [id]/
│   ├── your-blogs/
│   │   ├── [id]/
│   │   │   ├── edit/
│   │   ├── new/
├── components/
│   ├── side-nav-bar.tsx
├── utils/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   ├── globals.css
├── .env.local
├── package.json
└── README.md
```

---

Happy blogging with **Epistelle**!
