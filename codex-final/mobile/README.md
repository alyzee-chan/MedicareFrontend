# MediCare+ Mobile

Frontend React Native avec Expo pour la super-app MediCare+.

L'interface reprend le style des maquettes fournies:

- fond medical bleu tres clair;
- accueil avec recherche, boutons carres et barre de navigation basse;
- ecran pharmacies proches avec carte stylisee;
- ecran ordonnance avec QR code;
- parcours consultation video, assistant IA, Mobile Money et SOS.

## Lancer

```bash
cd mobile
npm install
npm start
```

L'app appelle l'API Spring Boot sur `http://localhost:8080/api`. Si l'API n'est pas lancee, elle reste utilisable avec des donnees de demonstration.
