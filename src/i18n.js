import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/Fr.json';
import en from './locales/En.json';
import camfranglais from './locales/Camfranglais.json';
import esp from './locales/Esp.json';
import mandarin from './locales/Mandarin.json';

i18n.init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    cam: { translation: camfranglais },
    esp: { translation: esp },     // Ajout de l'Espagnol
    zh: { translation: mandarin }  // Ajout du Mandarin
  },
  // ... reste de la configuration
});