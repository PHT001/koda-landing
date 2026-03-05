# KODA — Guide de construction du template Notion

## Vue d'ensemble

Ce guide te permet de construire le template Notion "Koda" étape par étape. Chaque section décrit exactement quoi créer, avec les propriétés, les formules, et la structure. Tu n'as qu'à suivre dans l'ordre.

---

## ÉTAPE 1 — Créer l'espace de travail

1. Ouvre Notion → Crée une nouvelle page
2. Nomme-la **"🏠 Koda — Mon activité freelance"**
3. Ajoute une icône : émoji 🔥 ou le logo Koda
4. Ajoute une cover : utilise une image minimaliste sombre (unsplash.com, cherche "dark gradient abstract")
5. Cette page sera ta **page d'accueil / dashboard**

---

## ÉTAPE 2 — Créer les bases de données

Tu vas créer **6 bases de données** (en tant que pages séparées, puis tu les lieras au dashboard).

### Base de données 1 : 👥 Clients

Crée une base de données "Table" avec ces propriétés :

| Propriété | Type | Description |
|-----------|------|-------------|
| Nom | Titre | Nom du client |
| Statut | Sélection | Prospect / Devis envoyé / Actif / Terminé / Perdu |
| Email | Email | Email de contact |
| Téléphone | Téléphone | Numéro |
| Entreprise | Texte | Nom de l'entreprise |
| Secteur | Sélection | Tech / Marketing / Design / Commerce / Santé / Éducation / Autre |
| CA total | Nombre (€) | Chiffre d'affaires généré par ce client |
| Premier contact | Date | Date du premier contact |
| Notes | Texte | Notes libres |
| Projets | Relation | → vers la base "Projets" (à créer après) |
| Factures | Relation | → vers la base "Factures" |

