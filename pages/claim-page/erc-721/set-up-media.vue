<template>
  <main class="container mx-auto pb-16">
    <ol class="flex items-center gap-6 justify-center my-6">
      <li>
        <NuxtLink to="/claim-page/erc-721/select-contract">
          1. Select contract
        </NuxtLink>
      </li>
      <li class="font-bold">2. Set up Media</li>
      <li>
        <NuxtLink to="/claim-page/erc-721/set-up-mint-page">
          3. Set up Mint Page
        </NuxtLink>
      </li>
      <li>4. Set mint rules</li>
      <li>5. Set Audience</li>
    </ol>
    <Stepper :steps="stepper.steps" :currentStep="1" class="mb-6" />
    <section class="bg-white border-2 border-gray-900 ham-shadow--active rounded-3xl p-6 mx-auto">
      <p class="uppercase text-gray-700 text-display-sm font-semibold font-display">set up media</p>
      <p class="text-md text-gray-500 mb-8">Upload media, add artwork detail</p>
      <DropZone @drop.prevent="drop" @change="selectedFile" class="my-3" />
      <form v-if="dropzoneFileImage" @submit.prevent="handleSave" class="flex gap-2">
        <section class="w-64">
          <div class="w-full h-auto rounded-lg overflow-hidden">
            <img ref="fileImage" :src="dropzoneFileImage" class="w-full h-full object-cover" />
          </div>
          <span class="file-info">File: {{ dropzoneFile.name }}</span>
        </section>
        <section class="flex-1 text-gray-900 flex flex-col gap-3">
          <div class="flex flex-col gap-2">
            <label for="title" class="">Add a Title</label>
            <input id="title" type="text" v-model="title" placeholder="e.g. Replicator"
              class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="description" class="">Description</label>
            <input id="description" type="text" v-model="description" placeholder="e.g. May 2023"
              class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="created-by" class="">Created By</label>
            <input id="created-by" type="text" v-model="createdBy" placeholder="e.g. the media creator"
              class="bg-transparent px-3 py-1.5 border border-gray-900 rounded-xl" />
          </div>
          <div class="flex justify-end items-center gap-4">
            <NuxtLink to="/claim-page/erc-721/select-contract">
              <CTA size="lg" color="gray">Previous </CTA>
            </NuxtLink>
            <CTA @click="handleSave" color="primary" cta-type="submit" size="lg" :disabled="!formIsValid">Save & Next
            </CTA>
          </div>
        </section>
      </form>
    </section>
  </main>
</template>

<script>
import { ref } from "vue";
import steps from "@/data/stepper.json"
definePageMeta({
  middleware: ["auth"],
});
export default {
  setup() {
    let dropzoneFile = ref("");

    const drop = (e) => {
      dropzoneFile.value = e.dataTransfer.files[0];
    };

    const selectedFile = () => {
      dropzoneFile.value = document.querySelector(".dropzoneFile").files[0];
    };

    return { dropzoneFile, drop, selectedFile };
  },
  data() {
    return {
      title: null,
      description: null,
      createdBy: null,
      imageSrc: null,
    };
  },
  computed: {
    dropzoneFileImage() {
      if (this.dropzoneFile) {
        const imageSrc = URL.createObjectURL(this.dropzoneFile);
        return imageSrc;
      }
      if (this.imageSrc) {
        return this.imageSrc
      }
      return;
    },
    formIsValid() {
      return (
        this.title &&
        this.description &&
        this.createdBy &&
        testRegex(patterns.notEmptyString, this.title) &&
        testRegex(patterns.notEmptyString, this.description) &&
        testRegex(patterns.notEmptyString, this.createdBy)
      );
    },
    stepper() {
      return steps
    }
  },
  mounted() {
    const mediaFileFromStorage = localStorage.getItem('claimPageMediaFile');
    if (mediaFileFromStorage) {
      this.imageSrc = mediaFileFromStorage
    }
    const mediaFromStorage = localStorage.getItem('claimPageMedia');
    if (mediaFromStorage) {
      const mediaFromStorageObject = JSON.parse(mediaFromStorage)
      this.title = mediaFromStorageObject.title
      this.description = mediaFromStorageObject.description
      this.createdBy = mediaFromStorageObject.createdBy
    }
  },
  methods: {
    async handleSave() {
      try {
        const img = this.$refs["fileImage"];
        const file = this.dropzoneFile;
        const props = {
          img: file,
          imgUrl: "",
          createdBy: this.createdBy,
          name: file.name,
          attributes: [],
          imgDetails: {
            bytes: img.size,
            format: this.dropzoneFile.type,
            width: img.naturalWidth,
            height: img.naturalHeight,
            sha256: "",
          },
          description: this.description,
          title: this.title,
        };
        localStorage.setItem('claimPageMedia', JSON.stringify({ ...props }))
        const fileReader = new FileReader();
        const router = this.$router
        if (file) {
          fileReader.addEventListener('loadend', function () {
            localStorage.setItem('claimPageMediaFile', fileReader.result);
            router.push('/claim-page/erc-721/set-up-mint-page')
          });
          fileReader.readAsDataURL(file);
        } else {
          router.push('/claim-page/erc-721/set-up-mint-page')
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
}
</script>
