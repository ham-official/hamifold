<template>
  <div @dragenter.prevent="toggleActive" @dragleave.prevent="toggleActive" @dragover.prevent
    @drop.prevent="toggleActive" :class="{ 'active-dropzone': active }" class="dropzone">
    <span>Drag and Drop File</span>
    <span>OR</span>
    <CTA color="primary" class="cursor-pointer"><label for="dropzoneFile" class="cursor-pointer">Select File</label>
    </CTA>
    <input type="file" id="dropzoneFile" class="dropzoneFile" />
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "DropZone",
  setup() {
    const active = ref(false);

    const toggleActive = () => {
      active.value = !active.value;
    };

    return { active, toggleActive };
  },
};
</script>

<style scoped lang="css">
.dropzone {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  border: 2px dashed #039855;
  transition: 0.3s ease all;
  border-radius: 0.8rem;
}

/* .dropzone label {
  padding: 8px 12px;
  color: #fff;
  background-color: #039855;
  transition: 0.3s ease all;
} */

.dropzone input {
  display: none;
}

.active-dropzone {
  color: #fff;
  border-color: #fff;
  background-color: #039855;
}

/* .active-dropzone label {
  background-color: #fff;
  color: #039855;
} */
</style>