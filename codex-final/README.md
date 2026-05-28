# MediCare+ Final - Frontend React Native

Ce dossier contient le frontend final ajoute sur une branche separee pour ne pas modifier le projet principal du depot.

## Contenu

- `mobile/`: application React Native Expo MediCare+.
- `docs/screenshots/`: captures du rendu du projet.
- `docs/reference-screenshots/`: captures de reference fournies pour le style visuel.

## Lancer

```powershell
cd codex-final/mobile
npm install
npm start
```

L'application consomme l'API Spring Boot sur `http://localhost:8080/api`.
Sur un telephone physique, remplacer `localhost` dans `mobile/src/api.ts` par l'adresse IP du PC.
