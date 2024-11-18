<template>
  <main class="container mx-auto pb-12">
    <h1 class="text-display-sm font-bold mt-4 px-4 lg:px-0">Ready to publish?</h1>
    <h2 class="text-lg text-gray-500 mb-4 px-4 lg:px-0">Review your claim page minting rules.</h2>
    <Stepper :description="stepper.steps[0].description" :icon="stepper.steps[0].icon" icon-color="warning"
      class="my-6 mx-2 lg:mx-0" />
    <section class="ham-shadow--active p-4 mx-2 lg:mx-0 border-2 border-gray-700 bg-white rounded-3xl font-display">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div class="w-full aspect-square rounded-2xl overflow-hidden bg-gray-400 border-2 border-gray-900">
            <img v-if="mediaFileSrc" ref="fileImage" :src="mediaFileSrc" class="w-full h-full object-cover" />
          </div>
          <ul v-if="media" class="p-2 mt-4 text-lg">
            <li class="flex flex-wrap items-center gap-2">
              <p><span class="text-gray-500 mr-2">Media Title</span><span class="text-gray-700 font-semibold">{{
                media['title']
                  }}</span></p>
            </li>
            <li class="flex flex-wrap items-center gap-2">
              <p><span class="text-gray-500 mr-2">Media Description</span><span class="text-gray-700 font-semibold">{{
                media['description'] }}</span>
              </p>
            </li>
            <li class="flex flex-wrap items-center gap-2">
              <p><span class="text-gray-500 mr-2">Created by</span><span class="text-gray-700 font-semibold">{{
                media['createdBy'] }}</span>
              </p>
            </li>
            <li class="flex flex-wrap items-center gap-2">
              <p><span class="text-gray-500 mr-2">Details</span><span class="text-gray-700 font-semibold"><span
                    class="text-gray-500 mr-1">width:</span>{{
                      media['imgDetails']['width'] }} px / <span class="text-gray-500 mr-1">height:</span>{{
                    media['imgDetails']['height'] }} px</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="flex flex-col gap-2">
          <div>
            <h3 class="text-lg lg:text-xl uppercase font-semibold mb-4">mint rules</h3>
            <ul v-if="mintRules" class="flex flex-col gap-y-3">
              <li class="text-lg flex gap-1"><span class="text-gray-500 mr-2">Price:</span><span
                  class="font-semibold text-gray-700">{{
                    mintRules.price }}
                  <span class="uppercase">{{ mintRules.currency
                    }}</span></span></li>
              <li class="text-lg flex gap-1"><span class="text-gray-500  mr-2">Minting Start Date:</span><span
                  class="font-semibold text-gray-700">{{
                    mintRules.startDate
                    ??
                    'Not set'
                  }}</span></li>
              <li class="text-lg flex gap-1"><span class="text-gray-500  mr-2">Minting End Date:</span><span
                  class="font-semibold text-gray-700">{{
                    mintRules.endDate ??
                    'Not set' }}</span></li>
              <li class="text-lg flex gap-1"><span class="text-gray-500  mr-2">Total supply:</span><span
                  class="font-semibold text-gray-700">{{
                    mintRules.totalSupply ===
                      'unlimited' ? 'Unlimited' : mintRules.numberOfTokens }}</span></li>
              <!-- <li class="text-lg flex gap-1"><span class="font-bold mr-2">Numbered tokens</span><span class="font-semibold text-gray-700">{{
                mintRules.numberedTokens === false ? 'No' : 'Yes'
                  }}</span>
              </li> -->
              <li class="text-lg flex gap-1"><span class="text-gray-500 mr-2">Payout address:</span><span
                  class="font-semibold text-gray-700">{{
                    truncate(mintRules.walletForPayment)
                  }}</span></li>
            </ul>
          </div>
          <div class="my-4">
            <h3 class="text-lg lg:text-xl uppercase font-semibold mb-4">contract</h3>
            <ul v-if="contract" class="flex flex-col gap-y-3">
              <li class="text-lg flex gap-1"><span class="text-gray-500 mr-2">Contract Address:</span><span
                  class="text-gray-700 font-semibold">{{
                    truncate(contract.contractAddress) }}</span></li>
              <li class="text-lg flex gap-1"><span class="text-gray-500 mr-2">Contract Name:</span><span
                  class="text-gray-700 font-semibold">{{
                    contract.name }}</span>
              </li>
              <li class="text-lg flex gap-1"><span class="text-gray-500 mr-2">Contract Symbol:</span><span
                  class="text-gray-700 font-semibold">{{
                    contract.symbol
                  }}</span></li>
            </ul>
          </div>
          <div class="my-4">
            <h3 class="text-lg lg:text-xl uppercase font-semibold mb-4">page info</h3>
            <ul v-if="contract && mintPage" class="flex flex-col gap-y-3">
              <li class="text-lg flex gap-1"><span class="text-gray-500 mr-2">Page URL:</span><span
                  class="text-gray-700 font-semibold line-clamp-2">{{
                    `${baseURL}/${truncate(contract.contractAddress)}-${tokenType}`
                  }}</span></li>
              <li class="text-lg flex gap-1"><span class="text-gray-500 mr-2">Description:</span><span
                  class="text-gray-700 font-semibold line-clamp-3">{{
                    mintPage.description
                  }}</span>
              </li>
            </ul>
          </div>
          <div class="my-4">
            <h3 class="text-lg lg:text-xl uppercase font-semibold mb-4">audience rules</h3>
            <ul v-if="audience" class="flex flex-col gap-y-3">
              <li class="text-lg flex gap-1"><span class="text-gray-500 mr-2">Who can claim:</span><span
                  class="ftext-gray-700 font-semibold line-clamp-2 capitalize">{{
                    audience.audience }}</span></li>
              <li class="text-lg flex gap-1"><span class="text-gray-500 mr-2">Limited:</span><span
                  class="text-gray-700 font-semibold line-clamp-3">{{
                    audience.limited ? 'Yes' : 'No'
                  }}</span>
              </li>
              <li v-if="audience.limited" class="text-lg flex gap-1"><span class="text-gray-500 mr-2">Max Tokens Per
                  Wallet:</span><span class="text-gray-700 font-semibold line-clamp-3">{{
                    audience.maxTokensPerWallet
                  }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flex items-center flex-end gap-2 pt-6">
        <CTA @click="$router.push('/claim-page/erc-721-edition/set-audience')" color="gray"
          class="flex-1 lg:flex-none lg:ml-auto" size="lg">
          previous
          step
        </CTA>
        <CTA @click="handleSave" color="primary" cta-type="submit" size="lg" class="flex-1 lg:flex-none">Publish</CTA>
      </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import { mapActions } from 'vuex'
import { setEditionInfo, nextTokenTypeId } from "@/utils/erc721EditionUtils.js";
import steps from '@/data/publish.json'
import stepper from "@/data/stepper.json"
import { delay } from '@/utils/timeUtil'
import { lambdasPath } from "@/utils/netlify.js";
import { truncateAddress } from "@/utils/truncateAddress";
definePageMeta({
  middleware: ["auth"],
});
const baseURL = import.meta.env.VITE_BASE_URL
export default {
  data() {
    return {
      contract: null,
      media: null,
      mediaFileSrc: null,
      mintPage: null,
      mintRules: null,
      audience: null,
      currentPublishStep: 0,
      tokenType: 0,
    }
  },
  computed: {
    truncate() {
      return truncateAddress
    },
    baseURL() {
      return baseURL
    },
    stepper() {
      return stepper
    },
  },
  async mounted() {
    const claimPageContract = localStorage.getItem('claimPageContract')
    const claimPageMedia = localStorage.getItem('claimPageMedia')
    const claimPageMediaFile = localStorage.getItem('claimPageMediaFile')
    const claimPageMintPage = localStorage.getItem('mintPage')
    const claimPageMintRules = localStorage.getItem('claimPageMintRules')
    const claimPageAudience = localStorage.getItem('claimPageAudience')

    if (claimPageContract) {
      this.contract = JSON.parse(claimPageContract)
      const nextTokenType = await nextTokenTypeId(this.contract.contractAddress)
      this.tokenType = nextTokenType.toNumber()
    }
    if (claimPageMedia) {
      this.media = JSON.parse(claimPageMedia)
    }
    if (claimPageMediaFile) {
      this.mediaFileSrc = claimPageMediaFile

    }
    if (claimPageMintRules) {
      this.mintRules = JSON.parse(claimPageMintRules)
    }
    if (claimPageMintPage) {
      this.mintPage = JSON.parse(claimPageMintPage)
    }
    if (claimPageAudience) {
      this.audience = JSON.parse(claimPageAudience)
    }
  },
  methods: {
    ...mapActions(['setModalData', 'setShowGeneralModal']),
    async getFileFromUrl(url, name, defaultType = 'image/jpeg') {
      const response = await fetch(url);
      const data = await response.blob();
      return new File([data], name, {
        type: data.type || defaultType,
      });
    },
    async handleGetImageAsFile() {
      const file = await this.getFileFromUrl(this.mediaFileSrc, this.media.name, this.media.imgDetails.format)
      return file
    },
    async handleSave() {
      let modalData = {
        title: 'publishing your claim page',
        components: ['PublishProgress'],
        data: {
          steps, current: this.currentPublishStep,
        },
        ctas: [{
          color: 'primary',
          label: 'check your claim page',
          disabled: true,
          url: `/c/${this.contract.contractAddress}`,
          handleClick: async () => {
            document.body.classList.remove('body-overflow-hidden')
            this.setModalData(null)
            this.setShowGeneralModal(false)
            this.$router.push(`/c/${this.contract.contractAddress}-${this.tokenType}`)
          }
        }]
      }
      this.setModalData(modalData)
      this.setShowGeneralModal(true)
      try {
        modalData.data.current = 1;
        this.currentPublishStep = 1;
        // TODO: create a method to update the store's data
        this.setModalData(null)
        await delay(10)
        this.setModalData(modalData)
        this.media.img = await this.handleGetImageAsFile()
        const pinImageResponse = await this.handlePinImage(this.media).catch(err => console.error(err));
        if (pinImageResponse) {
          modalData.data.current = 2;
          this.currentPublishStep = 2;
          this.setModalData(null)
          await delay(10)
          this.setModalData(modalData)
          // TODO: set imgURL in localStorage item
          const editionData = {
            tokenType: this.tokenType,
            tokenName: this.media.title,
            image: pinImageResponse.imgUrl,
            description: this.mintPage.description,
            startDate: this.mintRules.startDate ? this.convertDateToSeconds(this.mintRules.startDate) : null,
            endDate: this.mintRules.endDate ? this.convertDateToSeconds(this.mintRules.endDate) : null,
            maxSupply: this.mintRules.totalSupply === 'unlimited' ? 0 : this.mintRules.numberOfTokens,
            tokenPrice: this.mintRules.price,
            maxNumberOfTokensPerWallet: !this.audience.limited ? 0 : this.audience.maxTokensPerWallet
          }
          const txSetEdition = await setEditionInfo(editionData, this.contract.contractAddress).catch(err => console.error(err))
          if (txSetEdition) {
            modalData.data.current = 3;
            modalData.ctas[0].disabled = false;
            this.currentPublishStep = 3;
            this.setModalData(null)
            await delay(10)
            this.setModalData(modalData)
            localStorage.removeItem('claimPageContract')
            localStorage.removeItem('claimPageMedia')
            localStorage.removeItem('claimPageMediaFile')
            localStorage.removeItem('mintPage')
            localStorage.removeItem('claimPageMintRules')
            localStorage.removeItem('claimPageAudience')
          }
        }
      } catch (error) {
        alert(error.message)
        this.currentPublishStep = 0
      }
    },
    handlePinImage(props) {
      return new Promise(async (resolve, reject) => {
        try {
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
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    },
    convertDateToSeconds(strDate) {
      return Date.parse(strDate) / 1000
    }
  },
}
</script>
