<script setup>
defineProps(["medicament", "index"]);
</script>

<template>
  <div class="card mb-3 shadow-sm">
    <div class="row g-0 align-items-center">
      <div class="col-md-2 text-center">
        <img :src="medicament.photo" alt="Photo du médicament" class="img-fluid rounded-start"
          style="max-height: 100px; object-fit: contain;" />
      </div>
      <div class="col-md-10">
        <div class="card-body">
          <h5 class="card-title text-primary">{{ medicament.nom }}</h5>
          <p class="card-text">{{ medicament.displayMedicament() }}</p>
          <div class="btn-group" role="group">
            <button class="btn btn-outline-danger btn-sm" @click="$emit('deletemedicament', medicament)">
              Supprimer
            </button>
            <button class="btn btn-outline-success btn-sm" @click="$emit('addquantity', medicament)">
              +1
            </button>
            <button class="btn btn-outline-warning btn-sm" @click="$emit('reducequantity', medicament)">
              -1
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>