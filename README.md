💊 Gestion de Pharmacie - Application Vue.js
Cette application web permet de gérer les médicaments d’une pharmacie : visualisation, ajout, modification, suppression, tri, recherche, et export PDF.

🚀 Fonctionnalités principales
✅ Afficher la liste des médicaments d'une pharmacie

➕ Ajouter un nouveau médicament

✏️ Modifier un médicament existant

❌ Supprimer un médicament

🔍 Rechercher un médicament par nom

🔃 Trier par quantité, nom ou forme pharmaceutique

📄 Télécharger la liste des médicaments en PDF

🛠️ Technologies utilisées
Vue 3

Bootstrap (Bootswatch Brite Theme)

jsPDF & jspdf-autotable

API REST publique : apipharmacie.pecatte.fr

📁 Structure des composants
App.vue : Point d'entrée de l'application

components/MedicamentList.vue : Composant principal contenant la logique métier

components/MedicamentItem.vue : Affichage d'un médicament individuel

components/FormAddMedicament.vue : Formulaire d'ajout

components/FormSearchMedicament.vue : Formulaire de recherche

components/FormChangeMedicament.vue : Formulaire de modification

Class/Medicament.js : Classe définissant le modèle Médicament

📄 Export PDF
Un bouton permet de générer un fichier PDF contenant la liste actuelle des médicaments affichés.
