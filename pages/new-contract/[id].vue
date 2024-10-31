<template>
  <main class="container mx-auto pb-16">
    <Stepper title="1 of 1" description="Create a contract to mint your own tokens" icon="layer-single" :steps="steps"
      :currentStep="1" class="my-6 mx-auto" />
    <div class="mx-auto 0 border border-gray-900 rounded-xl relative p-6 bg-white overflow-hidden">
      <div v-if="isPinningImg || isPinningJson"
        class="absolute top-0 left-0 right-0 bottom-0 z-20 w-full h-full flex flex-col gap-2 items-center justify-center text-black bg-slate-300 bg-opacity-75">
        <span v-if="isPinningImg">Uploading Image</span>
        <span v-else>Pinning Metadata to IPFS</span>
        <Icon icon="refresh-cw-03" class="animate-spin" />
      </div>
      <h2 class="text-gray-600 font-semibold">
        Upload media, add a title, and share more about your work
      </h2>
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
          <CTA @click="handleSave" color="primary" cta-type="submit" :disabled="!formIsValid">Save Media</CTA>
        </section>
      </form>
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import navbarRoutes from "@/data/navbar.json";
import { ref } from "vue";
import { lambdasPath } from "@/utils/netlify.js";
import { patterns, testRegex } from "@/utils/regex.js";
import axios from "axios";
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
      isPinningImg: false,
      isPinningJson: false,
    };
  },
  computed: {
    ...mapGetters(["isConnected"]),
    navbarRoutes() {
      return navbarRoutes.routes;
    },
    routeId() {
      return this.$route && this.$route.params.id;
    },
    dropzoneFileImage() {
      if (this.dropzoneFile) {
        const imageSrc = URL.createObjectURL(this.dropzoneFile);
        return imageSrc;
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
    steps() {
      return steps['erc-721']
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
        const pinImageResponse = await this.handlePinImage(props);

        props.imgUrl = pinImageResponse.imgUrl;
        props.imgDetails.sha256 = pinImageResponse.sha256Hash;

        const pinJsonResponse = await this.handlePinJson(props);

        localStorage.setItem("uri", pinJsonResponse.jsonUrl);
        localStorage.setItem("imgUrl", pinImageResponse.imgUrl);

        this.$router.push(`/new-contract/mint`);
      } catch (error) {
        console.log(error);
      }
    },
    handlePinImage(props) {
      return new Promise(async (resolve, reject) => {
        try {
          this.isPinningImg = true;
          const formData = new FormData();
          formData.append("image", props.img);
          formData.append("createdBy", props.createdBy);
          formData.append("name", props.name);
          formData.append("attributes", JSON.stringify(props.attributes));
          formData.append("imgDetails", JSON.stringify(props.imgDetails));
          formData.append("description", props.description);
          formData.append("title", props.title);

          const { data } = await axios.post(
            `${lambdasPath}/pinImage`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          this.isPinningImg = false;
          resolve(data);
        } catch (error) {
          this.isPinningImg = false;
          reject(error);
        }
      });
    },
    handlePinJson(props) {
      return new Promise(async (resolve, reject) => {
        this.isPinningJson = true;
        try {
          delete props.img;
          const response = await fetch(`${lambdasPath}/pinJson`, {
            method: "POST",
            body: JSON.stringify(props),
          });
          this.isPinningJson = false;
          resolve(response.json());
        } catch (error) {
          this.isPinningJson = false;
          reject(error);
        }
      });
    },
  },
};
</script>
