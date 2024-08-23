import { createStore } from 'vuex';
import { ethereumModule } from "./ethereum";
import { viewportModule } from './viewport';
import { uxModule } from "./ux";

export const boilerplateStore = createStore({
  modules: {
    ethereum: ethereumModule,
    viewport: viewportModule,
    ux: uxModule
  },
});
