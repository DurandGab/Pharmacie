<script setup>
import { onMounted, reactive, ref } from 'vue'
import MedicamentItem from './MedicamentItem.vue';
import Medicament from '../Class/Medicament.js'
import FormAddMedicament from './FormAddMedicament.vue';
import FormSearchMedicament from './FormSearchMedicament.vue';
import FormChangeMedicament from './FormChangeMedicament.vue';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const medicaments = reactive([])
const idPharmacie = 3
const isAscendingQuantity = ref(true)
const isAscendingDenomination = ref(true)
const isAscendingFormePharmaceutique = ref(true)
const succesMessage = ref('')


// Fonction pour obtenir l'URL de l'image du médicament
function getImageUrl(photo) {
  return `https://apipharmacie.pecatte.fr/images/${photo}`
}

// Affiche les médicaments de la pharmacie
function getMedicaments() {
  const url = `https://apipharmacie.pecatte.fr/api/${idPharmacie}/medicaments`
  const myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json")
  const fetchOptions = {
    method: "GET",
    headers: myHeaders,
  }
  fetch(url, fetchOptions)
    .then(response => response.json())
    .then(dataJson => {
      medicaments.length = 0 //Ici on vide le tableau medicaments avant de le remplir
      dataJson.forEach(med => {
        let m = new Medicament(med.id, med.denomination, med.formepharmaceutique, getImageUrl(med.photo), med.qte)
        medicaments.push(m)
      })
    })
    .catch(error => {
      console.error("Erreur de chargement :", error)
    })
}
onMounted(() => {
  getMedicaments()
})

//fonction pour trier les médicaments par quantité
function sortMedicamentsByQuantity() {
  //.sort() trie le tableau medicaments par dénomination
  medicaments.sort((a, b) => {
    return isAscendingQuantity.value ? a.qte - b.qte : b.qte - a.qte
  })
  isAscendingQuantity.value = !isAscendingQuantity.value // Inverse l'ordre pour le prochain clic
}

//fonction pour trier les médicaments par dénomination
function sortMedicamentsByDenomination() {
  // en utilisant la méthode localeCompare pour comparer les chaînes de caractères
  medicaments.sort((a, b) => {
    return isAscendingDenomination.value ? a.denomination.localeCompare(b.denomination) : b.denomination.localeCompare(a.denomination)
  })
  isAscendingDenomination.value = !isAscendingDenomination.value // Inverse l'ordre pour le prochain clic
}

//fonction pour trier les médicaments par leurs formes pharmaceutiques
function sortMedicamentsByFormePharmaceutique() {
  medicaments.sort((a, b) => {
    return isAscendingFormePharmaceutique.value ? a.formepharmaceutique.localeCompare(b.formepharmaceutique) : b.formepharmaceutique.localeCompare(a.formepharmaceutique)
  })
  isAscendingFormePharmaceutique.value = !isAscendingDenomination.value // Inverse l'ordre pour le prochain clic
}

//focntion pour effacer les filtres
function clearFilters() {
  getMedicaments() // Recharge tous les médicaments
}

// Fonction pour télécharger la liste des médicaments en PDF
function downloadMedicamentsPDF() {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('Liste des médicaments', 14, 22)

  const headers = [['Dénomination', 'Forme pharmaceutique', 'Quantité']]
  const rows = medicaments.map(m => [
    m.denomination,
    m.formepharmaceutique,
    m.qte.toString()
  ])

  autoTable(doc, {
    startY: 30,
    head: headers,
    body: rows,
  })

  doc.save('medicaments.pdf')
}

// Recherche de médicaments par dénomination
function searchMedicaments(denomination) {
  const url = `https://apipharmacie.pecatte.fr/api/${idPharmacie}/medicaments?search=${denomination}`
  const myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json")
  const fetchOptions = {
    method: "GET",
    headers: myHeaders,
  }

  fetch(url, fetchOptions)
    .then(response => response.json())
    .then(dataJson => {
      console.log(dataJson)
      medicaments.length = 0
      dataJson.forEach(med => {
        let m = new Medicament(med.id, med.denomination, med.formepharmaceutique, getImageUrl(med.photo), med.qte)
        medicaments.push(m)
      })
    })
    .catch(error => {
      console.error("Erreur de recherche :", error)
    })
}


// Ajoute une quantité au médicament
function addQuantityMedicament(medicament) {
  const url = `https://apipharmacie.pecatte.fr/api/${idPharmacie}/medicaments`;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const fetchOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify({
      id: medicament.id,
      qte: medicament.qte + 1
    })
  };

  fetch(url, fetchOptions)
    .then(response => response.json())
    .then(dataJson => {
      getMedicaments();
    })
    .catch(err => {
      console.error("Erreur :", err);
      alert("Échec de l'ajout de quantité.");
    });
}

// Réduit une quantité du médicament
function reduceQuantityMedicament(medicament) {
  const newQte = medicament.qte - 1;
  const url = `https://apipharmacie.pecatte.fr/api/${idPharmacie}/medicaments`;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const fetchOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify({
      id: medicament.id,
      qte: newQte
    })
  };

  fetch(url, fetchOptions)
    .then(response => response.json())
    .then(dataJson => {
      // Si la nouvelle quantité est inférieure ou égale à 0, on supprime le médicament
      if (newQte <= 0) {
        deleteMedicament(medicament);
      } else {
        getMedicaments(); // Met à jour la quantité localement
      }

    })
    .catch(err => {
      console.error("Erreur :", err);
      alert("Échec de la réduction de quantité.");
    });
}

