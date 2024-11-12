<script>
import { mapActions, mapGetters } from "vuex";
import wc from "@/api/platforms/walletConnect/setup";
import { truncateAddress } from "@/utils/truncateAddress.js";
import { delay } from "@/utils/timeUtil";
const isDevEnv = import.meta.env.VITE_DEV_ENVIRONMENT === "TRUE"
export default {
  data() {
    return {
      modal: null,
      checkConnectionInterval: null,
      checkConnectionMaxAttempts: 5,
      checkConnectionTimeSpace: 500,
      projectChainId: parseInt(import.meta.env.VITE_CHAIN_ID),
      isNetworkSwitchRequested: false,
    };
  },
  async beforeMount() {
    this.modal = wc.modal;
    this.provider = this.modal.walletConnectProvider;

    this.modal.subscribeState(async (e) => {
      if (e.selectedNetworkId !== this.chainId) {
        this.setChainId(e.selectedNetworkId);
      }

      if (e.selectedNetworkId !== this.projectChainId && this.isConnected) {
        this.handleChainSwitch();
      } else {
        this.isNetworkSwitchRequested = false;
      }

      this.handleCheckConnectionStatus();
    });

    this.modal.subscribeEvents(async (e) => {
      const event = e.data.event;
      let isConnect = false;
      switch (event) {
        case "CONNECT_ERROR":
          this.modal.close();
          console.error(event);
          break;
        case "CONNECT_SUCCESS":
          isConnect = this.modal.getIsConnectedState();
          let attempt = 0;
          while (!isConnect) {
            await this.delay(100);
            isConnect = this.modal.getIsConnectedState();
            attempt += 1;
          }

          this.handleConnectionSuccess();
          break;
        case "MODAL_CLOSE":
          if (this.isNetworkSwitchRequested) {
            this.handleDisconnect();
          }
          break;
        default:
          break;
      }
    });
  },
  mounted() {
    this.handleCheckConnectionStatus();

    const chainId = this.modal.getChainId();
    if (chainId !== this.projectChainId && this.isConnected) {
      this.handleChainSwitch();
    }
  },
  beforeDestroy() {
    this.modal = null;
  },
  computed: {
    ...mapGetters({
      chainId: "chainId",
      isConnected: "isConnected",
      wallet: "wallet",
    }),
  },
  methods: {
    ...mapActions({
      setChainId: "setChainId",
      setIsConnected: "setIsConnected",
      setWallet: "setWallet",
    }),
    handleConnect() {
      this.modal.open({ view: "Connect" });
    },
    handleCheckConnectionStatus() {
      const isConnected = this.modal.getIsConnectedState();
      if (isConnected) {
        this.handleConnectionSuccess();
      }
      if (this.isConnected && !isConnected) {
        this.handleDisconnect();
      }
    },
    handleConnectionSuccess() {
      this.setIsConnected(true);
      this.setWallet(this.modal.getAddress());
      this.setChainId(this.modal.getChainId());
    },
    handleDisconnect() {
      this.modal.disconnect();

      this.setChainId(null);
      this.setIsConnected(false);
      this.setWallet(null);
      this.$router.push("/");
    },
    handleChainSwitch() {
      if (!isDevEnv && !this.isNetworkSwitchRequested) {
        this.isNetworkSwitchRequested = true;
        this.modal.open({ view: "Networks" });
        localStorage.removeItem('creations')
        localStorage.removeItem('tokenInventory')
        localStorage.removeItem('contractsInventory')
      }
    },
    truncate(address) {
      return truncateAddress(address);
    },
    delay(timeInMilliseconds) {
      return delay(timeInMilliseconds);
    },
  },
};
</script>
