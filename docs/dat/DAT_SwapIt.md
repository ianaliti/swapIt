# Dossier d'Architecture Technique (DAT) - SwapIt

**Projet** : SwapIt - Plateforme marketplace vêtements d'occasion  
**Date** : Novembre 2025  

---

## Documents de référence

Ce DAT s'appuie sur les diagrammes suivants :
- Modélisation des entités : `SwapITRelations.drawio.pdf`
- Architecture microservices : `microservices.drawio.pdf`
- Saga Pattern : `saga_pattern.drawio.pdf`
- ADR Message Bus : `swapit_adr_message_bus.md`

---

# 1. Couche Fonctionnelle

## 1.1 Processus métiers principaux

### Acteurs du système

**Acteurs principaux** :
- Vendeur : Publie des articles
- Acheteur : Recherche et achète
- Administrateur : Modération de la plateforme

**Systèmes externes** :
- Stripe (paiements)
- Colissimo (livraison)
- SendGrid (emails)

---

### P1 : Publication d'un article

Quand un vendeur veut publier un article, voici comment ça se passe :

1. Le vendeur remplit le formulaire (titre, prix, photos, catégorie)
2. Les photos sont uploadées sur S3
3. Le Catalog Service enregistre l'article dans MongoDB
4. Un événement `ArticlePublished` est publié dans Kafka
5. Le Search Service indexe l'article dans Elasticsearch (pour la recherche)
6. Le Notification Service envoie une notif aux followers du vendeur

Tout passe par Kafka pour que les services ne soient pas couplés.

---

### P2 : Transaction d'achat (Saga Pattern)

C'est le flux le plus complexe. J'ai implémenté un Saga Pattern parce qu'on a plusieurs services qui doivent collaborer et il faut gérer les échecs.

**Flux normal** (voir diagramme `saga_pattern.drawio.pdf`) :

```
1. L'acheteur clique "Acheter"
   → Transaction Service crée la transaction (Status: PENDING)
   → Publie TransactionCreated dans Kafka

2. Payment Service reçoit l'événement
   → Appelle Stripe pour débiter l'acheteur
   → Si OK, crédite le wallet du vendeur
   → Publie PaymentCompleted

3. Delivery Service reçoit PaymentCompleted
   → Génère une étiquette Colissimo
   → Publie DeliveryCreated

4. Catalog Service reçoit PaymentCompleted
   → Met l'article en statut SOLD
   → Publie ArticleSold

5. Transaction Service voit que tout est OK
   → Met la transaction en COMPLETED

6. Notification Service envoie les emails/push
```

**Compensation en cas d'échec** :

Si le paiement échoue, il faut tout annuler. J'ai mis en place des compensations automatiques :

```
Payment Service → PaymentFailed

→ Compensation :
  1. Transaction → CANCELLED
  2. Notification → Email à l'acheteur "Paiement échoué"
  3. Catalog → Article remis en AVAILABLE
```

J'ai aussi géré le cas où le vendeur n'expédie pas : après 3 jours, auto-refund automatique.

**Pourquoi le Saga Pattern ?**

J'ai choisi cette approche parce qu'avec des microservices, on ne peut pas utiliser de transaction classique (genre BEGIN/COMMIT en SQL). Chaque service a sa propre base de données. Le Saga permet de coordonner tout ça avec des événements et de compenser si ça échoue.

---

### P3 : Recherche d'articles

Le flux de recherche est plus simple :

1. L'utilisateur tape sa recherche (ex: "iana li 201)
2. Le Search Service check d'abord Redis (cache)
3. Si pas en cache → requête Elasticsearch
4. Filtres appliqués (prix, catégorie, localisation)
5. Résultats triés par pertinence

J'ai mis un cache Redis parce que les mêmes recherches reviennent souvent (ex: "iana" ou "li"). Ça évite de taper Elasticsearch à chaque fois.

---

## 1.2 Entités métier

Voir le diagramme complet dans `SwapITRelations.drawio.pdf`.

J'ai identifié 11 entités principales :

| Entité | Description |
|--------|-------------|
| User | Utilisateur (acheteur/vendeur), avec wallet intégré |
| Article | Annonce de vêtement/accessoire |
| Transaction | Le processus d'achat complet |
| Payment | Paiement Stripe ou Wallet |
| Delivery | Livraison avec tracking |
| Conversation | Canal de messagerie entre 2 users |
| Message | Message dans une conversation |
| Evaluation | Note/avis après transaction |
| Favorite | Articles mis en favoris |
| Notification | Notifications push/email |
| Wallet | Solde de l'utilisateur |

