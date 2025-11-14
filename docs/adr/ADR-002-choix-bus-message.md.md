# ADR-001 : Choix du Message Bus pour SwapIt

**Date** : 10 Novembre 2025  
**Projet** : SwapIt (plateforme marketplace vêtements d'occasion)

---

## 1. Contexte et problème

### Le problème à résoudre

Pour SwapIt, j'ai conçu une architecture microservices. Le problème c'est que quand un utilisateur achète un article, plein de services doivent travailler ensemble :

1. Transaction Service crée la transaction
2. Payment Service traite le paiement
3. Catalog Service marque l'article comme vendu
4. Delivery Service prépare l'expédition
5. Notification Service prévient l'acheteur et le vendeur
6. Evaluation Service crée les demandes d'avis

Si je fais tout ça en HTTP synchrone (service A appelle service B, qui appelle service C...), ça pose plusieurs problèmes :

**Problème 1 : Couplage fort**
Si un service tombe, toute la chaîne est bloquée. Par exemple, si Delivery Service est down, la transaction ne peut pas continuer même si le paiement est OK.

**Problème 2 : Pics de charge**
Pendant les soldes ou le weekend, il peut y avoir 10x plus d'activité. Avec des appels HTTP synchrones, tout le monde attend tout le monde et ça ralentit.

**Problème 3 : Pas d'historique**
Si un truc se passe mal, c'est difficile de comprendre ce qui s'est passé. On ne peut pas "rejouer" les événements.

### Volumétrie estimée

Voici ce que j'ai estimé pour SwapIt (en me basant sur des plateformes similaires) :

| Flux | Volume/jour | Latence acceptable |
|------|-------------|-------------------|
| Publication d'article | ~50k | 5 secondes |
| Transaction complète | ~10k | 30 secondes |
| Messagerie | ~200k | 500ms |

---

## 2. Solutions envisagées

J'ai comparé 3 solutions de message bus.

### Option A : Apache Kafka

**Ce que c'est** : Une plateforme de streaming distribuée. Les messages sont stockés dans des "topics" et peuvent être lus par plusieurs consumers.

**Points positifs** :
- **Performance** : Peut gérer des millions de messages/seconde (largement suffisant pour nous)
- **Rétention** : Les messages sont gardés plusieurs jours. On peut les relire si besoin
- **Ordre garanti** : Les messages arrivent dans le bon ordre (important pour les transactions)
- **Rejeu** : On peut "rejouer" l'historique. Super utile pour debugger ou ajouter un nouveau service qui a besoin de rattraper l'historique
- **Écosystème** : Plein d'outils autour (Kafka Streams, Schema Registry, etc.)

**Points négatifs** :
- **Complexité** : C'est plus compliqué à installer et gérer (nécessite Zookeeper ou KRaft)
- **Courbe d'apprentissage** : Il faut comprendre les concepts de partitions, consumer groups, offsets...
- **Ressources** : Il faut minimum 3 brokers en production
- **Coût** : Plus cher (~1200€/mois avec AWS MSK)

---

### Option B : RabbitMQ

**Ce que c'est** : Un message broker traditionnel basé sur AMQP. Plus simple que Kafka.

**Points positifs** :
- **Simplicité** : Facile à installer et configurer
- **Patterns flexibles** : Supporte plusieurs modèles (pub/sub, work queues, routing)
- **Mature** : Existe depuis longtemps, très stable
- **Interface web** : Dashboard pour voir ce qui se passe
- **Latence faible** : Très rapide (<1ms)
- **Coût** : Moins cher (~500€/mois)

**Points négatifs** :
- **Performance** : ~50k messages/seconde (suffisant pour démarrer mais limité)
- **Pas d'historique** : Les messages sont supprimés une fois consommés. On ne peut pas les relire
- **Scalabilité** : Moins facile à scaler horizontalement que Kafka
- **Pas de rejeu** : Impossible de retraiter les événements passés

**Mon avis** : Parfait pour démarrer rapidement, mais on risque d'être limité si SwapIt grandit beaucoup.

---

### Option C : AWS EventBridge

**Ce que c'est** : Un service AWS serverless pour gérer les événements.

**Points positifs** :
- **Serverless** : Pas de serveur à gérer, AWS s'occupe de tout
- **Pay-as-you-go** : On paie que ce qu'on utilise
- **Intégration AWS** : Fonctionne bien avec Lambda, S3, SQS...
- **Filtrage** : On peut router les événements facilement

**Points négatifs** :
- **Vendor lock-in** : Si on veut changer de cloud plus tard, c'est compliqué
- **Latence** : 100-500ms en moyenne (trop lent pour le chat temps réel)
- **Limitations** : 10k événements/seconde (peut être augmenté mais c'est une soft limit)
- **Ordre non garanti** : Les messages peuvent arriver dans le désordre
- **Coût** : Moins cher (~300€/mois) mais avec des limitations

**Mon avis** : Pas adapté pour nous à cause de la latence et du manque de garantie d'ordre.

---

## 3. Comparaison

Voici un tableau récap :

| Critère | Kafka | RabbitMQ | EventBridge |
|---------|-------|----------|-------------|
| **Performance** | Excellente (1M+ msg/s) | Bonne (50k msg/s) | Limitée (10k msg/s) |
| **Latence** | ~10ms | <1ms | 100-500ms |
| **Complexité** | Élevée | Faible | Moyenne |
| **Scalabilité** | Excellente | Moyenne | Bonne |
| **Historique** | Oui (jours/semaines) | Non | Limité |
| **Ordre garanti** | Oui | Partiel | Non |
| **Rejeu** | Oui | Non | Limité |
| **Coût/mois** | ~1200€ | ~500€ | ~300€ |
| **Lock-in** | Non | Non | Oui (AWS) |

---

## 4. Décision : Apache Kafka

J'ai choisi **Apache Kafka** malgré sa complexité. Voici pourquoi.

### Raison 1 : Le rejeu des événements

C'est vraiment important pour plusieurs raisons :

**Audit** : Pour une plateforme avec des transactions financières, on doit pouvoir tracer tout ce qui s'est passé. Avec Kafka, tous les événements sont gardés, on peut les relire pour faire des audits.

**Ajout de nouveaux services** : Si on veut ajouter un service de détection de fraude plus tard, il pourra consommer tout l'historique des transactions pour apprendre. Avec RabbitMQ, on ne pourrait consommer que les nouveaux messages.

**Debug** : Si on a un bug, on peut rejouer les événements pour comprendre ce qui s'est passé.

---

### Raison 2 : L'ordre des événements

Pour les transactions, c'est critique que les événements arrivent dans le bon ordre :

```
1. PaymentCompleted (paiement OK)
2. ArticleSold (article marqué vendu)
3. DeliveryCreated (livraison créée)
4. NotificationSent (notifications envoyées)
```

Si les événements arrivent dans le désordre, on peut se retrouver avec une notification envoyée avant que le paiement soit validé. Kafka garantit l'ordre des messages dans une partition (en utilisant transactionId comme clé).

EventBridge ne garantit pas l'ordre. RabbitMQ le garantit seulement partiellement.

---

### Raison 3 : La scalabilité

Avec Kafka, si on a trop de messages, on peut juste ajouter des partitions et des consumers. C'est facile à scaler horizontalement.

Avec RabbitMQ, c'est plus compliqué. On est limité à ~50k msg/s par node.

---

### Raison 4 : L'écosystème

Kafka a plein d'outils autour :
- **Kafka Streams** : Pour faire du traitement temps réel
- **Schema Registry** : Pour valider automatiquement le format des messages
- **Kafka Connect** : Pour intégrer facilement avec d'autres systèmes

Ça nous donne des options pour évoluer.

---

### Les inconvénients que j'accepte

Je sais que Kafka a des défauts :

1. **C'est complexe** : Il faut que l'équipe apprenne Kafka. J'estime 2 jours de formation par dev.

2. **C'est plus cher** : 1200€/mois vs 500€ pour RabbitMQ. Mais je pense que ça vaut le coup pour la fiabilité.

3. **Monitoring** : Il faut mettre en place un monitoring complet (consumer lag, partitions, réplication).

Mais pour une plateforme comme SwapIt avec des transactions financières, je pense que c'est un bon investissement.

---

## 5. Conséquences

### Ce que ça apporte

**Flexibilité** : Si on veut ajouter un nouveau service (ex: système de recommandations), il peut consommer les événements sans qu'on ait à modifier les autres services.

**Fiabilité** : Avec 3 brokers et la réplication, si un broker tombe, ça continue de fonctionner.

**Audit** : On a tout l'historique des événements. C'est important pour la conformité (RGPD, etc.).

**Performance** : On peut gérer des pics de charge sans problème.

---

### Les défis

**Formation** : L'équipe doit apprendre Kafka. Concepts à maîtriser :
- Partitions
- Consumer groups
- Offsets
- Réplication

**Coût** : Budget mensuel plus élevé (1200€ vs 500€ pour RabbitMQ).

**Latence** : Kafka est un peu plus lent que RabbitMQ (~10ms vs <1ms). Mais pour des flux asynchrones, c'est acceptable.
