# Changelog

Toutes les modifications notables de **ACF Field Name Revealer** sont documentées dans
ce fichier.

Le format s'appuie sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et le
projet suit le [Versionnage Sémantique](https://semver.org/lang/fr/).

## [1.0.0] - 2026-06-26

Première version publique.

### Ajouté

- Affichage du `data-name` (nom interne) de chaque champ ACF sous forme de badge
  `ACF: <nom>` à côté de son label, dans l'administration WordPress.
- Affichage optionnel du `data-key` (badge `key: field_…`) activable depuis le popup,
  désactivé par défaut.
- Copie de la valeur d'un badge (nom ou clé) dans le presse-papiers au clic.
- Prise en charge des champs chargés dynamiquement — **repeaters**, **flexible content**,
  onglets et groupes — via un `MutationObserver`.
- Exclusion des lignes « template » des repeaters (clones) et des `data-name` vides.
- Popup de l'extension avec deux interrupteurs (activation de l'affichage, affichage du
  `data-key`), préférences mémorisées via `chrome.storage.local`.
- Portée limitée aux pages d'administration WordPress (`*/wp-admin/*`).
- Icônes de l'extension (16/48/128 px) générées par script (`make_icons.py`).
- Documentation (`README.md`) avec capture d'écran, installation et personnalisation.

### Technique

- Manifest V3.
- Permission unique : `storage`.

[1.0.0]: https://troisdeuxun.ch
