// src/globals/global-exports.ts
import { loadSidebarModule } from "../ui/index";
import {
  getAllTabs,
  activateTab,
} from "../ui/sidebar/modules/tab-search/showTabSearchSidebar";

export const SHARED_GLOBALS = {
  loadSidebarModule,
  getAllTabs,
  activateTab,
};
