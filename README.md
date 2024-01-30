# Cookbase

Recipe organizer for families

## How it works

Add your favorite recipes and organize them by meal type and cuisine. Invite family members to collaborate on recipes.

## About

A side project by me, [Simon Wallström](https://simonwallstrom.com/). I have searched high and low for a decent recipe manager with support for multiple users but found nothing of note. This is my attempt to make a simple version with collaboration in mind from day one.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

If making changes to the database schema, run:

```sh
npx prisma db push
```

_This will update the local Postgres db to reflect the prisma schema file._

## Deployment

If you've made any changes to the Prisma schema, remember to create a migration file by running:

```sh
npx prisma migrate dev
```

Then to deploy run:

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

## Access remote database via proxy

Open a separate terminal tab and run:

```sh
flyctl proxy 15432:5432 -a <fly-db-name>
```