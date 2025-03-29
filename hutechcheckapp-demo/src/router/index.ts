import { DASHBOARD_AUTH_API_URL } from "@/utils";
import { createRouter, createWebHistory } from "@familyjs/kdu-router";
import axios from "axios";
import { RouteRecordRaw } from "kdu-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/home/HomePage.kdu"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/checkin/:id",
    component: () => import("@/views/checkin/CheckinPage.kdu"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    component: () => import("@/views/auth/LoginPage.kdu"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const getCurrentUser = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return false;
  }

  try {
    const response = await axios.get(
      `${DASHBOARD_AUTH_API_URL}/check-session`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.user ? true : false;
  } catch (error) {
    return false;
  }
};

router.beforeEach(async (to: any, from: any, next: any) => {
  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
