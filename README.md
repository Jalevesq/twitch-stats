# StreamerHub 🎮

Une plateforme d'analytics et d'engagement pour les streamers Twitch. Connectez votre chaîne, suivez vos statistiques et développez votre communauté.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [Services](#services)
- [Base de données](#base-de-données)
- [Authentification](#authentification)
- [Installation](#installation)
- [Développement](#développement)
- [Production](#production)

## Aperçu

StreamerHub est composé de trois services principaux qui travaillent ensemble pour fournir une solution complète d'analytics pour les streamers Twitch :

1. **Website** - Interface utilisateur Next.js pour visualiser les statistiques
2. **Twitch Bot** - Bot Python qui capture les événements Twitch en temps réel
3. **Database** - PostgreSQL (container local en dev, Supabase en production)

## Technologies

### Frontend (Website)

| Technologie | Version | Description |
|-------------|---------|-------------|
| **Next.js** | 16.1.1 | Framework React avec SSR et App Router |
| **React** | 19.2.3 | Bibliothèque UI |
| **TypeScript** | 5.9.3 | Typage statique |
| **Tailwind CSS** | 4.x | Framework CSS utility-first |
| **Prisma** | 7.2.0 | ORM pour PostgreSQL |
| **NextAuth.js** | 5.0.0-beta | Authentification OAuth |
| **Recharts** | 2.15.4 | Graphiques et visualisations |
| **Sonner** | 2.0.7 | Notifications toast |
| **Radix UI** | - | Composants accessibles |

### Backend (Twitch Bot)

| Technologie | Version | Description |
|-------------|---------|-------------|
| **Python** | 3.12 | Langage de programmation |
| **PostgreSQL Driver** | - | Connexion à la base de données |

### Infrastructure

| Technologie | Version | Description |
|-------------|---------|-------------|
| **PostgreSQL** | 18.1 | Base de données locale (développement) |
| **Supabase** | - | Base de données PostgreSQL hébergée (production) |
| **Docker** | - | Conteneurisation |
| **Docker Compose** | - | Orchestration des services |
| **Nginx** | Alpine | Reverse proxy (production) |
| **Certbot** | - | Certificats SSL Let's Encrypt |

## Architecture

### Environnement de développement

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DOCKER NETWORK                                │
│                      (streamhub-network)                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────┐   │
│  │   WEBSITE     │  │  TWITCH-BOT   │  │      DATABASE         │   │
│  │   (Next.js)   │  │   (Python)    │  │    (PostgreSQL)       │   │
│  │   Port 3000   │  │               │  │     Port 5432         │   │
│  │               │  │               │  │     Container         │   │
│  │  ┌─────────┐  │  │  ┌─────────┐  │  │                       │   │
│  │  │ NextAuth│  │  │  │ Twitch  │  │  │  ┌─────────────────┐  │   │
│  │  │ + Prisma│──┼──┼──│   API   │──┼──┼──│  Tables:        │  │   │
│  │  └─────────┘  │  │  │ Client  │  │  │  │  - Users        │  │   │
│  │               │  │  └─────────┘  │  │  │  - Sessions     │  │   │
│  │  ┌─────────┐  │  │               │  │  │  - Follows      │  │   │
│  │  │  React  │  │  │               │  │  │  - Subs         │  │   │
│  │  │   UI    │  │  │               │  │  │  - Cheers...    │  │   │
│  │  └─────────┘  │  │               │  │  └─────────────────┘  │   │
│  └───────────────┘  └───────────────┘  └───────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Environnement de production

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TWITCH API                                   │
│              EventSub Webhooks + Helix API + OAuth                  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│       TWITCH-BOT          │   │         WEBSITE           │
│        (Python)           │   │        (Next.js)          │
│                           │   │                           │
│  Écoute EventSub:         │   │  OAuth Authentication:    │
│  - Follows                │   │  - Login Twitch           │
│  - Subscriptions          │   │  - Récupération profil    │
│  - Cheers                 │   │                           │
│  - Streams                │   │  Affichage:               │
│  - Raids                  │   │  - Dashboard analytics    │
│  - Redemptions            │   │  - Graphiques             │
└─────────────┬─────────────┘   └─────────────┬─────────────┘
              │                               │
              │     ┌─────────────────┐       │
              │     │     NGINX       │       │
              │     │  Port 80 → 443  │◄──────┤ (reverse proxy)
              │     │  SSL + Proxy    │       │
              │     └─────────────────┘       │
              │                               │
              └───────────────┬───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                     │
│                    (PostgreSQL hébergé)                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Tables: Users, Sessions, Accounts,                           │  │
│  │  twitch_follows, twitch_subscriptions, twitch_cheers,         │  │
│  │  twitch_streams, twitch_raids, twitch_redemptions...          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Flux de communication :**
- **Website → Twitch API** : Authentification OAuth (login utilisateur)
- **Twitch API → Twitch Bot** : EventSub webhooks (événements en temps réel)
- **Website → Supabase** : Lecture des données pour affichage
- **Twitch Bot → Supabase** : Écriture des événements capturés

## Structure du projet

```
streamerhub/
├── database/
│   └── .env.template          # Variables d'environnement PostgreSQL
│
├── docker-compose/
│   ├── docker-compose.dev.yml # Configuration développement
│   └── docker-compose.prd.yml # Configuration production
│
├── nginx/
│   └── nginx.conf             # Configuration reverse proxy
│
├── certbot/
│   ├── conf/                  # Certificats SSL
│   └── www/                   # Challenge ACME
│
├── script/
│   └── start_prd.sh           # Script de déploiement
│
├── twitch-bot/
│   ├── app/
│   │   └── main.py            # Point d'entrée du bot
│   ├── docker/
│   │   ├── dev.Dockerfile
│   │   └── prd.Dockerfile
│   ├── requirements.txt
│   └── .env
│
└── website/
    ├── app/
    │   ├── (protected)/       # Routes authentifiées
    │   │   ├── dashboard/     # Page analytics
    │   │   └── chatbot/       # ChatBot (coming soon)
    │   ├── (public)/          # Routes publiques
    │   │   └── page.tsx       # Landing page
    │   ├── _components/       # Composants réutilisables
    │   ├── _lib/              # Utilitaires
    │   ├── _server/           # Logique serveur (auth)
    │   ├── api/               # Routes API
    │   └── layout.tsx         # Layout racine
    ├── prisma/
    │   ├── schema.prisma      # Schéma de la BDD
    │   └── migrations/        # Migrations SQL
    ├── docker/
    │   ├── dev.Dockerfile
    │   └── prd.Dockerfile
    └── .env.template
```

## Services

### 1. Website (Next.js)

Le frontend est une application Next.js 16 utilisant l'App Router avec les fonctionnalités suivantes :

**Pages protégées** (`/dashboard`, `/chatbot`)
- Requièrent une authentification Twitch
- Redirection automatique vers la page d'accueil si non connecté
- Sidebar de navigation

**Pages publiques** (`/`)
- Landing page avec présentation des fonctionnalités
- Bouton de connexion Twitch OAuth

**Composants principaux**
- `StatsCard` - Cartes de statistiques (followers, subs, viewers, watch hours)
- `FollowersChart` - Graphique d'évolution des followers/subscribers
- `PeriodSelector` - Sélecteur de période (jour, semaine, mois, all-time)

### 2. Twitch Bot (Python)

Bot Python qui se connecte à l'API Twitch pour capturer les événements en temps réel :

| Événement | Table | Description |
|-----------|-------|-------------|
| Follow | `twitch_follows` | Nouveau follower |
| Subscribe | `twitch_subscriptions` | Nouvel abonnement (+ gifts) |
| Cheer | `twitch_cheers` | Bits envoyés |
| Stream Online/Offline | `twitch_streams` | Début/fin de stream |
| Raid | `twitch_raids` | Raid reçu |
| Channel Point Redemption | `twitch_redemptions` | Points de chaîne utilisés |
| Channel Update | `twitch_channel_updates` | Changement titre/catégorie |

### 3. Database (PostgreSQL / Supabase)

**Développement** : Container PostgreSQL local inclus dans le docker-compose.dev.yml

**Production** : Base de données PostgreSQL hébergée sur [Supabase](https://supabase.com), offrant :
- Haute disponibilité
- Backups automatiques
- Interface d'administration
- Connection pooling

Base de données relationnelle avec les tables suivantes :

**Tables d'authentification (NextAuth)**
- `User` - Utilisateurs
- `Account` - Comptes OAuth liés
- `Session` - Sessions actives

**Tables Twitch**
- `twitch_follows` - Historique des follows
- `twitch_subscriptions` - Historique des abonnements
- `twitch_cheers` - Historique des bits
- `twitch_streams` - Historique des streams
- `twitch_raids` - Historique des raids
- `twitch_redemptions` - Historique des récompenses
- `twitch_channel_updates` - Historique des changements de chaîne

## Base de données

### Schéma Prisma

```prisma
model User {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  isValid       Boolean   @default(true)
  accounts      Account[]
  sessions      Session[]
}

model TwitchFollow {
  id           String   @id @db.Uuid
  channelId    String
  followerId   String
  followerName String
  followedAt   DateTime
  createdAt    DateTime @default(now())
}

// ... autres modèles similaires
```

### Migrations

Les migrations sont gérées par Prisma et stockées dans `website/prisma/migrations/`.

```bash
# Générer une migration
npx prisma migrate dev --name <nom_migration>

# Appliquer les migrations
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate
```

## Authentification

L'authentification utilise NextAuth.js v5 avec le provider Twitch :

### Flux OAuth

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│ NextAuth │────▶│  Twitch  │────▶│ Callback │
│          │     │ /signIn  │     │  OAuth   │     │ /api/auth│
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                         │
                                                         ▼
                                                   ┌──────────┐
                                                   │  Prisma  │
                                                   │ Adapter  │
                                                   │ (Create/ │
                                                   │  Update) │
                                                   └──────────┘
```

### Scopes Twitch demandés

```
openid
user:read:email
bits:read
channel:read:goals
channel:read:hype_train
channel:read:polls
channel:read:predictions
channel:read:subscriptions
channel:read:vips
channel:read:redemptions
moderator:read:followers
```

## Installation

### Prérequis

- Docker et Docker Compose
- Node.js 22+ (pour le développement local)
- Python 3.12+ (pour le développement local)

### Configuration

1. **Cloner le repository**
```bash
git clone <repository-url>
cd streamerhub
```

2. **Configurer les variables d'environnement**

```bash
# Database
cp database/.env.template database/.env

# Website
cp website/.env.template website/.env
# Remplir TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, AUTH_SECRET

# Twitch Bot
cp twitch-bot/.env.template twitch-bot/.env
```

3. **Obtenir les credentials Twitch**
    - Créer une application sur [Twitch Developer Console](https://dev.twitch.tv/console)
    - Configurer l'URL de redirection OAuth
    - Copier le Client ID et Client Secret

## Développement

### Lancer l'environnement de développement

```bash
cd docker-compose
docker compose -f docker-compose.dev.yml up -d
```

Cela démarre :
- **PostgreSQL** sur le port `5432` (container local)
- **Website** sur le port `3000` (avec hot reload)
- **Twitch Bot**

### Accès

- Website : http://localhost:3000
- Base de données locale : `postgresql://postgres:admin123admin@localhost:5432/website-db`

### Commandes utiles

```bash
# Voir les logs
docker compose -f docker-compose.dev.yml logs -f website
docker compose -f docker-compose.dev.yml logs -f twitch-bot

# Reconstruire un service
docker compose -f docker-compose.dev.yml build website

# Arrêter tous les services
docker compose -f docker-compose.dev.yml down

# Supprimer les volumes (reset BDD)
docker compose -f docker-compose.dev.yml down -v
```

## Production

### Base de données Supabase

En production, la base de données est hébergée sur Supabase. La variable `DATABASE_URL` dans les fichiers `.env` doit pointer vers l'instance Supabase :

```
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
```

> **Note** : Le fichier `docker-compose.prd.yml` ne contient pas de service `database` car la base de données est externe (Supabase).

### Configuration Nginx

Le fichier `nginx/nginx.conf` configure :
- Redirection HTTP → HTTPS
- Terminaison SSL avec Let's Encrypt
- Reverse proxy vers le container website
- Headers de proxy (X-Real-IP, X-Forwarded-For, etc.)

### Déploiement

```bash
./script/start_prd.sh
```

Ce script :
1. Pull les dernières modifications git
2. Pull les images Docker les plus récentes
3. Démarre les services
4. Redémarre Nginx

### Renouvellement SSL

```bash
docker compose -f docker-compose.prd.yml run --rm certbot renew
docker compose -f docker-compose.prd.yml restart nginx
```

## Flux de données

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TWITCH PLATFORM                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │ EventSub        │  │ Helix API       │  │ OAuth 2.0       │     │
│  │ Webhooks        │  │ (REST)          │  │ Authentication  │     │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘     │
└───────────┼────────────────────┼────────────────────┼───────────────┘
            │                    │                    │
            ▼                    │                    ▼
┌───────────────────────────┐    │    ┌───────────────────────────────┐
│  TWITCH BOT (Python)      │    │    │  WEBSITE (Next.js)            │
│  ┌─────────────────────┐  │    │    │  ┌─────────────────────────┐  │
│  │ Event Handlers      │  │    │    │  │ NextAuth.js             │  │
│  │ - on_follow()       │  │    │    │  │ - OAuth login           │  │
│  │ - on_subscribe()    │  │    │    │  │ - Session management    │  │
│  │ - on_cheer()        │  │    │    │  └─────────────────────────┘  │
│  │ - on_stream()       │  │    │    │                               │
│  │ - on_raid()         │  │    │    │  ┌─────────────────────────┐  │
│  └──────────┬──────────┘  │    │    │  │ Prisma ORM              │  │
│             │ INSERT      │    │    │  │ - Query aggregations    │  │
└─────────────┼─────────────┘    │    │  │ - Time-series data      │  │
              │                  │    │  └────────────┬────────────┘  │
              │                  │    │               │ SELECT        │
              │                  │    │  ┌────────────▼────────────┐  │
              │                  │    │  │ React Components        │  │
              │                  │    │  │ - StatsCard             │  │
              │                  │    │  │ - FollowersChart        │  │
              │                  │    │  │ - Dashboard             │  │
              │                  │    │  └─────────────────────────┘  │
              │                  │    └───────────────┬───────────────┘
              │                  │                    │
              └──────────────────┼────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  POSTGRESQL (Dev: Container local | Prod: Supabase)                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Tables:                                                       │  │
│  │ - User, Account, Session (auth)                               │  │
│  │ - twitch_follows, twitch_subscriptions, twitch_cheers         │  │
│  │ - twitch_streams, twitch_raids, twitch_redemptions            │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Résumé des interactions :**

| Source | Destination | Action |
|--------|-------------|--------|
| Utilisateur | Website | Clic "Login with Twitch" |
| Website | Twitch OAuth | Redirection authentification |
| Twitch OAuth | Website | Callback avec tokens |
| Website | PostgreSQL | Stockage session/user |
| Twitch EventSub | Twitch Bot | Push événements (follow, sub, etc.) |
| Twitch Bot | PostgreSQL | INSERT événements |
| Website | PostgreSQL | SELECT pour affichage dashboard |

## Variables d'environnement

### Website (.env)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `TWITCH_CLIENT_ID` | ID de l'application Twitch | `abc123...` |
| `TWITCH_CLIENT_SECRET` | Secret de l'application Twitch | `xyz789...` |
| `TWITCH_REDIRECT_URI` | URL de callback OAuth | `http://localhost:3000` |
| `TWITCH_SCOPES` | Scopes OAuth demandés | `openid user:read:email...` |
| `DATABASE_URL` | URL de connexion PostgreSQL | Dev: `postgresql://postgres:admin123admin@database:5432/website-db`<br>Prod: URL Supabase |
| `AUTH_SECRET` | Secret pour NextAuth | `npx auth secret` |
| `AUTH_URL` | URL de base (production) | `https://streamerhub.ca` |
| `AUTH_TRUST_HOST` | Trust le host (production) | `true` |

### Database (.env)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `POSTGRES_DB` | Nom de la base de données | `website-db` |
| `POSTGRES_USER` | Utilisateur PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | `admin123admin` |

## Licence

Ce projet est développé par [Jacob Levesque](https://github.com/Jalevesq).