**Vues à créer :**
- **Vue Table** (par défaut) — triée par Statut
- **Vue Kanban** — groupée par Statut (c'est ta vue CRM visuelle)
- **Vue Galerie** — pour un aperçu visuel de tes clients

---

### Base de données 2 : 📋 Projets

| Propriété | Type | Description |
|-----------|------|-------------|
| Nom du projet | Titre | Nom du projet |
| Client | Relation | → vers base "Clients" |
| Statut | Sélection | À venir / En cours / En review / Terminé / Annulé |
| Priorité | Sélection | Haute / Moyenne / Basse |
| Montant | Nombre (€) | Montant du projet |
| Date début | Date | Début du projet |
| Date fin | Date | Fin prévue |
| Acompte reçu | Case à cocher | Acompte payé oui/non |
| Livrable | Texte | Description du livrable |
| Factures | Relation | → vers base "Factures" |

**Vues à créer :**
- **Vue Table** — vue complète
- **Vue Kanban** — groupée par Statut
- **Vue Timeline** — par dates début/fin (vue Gantt)
- **Vue "En cours"** — filtre : Statut = En cours

---

### Base de données 3 : 🧾 Factures

| Propriété | Type | Description |
|-----------|------|-------------|
| Numéro facture | Titre | Format : KODA-2026-001 |
| Client | Relation | → vers base "Clients" |
| Projet | Relation | → vers base "Projets" |
| Montant HT | Nombre (€) | Montant hors taxes |
| TVA applicable | Case à cocher | Si franchise en base : décoché |
| Montant TTC | Formule | `if(prop("TVA applicable"), prop("Montant HT") * 1.2, prop("Montant HT"))` |
| Statut | Sélection | Brouillon / Envoyée / Payée / En retard / Annulée |
| Date d'émission | Date | Date d'envoi |
| Date d'échéance | Date | Date limite de paiement |
| Date de paiement | Date | Date effective du paiement |
| Jours de retard | Formule | `if(prop("Statut") == "Payée", 0, if(prop("Date d'échéance") < now(), dateBetween(now(), prop("Date d'échéance"), "days"), 0))` |
| Mode de paiement | Sélection | Virement / Carte / PayPal / Chèque |
| Notes | Texte | Notes internes |

**Vues à créer :**
- **Vue Table** — triée par date d'émission (récent en premier)
- **Vue "À encaisser"** — filtre : Statut = Envoyée ou En retard
- **Vue "En retard"** — filtre : Statut = En retard (mettre en rouge)
- **Vue Kanban** — groupée par Statut
- **Vue par mois** — groupée par Date d'émission (mois)

---

### Base de données 4 : 🏛️ Déclarations URSSAF

| Propriété | Type | Description |
|-----------|------|-------------|
| Période | Titre | Ex : "Mars 2026" ou "T1 2026" |
| Type | Sélection | Mensuelle / Trimestrielle |
| CA déclaré | Nombre (€) | Chiffre d'affaires de la période |
| Taux cotisations | Nombre (%) | 21.1% (prestation de service) ou 12.3% (vente) — à adapter |
| Cotisations dues | Formule | `prop("CA déclaré") * prop("Taux cotisations") / 100` |
| Date limite | Date | Date limite de déclaration |
| Déclaré | Case à cocher | Fait oui/non |
| Payé | Case à cocher | Payé oui/non |
| Notes | Texte | Notes |

**Vues :**
- **Vue Table** — triée par Date limite
- **Vue "À faire"** — filtre : Déclaré = non
- **Vue Calendrier** — par Date limite

---

### Base de données 5 : 💰 Dépenses (offre Pro et Business)

| Propriété | Type | Description |
|-----------|------|-------------|
| Description | Titre | Ex : "Abonnement Figma" |
| Catégorie | Sélection | Logiciels / Matériel / Formation / Déplacements / Repas / Comptabilité / Marketing / Autre |
| Montant | Nombre (€) | Montant de la dépense |
| Date | Date | Date de la dépense |
| Récurrent | Case à cocher | Dépense mensuelle récurrente ? |
| Justificatif | Fichier | Upload du justificatif |
| Notes | Texte | Notes |

**Vues :**
- **Vue Table** — triée par date
- **Vue par catégorie** — groupée par Catégorie
- **Vue "Récurrentes"** — filtre : Récurrent = oui

---

### Base de données 6 : 🎯 Objectifs (offre Pro et Business)

| Propriété | Type | Description |
|-----------|------|-------------|
| Objectif | Titre | Ex : "Atteindre 5000€ de CA en mars" |
| Type | Sélection | Revenu / Clients / Projets / Personnel |
| Période | Sélection | Mensuel / Trimestriel / Annuel |
| Valeur cible | Nombre | Objectif chiffré |
| Valeur actuelle | Nombre | Progression actuelle |
| Progression | Formule | `round(prop("Valeur actuelle") / prop("Valeur cible") * 100)` |
| Deadline | Date | Date limite |
| Atteint | Formule | `if(prop("Valeur actuelle") >= prop("Valeur cible"), true, false)` |

**Vues :**
- **Vue Table**
- **Vue "En cours"** — filtre : Atteint = non

---

## ÉTAPE 3 — Construire le Dashboard (page d'accueil)

Retourne sur ta page d'accueil "🏠 Koda". Structure-la comme suit :

### En-tête
```
🔥 Koda
Bienvenue [Prénom]. Voici le point sur ton activité.
```

### Bloc 1 — Vue d'ensemble rapide (callout blocks)
Crée 3 callouts côte à côte (utilise les colonnes Notion) :

- **📊 CA ce mois** — Ajoute une vue liée de "Factures" filtrée sur le mois en cours, Statut = Payée. Affiche la somme du Montant HT.
- **🧾 Factures en attente** — Vue liée de "Factures", filtre Statut = Envoyée ou En retard. Compte le nombre.
- **🎯 Objectif mensuel** — Vue liée de "Objectifs", filtre Période = Mensuel + mois en cours.

### Bloc 2 — Plafond Micro-entrepreneur
Crée un callout avec :
```
🏛️ Plafond Micro-entrepreneur 2026
Plafond annuel : 77 700 € (prestations de service) / 188 700 € (vente)
CA cumulé : [vue liée des factures payées de l'année]
```

### Bloc 3 — Actions rapides
Une section avec des liens internes :
- ➕ Nouveau client → lien vers base Clients
- ➕ Nouvelle facture → lien vers base Factures
- ➕ Nouvelle dépense → lien vers base Dépenses
- 📅 Mes déclarations URSSAF → lien vers base URSSAF

### Bloc 4 — Vues rapides
Ajoute des vues liées (linked views) :
- **Clients actifs** — vue liée de Clients, filtre Statut = Actif, vue Galerie
- **Projets en cours** — vue liée de Projets, filtre Statut = En cours, vue Table
- **Prochaines échéances** — vue liée de Factures, filtre Statut = Envoyée, triée par Date d'échéance

---

## ÉTAPE 4 — Modules supplémentaires (offre Business)

### Module : Gestion de sous-traitants
Crée une base de données "🤝 Sous-traitants" :

| Propriété | Type |
|-----------|------|
| Nom | Titre |
| Spécialité | Sélection |
| Tarif jour | Nombre (€) |
| Email | Email |
| Statut | Sélection : Disponible / Occupé / Inactif |
| Projets | Relation → Projets |
| Note qualité | Sélection : ⭐⭐⭐⭐⭐ |

### Module : Prévisionnel de trésorerie
Crée une base de données "📈 Prévisionnel" :

| Propriété | Type |
|-----------|------|
| Mois | Titre |
| Revenus prévus | Nombre (€) |
| Revenus réels | Nombre (€) |
| Dépenses prévues | Nombre (€) |
| Dépenses réelles | Nombre (€) |
| Solde prévu | Formule : `prop("Revenus prévus") - prop("Dépenses prévues")` |
| Solde réel | Formule : `prop("Revenus réels") - prop("Dépenses réelles")` |
| Écart | Formule : `prop("Solde réel") - prop("Solde prévu")` |

### Module : Kit passage en société
Crée une page "🏢 Kit passage en société" avec :
- Checklist EURL vs SASU (avantages/inconvénients)
- Seuils à surveiller (CA, TVA, etc.)
- Liste des démarches administratives
- Contacts utiles (CCI, expert-comptable, etc.)

---

## ÉTAPE 5 — Design et finitions

### Palette de couleurs recommandée
- Fond de callouts : gris foncé
- Accents : jaune/vert (cohérent avec le branding Koda)
- Statuts : Vert = OK / Jaune = Attention / Rouge = Urgent

### Icônes par section
- 🏠 Dashboard
- 👥 Clients
- 📋 Projets
- 🧾 Factures
- 🏛️ URSSAF
- 💰 Dépenses
- 🎯 Objectifs
- 🤝 Sous-traitants
- 📈 Prévisionnel

### Tips de design Notion
- Utilise les dividers (---) pour séparer les blocs
- Utilise les colonnes pour les vues côte à côte
- Ajoute des toggle headings pour les sections peu utilisées
- Mets les bases de données dans la sidebar (glisse-les dedans)

---

## ÉTAPE 6 — Préparer la livraison

### Pour chaque offre, voici ce que le client reçoit :

**Solo (19€)**
- Dashboard + Clients + Factures + URSSAF
- Guide de démarrage (ce document, version simplifiée)

**Pro (39€)**
- Tout Solo + Projets + Dépenses + Objectifs + Pipeline prospection
- Templates d'emails (relance facture, proposition commerciale, suivi projet)
- Guide complet

**Business (59€)**
- Tout Pro + Sous-traitants + Prévisionnel + Kit passage en société
- Workflows d'automatisation (guide pour connecter avec Notion API)
- Support email prioritaire
- Accès aux mises à jour futures

### Comment partager le template
1. Une fois le template terminé, clique sur "..." en haut à droite
2. "Duplicate as template" ou "Share" → "Publish as template"
3. Copie le lien de duplication
4. C'est ce lien que tu mets dans l'email post-achat Stripe

---

## ÉTAPE 7 — Configurer la livraison automatique Stripe

1. Va dans Stripe Dashboard → Paramètres du lien de paiement
2. Dans "Page de confirmation", mets un message personnalisé avec le lien Notion :
   ```
   Merci pour ton achat ! 🎉
   
   Clique ici pour dupliquer ton template Koda dans Notion :
   [LIEN NOTION ICI]
   
   Consulte le guide de démarrage joint pour commencer en 5 minutes.
   
   Une question ? Contacte-nous à [ton email]
   ```
3. Optionnel : configure un email automatique via Stripe (ou Zapier/Make) pour envoyer le lien par email aussi

---

## Récap — Checklist de lancement

- [ ] 6 bases de données créées avec toutes les propriétés
- [ ] Dashboard construit avec vues liées
- [ ] 3 versions du template (Solo / Pro / Business)
- [ ] Lien de duplication Notion généré pour chaque version
- [ ] 3 liens Stripe configurés avec page de confirmation
- [ ] Landing page en ligne
- [ ] Test d'achat effectué (utilise le mode test Stripe)
- [ ] Premier post LinkedIn/Twitter préparé

---

*Ce guide fait partie du kit Koda. Bonne construction !*
