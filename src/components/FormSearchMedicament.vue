<script setup>
const denomination = "";

</script>

<template>
  <main class="container my-4">
    <form @submit.prevent="$emit('search', denomination)" class="card p-4 shadow-sm">
      <h2 class="mb-4 text-primary text-center">Recherche de médicament</h2>
      <div class="mb-3">
        <input type="text" v-model="denomination" class="form-control" placeholder="Nom du médicament" />
      </div>
      <div class="text-center">
        <button type="submit" id="submitRecherche" class="btn btn-primary">
          Rechercher
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped></style>