// Ajoute un médicament à la pharmacie
function addMedicament(denomination, formepharmaceutique, quantite, photo) {
  //condition pour vérifier si le nom du médicament est unique 
  if (medicaments.some(m => m.denomination.toLowerCase() === denomination.toLowerCase())) {
    alert("Un médicament avec ce nom existe déjà.");
    return;
  }else{
    console.log("Ajout du médicament :", denomination, formepharmaceutique, quantite, photo);
    const url = `https://apipharmacie.pecatte.fr/api/${idPharmacie}/medicaments`;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const fetchOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      denomination: denomination,
      formepharmaceutique: formepharmaceutique,
      qte: quantite,
      photo: photo
    })
  };

  fetch(url, fetchOptions)
    .then(response => response.json())
    .then((dataJson) => {
      let m = new Medicament(dataJson.id, dataJson.denomination, dataJson.formepharmaceutique, getImageUrl(dataJson.photo), dataJson.qte);
      medicaments.push(m);
      getMedicaments();
      window.scrollTo(0, 0); // Remonte en haut de la page
      showSuccessMessage("Le médicament à été ajouté avec succès !");
    })
    .catch(err => {
      console.error("Erreur :", err);
      alert("Échec de l'ajout du médicament.");
    });
  }
}


// Modifie un médicament existant
function changeMedicament(medicamentUpdate, photo) {
  const url = `https://apipharmacie.pecatte.fr/api/${idPharmacie}/medicaments`;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  console.log("médicament")
  console.log(medicamentUpdate.id);
  const fetchOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify({
      id: medicamentUpdate.id,
      denomination: medicamentUpdate.denomination,
      formepharmaceutique: medicamentUpdate.formepharmaceutique,
      qte: medicamentUpdate.qte,
      photo: photo
    })
  };

  fetch(url, fetchOptions)
    .then(response => response.json())
    .then((dataJson) => {
      getMedicaments();
      window.scrollTo(0, 0); // Remonte en haut de la page
      showSuccessMessage("Le médicament à été modifié avec succès !");
    })
    .catch(err => {
      console.error("Erreur :", err);
      alert("Échec de la modification du médicament.");
    });
}

// Supprime un médicament de la pharmacie
function deleteMedicament(medicament) {
  const url = `https://apipharmacie.pecatte.fr/api/${idPharmacie}/medicaments/${medicament.id}`;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const fetchOptions = {
    method: "DELETE",
    headers: myHeaders,
  };
  fetch(url, fetchOptions)
    .then(response => {
      return response.json();
    })
    .then((dataJson) => {
      medicaments.splice(medicament, 1);
      getMedicaments();
      window.scrollTo(0, 0); // Remonte en haut de la page
      showSuccessMessage("Le médicament à été supprimé avec succès !");
    })
}

// Fonction qui va définir le message de succès
function showSuccessMessage(message) {
  succesMessage.value = message
  setTimeout(() => {
    succesMessage.value = null
  }, 3000)
}

</script>

<template>
  <main class="container my-5">
    <div v-if="succesMessage" class="alert alert-success text-center">
      {{ succesMessage }}
    </div>
    <!-- bouton de téléchargement -->
    <h3 class="mb-3 text-center text-secondary">Liste des médicaments</h3>
    <div class="text-center mb-4">
      <button class="btn btn-success" @click="downloadMedicamentsPDF">
        Télécharger la liste en PDF
      </button>
    </div>

    <!-- Boutons de tri -->
    <div class="d-flex justify-content-center flex-wrap gap-2 mb-4">
      <button class="btn btn-primary" @click="sortMedicamentsByQuantity">
        Trier par quantité {{ isAscendingQuantity ? '↓' : '↑' }}
      </button>

      <button class="btn btn-secondary" @click="sortMedicamentsByDenomination">
        Trier par dénomination {{ isAscendingDenomination ? 'de A à Z' : 'de Z à A' }}
      </button>

      <button class="btn btn-info" @click="sortMedicamentsByFormePharmaceutique">
        Trier par forme pharmaceutique {{ isAscendingFormePharmaceutique ? 'de A à Z' : 'de Z à A' }}
      </button>

      <button class="btn btn-danger" @click="clearFilters">
        Effacer les filtres
      </button>
    </div>

    <!-- Liste des médicaments -->
    <ul class="list-group">
      <MedicamentItem v-for="(medicament, index) in medicaments" :key="medicament.id" :index="index"
        :medicament="medicament" @deletemedicament="deleteMedicament"
        @addquantity="addQuantityMedicament" @reducequantity="reduceQuantityMedicament"
        class="list-group-item mb-3 rounded" />
    </ul>
    <!-- Formulaires -->
    <div class="row mb-5 gx-4">
      <div class="col-md-4">
        <FormSearchMedicament @search="searchMedicaments" />
      </div>
      <div class="col-md-4">
        <FormAddMedicament @add="addMedicament" />
      </div>
      <div class="col-md-4">
        <FormChangeMedicament :medicament="medicaments" @maj="changeMedicament" />
      </div>
    </div>
  </main>
</template>

<style scoped></style>