**Relations importantes** :
- 1 User → N Articles (un vendeur peut avoir plein d'articles)
- 1 Article → 0 ou 1 Transaction (un article ne peut être vendu qu'une fois)
- 1 Transaction → 1 Payment (relation 1:1)
- 1 Transaction → 1 Delivery (relation 1:1)

**Règles métier** :
- Un article SOLD ne peut plus être acheté
- Chaque transaction peut avoir 2 évaluations max (acheteur + vendeur)
- Pour acheter, l'acheteur doit avoir assez dans son wallet

---

## 1.3 Bounded Contexts et microservices

Voir le diagramme dans `microservices.drawio.pdf`.

J'ai découpé en 11 bounded contexts (Domain-Driven Design) :

| Context | Service | Responsabilité |
|---------|---------|----------------|
| Identity | User Service | Auth, profil, wallet |
| Catalog | Catalog Service | CRUD articles |
| Discovery | Search Service | Recherche, recommandations |
| Transaction | Transaction Service | Orchestration Saga |
| Payment | Payment Service | Paiements |
| Delivery | Delivery Service | Livraison |
| Communication | Messaging, Notification | Chat, notifs |
| Reputation | Evaluation Service | Notes, avis |
| Personalization | Favorite Service | Favoris |
| Moderation | Moderation Service | Admin |

Chaque service a sa propre base de données (pattern "Database per service"). C'est important pour garder les services indépendants.

---

# 2. Couche Applicative

## 2.1 Rôle des microservices

### User Service

**Responsabilité** : Gestion des utilisateurs, authentification, wallet

**APIs principales** :
- POST /users/register
- POST /users/login (retourne un JWT)
- GET /users/{id}
- PUT /users/{id}/profile
- GET /users/{id}/wallet

**Événements** :
- Publie : UserRegistered, WalletBalanceChanged
- Consomme : PaymentCompleted (pour créditer le wallet vendeur)

**Base de données** : PostgreSQL


### Catalog Service

**Responsabilité** : Gestion du catalogue d'articles

**APIs** :
- POST /articles
- GET /articles/{id}
- PUT /articles/{id}
- DELETE /articles/{id}

**Événements** :
- Publie : ArticlePublished, ArticleUpdated, ArticleSold
- Consomme : PaymentCompleted (pour marquer SOLD)

**Base de données** : MongoDB + Redis (cache)

**Pourquoi MongoDB ?** Les articles ont des attributs différents selon la catégorie. Par exemple :
- Vêtement : taille (S, M, L), couleur
- Chaussure : pointure (36, 37, 38)
- Sac : dimensions

Avec MongoDB, je peux avoir des attributs flexibles sans faire des migrations à chaque fois. C'est plus simple que d'avoir plein de tables en PostgreSQL.

---

### Transaction Service (Orchestrateur)

**Responsabilité** : Coordonner toute la transaction (Saga)

**APIs** :
- POST /transactions
- GET /transactions/{id}
- PATCH /transactions/{id}/cancel

**Événements** :
- Publie : TransactionCreated, TransactionCompleted, TransactionCancelled
- Consomme : PaymentCompleted, PaymentFailed, DeliveryCreated, ArticleSold

C'est lui qui orchestre tout le Saga. Il écoute tous les événements et décide quoi faire ensuite.

**Base de données** : PostgreSQL (besoin de cohérence forte pour les transactions)

---

### Payment Service

**Responsabilité** : Gérer les paiements

**APIs** :
- POST /payments
- POST /payments/{id}/refund

**Événements** :
- Publie : PaymentCompleted, PaymentFailed, PaymentRefunded
- Consomme : TransactionCreated

**Intégrations** : Stripe API (paiement carte) + Wallet interne

**Base de données** : PostgreSQL (les paiements c'est critique, il faut de la cohérence)

---

### Autres services (résumé)

- **Delivery Service** : Génère étiquettes Colissimo, tracking (PostgreSQL)
- **Search Service** : Recherche full-text avec Elasticsearch
- **Messaging Service** : Chat WebSocket temps réel (MongoDB)
- **Notification Service** : Push + Email (MongoDB)
- **Evaluation Service** : Notes et avis (PostgreSQL)
- **Favorite Service** : Gestion favoris (Redis + PostgreSQL)
- **Moderation Service** : Admin et signalements (PostgreSQL)

---

## 2.2 Communication asynchrone (Kafka)

Voir l'ADR complet dans `swapit_adr_message_bus.md` pour comprendre pourquoi j'ai choisi Kafka.

### Architecture

Tous les services communiquent via Kafka pour les événements métier. C'est le cœur de l'architecture.

```
Service A → Kafka (publie événement)
           ↓
Service B ← Kafka (consomme événement)
```

### Configuration Kafka

- 3 brokers (haute dispo)
- Réplication factor : 3
- Rétention : 7 jours
- 6 partitions pour les topics critiques

### Topics

- `user-events`
- `article-events`
- `transaction-events`
- `payment-events`
- `delivery-events`
- `notification-events`

**Pourquoi Kafka et pas RabbitMQ ou EventBridge ?**

J'ai comparé 3 options dans l'ADR. Voici le tableau de comparaison :

| Critère | Kafka | RabbitMQ | EventBridge |
|---------|-------|----------|-------------|
| **Performance** | Excellente (1M+ msg/s) | Bonne (50k msg/s) | Limitée (10k msg/s) |
| **Latence** | ~10ms | <1ms | 100-500ms |
| **Complexité** | Élevée | Faible | Moyenne |
| **Historique** | Oui | Non | Limité |
| **Ordre garanti** | Oui | Partiel | Non |
| **Rejeu** | Oui | Non | Limité |
| **Coût/mois** | ~1200€ | ~500€ | ~300€ |
| **Lock-in** | Non | Non | Oui (AWS) |

**Pourquoi Kafka ?**

Les 3 raisons principales :
1. **Rejeu** : Je peux relire l'historique complet (important pour audits et debug)
2. **Ordre garanti** : Critique pour les transactions financières
3. **Scalabilité** : Gère les pics de charge (soldes, weekends)

**Pourquoi pas les autres ?**
- **RabbitMQ** : Plus simple et moins cher, mais pas d'historique ni de rejeu
- **EventBridge** : Serverless et moins cher, mais latence trop élevée et vendor lock-in

**Compromis** : Kafka est plus complexe et plus cher, mais ça vaut le coup pour SwapIt avec des transactions financières.

---

## 2.3 Saga Pattern - Détails techniques

Le Saga Pattern c'est compliqué à implémenter correctement. Voici ce que j'ai fait :

### Idempotence

Chaque service doit gérer l'idempotence (si on reçoit 2 fois le même événement, on fait l'action qu'une seule fois).

Exemple dans Payment Service :
```
On check si un payment existe déjà avec cet ID transaction
Si oui → on retourne le résultat existant
Si non → on crée le payment
```

### Compensation

Chaque étape du Saga a une compensation définie :

| Étape | Compensation |
|-------|--------------|
| CreateTransaction | CancelTransaction |
| ProcessPayment | RefundPayment |
| CreateDelivery | CancelDelivery |
| MarkArticleSold | ReleaseArticle |

Quand une étape échoue, on execute les compensations en ordre inverse.

---

## 2.4 Gestion des erreurs

### Retry

Si un service tombe temporairement, on retry avec un backoff :
- 1ère tentative : immédiat
- 2e tentative : attendre 1 seconde
- 3e tentative : attendre 2 secondes

Après 3 échecs → Dead Letter Queue (DLQ) pour analyse manuelle.

### Circuit Breaker

Si un service externe (ex: Stripe) a trop d'erreurs, on ouvre le circuit pour éviter de le spammer. Après un timeout, on réessaye.

---

# 3. Couche Infrastructure

## 3.1 Composants techniques

### API Gateway

J'ai mis un API Gateway devant tous les services pour :
- Authentification centralisée (JWT)
- Rate limiting (100 req/min par user)
- Routage vers les bons services

Technologie : AWS API Gateway (ou Kong en alternative open-source)

---

### Message Bus

Apache Kafka (via AWS MSK)

Configuration :
- 3 brokers Kafka
- Réplication ×3
- Stockage : 1TB par broker

---

### Bases de données

**PostgreSQL** (AWS RDS) :
- Utilisé par : User, Transaction, Payment, Delivery, Evaluation, Favorite, Moderation
- Configuration : Multi-AZ pour la haute dispo
- Backups quotidiens

**MongoDB** (Atlas) :
- Utilisé par : Catalog, Messaging, Notification
- Pourquoi : Schéma flexible

**Elasticsearch** :
- Utilisé par : Search Service
- Index : articles

**Redis** :
- Cache pour tout le monde
- Sessions JWT

---

### Stockage

AWS S3 pour les photos (articles, profils) + CloudFront CDN pour accélérer le chargement.

---

## 3.2 Stack technique

**Décision** : J'ai choisi Node.js + TypeScript pour tous les services.

**Pourquoi ?**
- Cohérence : tout le monde parle le même langage (pas besoin d'apprendre Java ou Python)
- Async I/O : Parfait pour des microservices event-driven (pas de blocage)
- npm : Plein de libs disponibles (Kafka, Stripe, AWS SDK)
- Équipe : On connaît déjà JavaScript (j'ai fait des projets avec avant)

**Frameworks** :
- Express pour les APIs REST
- Socket.io pour le chat WebSocket
- Prisma pour PostgreSQL
- Mongoose pour MongoDB

---

## 3.3 Déploiement

### Cloud : AWS

Région : eu-west-1 (Ireland)

**Architecture Multi-AZ** :
- 2 Availability Zones (1a et 1b)
- Si une AZ tombe, l'autre prend le relai

### Kubernetes (EKS)

J'ai déployé tout sur Kubernetes :
- 12 nodes (6 par AZ)
- Type : t3.xlarge (4 vCPU, 16GB RAM)
- Auto-scaling : 3 à 30 pods par service selon la charge

**Pourquoi Kubernetes ?**
- Facilite le déploiement
- Auto-scaling automatique
- Self-healing (si un pod crash, il redémarre)

### Docker

Chaque service a son Dockerfile. J'utilise des multi-stage builds pour réduire la taille des images.

---

## 3.4 Sécurité

### Authentification

JWT (JSON Web Tokens) :
- Validé au niveau de l'API Gateway
- Expiration : 24h
- Refresh token : 30 jours

### Chiffrement

- **Transit** : TLS 1.3 partout (HTTPS)
- **At rest** : Bases de données chiffrées (AES-256)
- **Passwords** : bcrypt

### RGPD

- Droit à l'oubli : endpoint DELETE /users/{id}/data
- Export des données : endpoint GET /users/{id}/data/export
- Rétention : 3 ans max, après suppression auto

### Protection

AWS WAF pour protéger contre les attaques (DDoS, SQL injection, XSS).

---

# 4. Couche Opérationnelle

## 4.1 CI/CD

J'ai mis en place un pipeline GitLab CI + ArgoCD :

**Étapes** :
1. Push code → GitLab
2. Tests automatiques (unit + integration)
3. Build Docker image
4. Scan de sécurité (Trivy pour les vulnérabilités)
5. Push vers AWS ECR
6. ArgoCD déploie automatiquement sur staging
7. Déploiement manuel sur prod (après validation)

**Rollback** : Si un déploiement pose problème, rollback en 1 clic via ArgoCD.

---

## 4.2 Monitoring

### Logs (ELK Stack)

Tous les logs sont centralisés dans Elasticsearch. On peut les consulter via Kibana pour voir ce qui se passe et débugger si besoin.


### Métriques (Prometheus + Grafana)

Je monitore :
- **Système** : CPU, RAM, Disk
- **Application** : Temps de réponse, taux d'erreur
- **Métier** : Nombre de transactions/jour, articles publiés

### Alertes

- **Critiques** (PagerDuty) : Service down, erreur rate > 5%
- **Importantes** (Slack) : CPU > 80%
- **Info** (Email) : Déploiement réussi

---

## 4.3 Scalabilité

### Auto-scaling

Kubernetes auto-scale les pods selon la charge :
- Catalog Service : 5 à 20 pods (selon CPU)
- Search Service : 3 à 15 pods (selon le nombre de requêtes)
- Notification Service : 5 à 30 pods (selon la queue depth)

### Cache

J'ai mis du cache à plusieurs niveaux :
1. CDN (CloudFront) pour les images (7 jours)
2. API Gateway pour les GET fréquents (5 min)
3. Redis pour les données chaudes (variable)

Résultat : Je vise 70% de cache hit rate pour réduire la charge sur les bases de données.

### Base de données

Si besoin, on peut ajouter des read replicas PostgreSQL pour scaler les lectures.

---

## 4.4 Résilience

### Circuit Breaker

Si Stripe a trop d'erreurs, j'ouvre le circuit pour éviter de le bombarder. Après 30 secondes, on réessaye.

### Retry

3 tentatives avec backoff exponentiel pour les erreurs temporaires.

### Timeout

- Appels externes : 5s max
- Inter-services : 3s max

---

## 4.5 Maintenance

### Backups

- PostgreSQL : Snapshots quotidiens (7 jours de rétention)
- MongoDB : Point-in-time recovery continu
- Test de restore : Chaque semaine

### Disaster Recovery

- **RTO** (Recovery Time) : 1 heure
- **RPO** (Recovery Point) : 15 minutes

Si une région AWS tombe, on peut restaurer depuis les backups.

---

## 4.6 Coûts

Budget mensuel estimé (pour 100k utilisateurs) :

| Composant | Coût/mois (approximatif) |
|-----------|--------------------------|
| EKS (Kubernetes) | ~1500€ |
| RDS PostgreSQL | ~400€ |
| MongoDB Atlas | ~200€ |
| Kafka (MSK) | ~600€ |
| S3 + CloudFront | ~150€ |
| Elasticsearch | ~300€ |
| Autres (monitoring, etc.) | ~300€ |
| **Total** | **~3500€/mois** |

Ces chiffres sont approximatifs. Ça peut varier beaucoup selon l'utilisation réelle (nombre de requêtes, volume de données, etc.).

Pour économiser un peu :
- Reserved Instances : On peut réduire de 30% en réservant des instances pour 1 an
- Spot Instances : Pour les jobs non-critiques (mais ça peut être interrompu, donc attention)




