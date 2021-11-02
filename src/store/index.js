import Vue from "vue";
import Vuex from "vuex";
import { HTTP } from "@/services/index";
import { login, register, resetPassword, logout } from "@/services/userService";
import { createNewCommunity, getUserCommunities } from "@/services/communityService";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        status: "",
        token: localStorage.getItem("token") || "",
        userId: localStorage.getItem("userId") || "",
        communityId: localStorage.getItem("communityId") || "",
        role: localStorage.getItem("role") || "",
        email: localStorage.getItem("email") || "",
        user: {},
        community: {},
        errorMessage: {},
        unsavedChanges: false,
        unsavedBar: JSON.parse(localStorage.getItem("unsavedBar") || "null"),
        resetPasswordEmail: "",
        // The url the visitor used, before authenticating - redirect to this after login completes.
        beforeLoginPage: undefined,
        // The page which "/" redirects authenticated users to (when not the default)
        homePage: undefined,
        isMobile: false,
        forceFocusMode: false
    },
    mutations: {
        auth_request(state) {
            state.status = "pending";
        },
        auth_success(state, data) {
            state.status = "success";
            state.token = data.token;
            state.user = data.user;
            state.userId = data.user.id;
            state.email = data.email;
        },
        auth_error(state, error) {
            state.status = "authentication failed";
            state.status = error;
        },
        logout(state) {
            state.status = "";
            state.token = "";
            state.userId = "";
            state.communityId = "";
        },
        reset_password_email(state, email) {
            state.resetPasswordEmail = email;
        },
        reset_password(state) {
            state.status = "reset_password";
        },
        reset_password_error(state) {
            state.status = "reset_password_failed";
        },
        new_community(state, community) {
            state.status = "created_new_community";
            state.community = community;
        },
        community_error(state) {
            state.status = "create_new_community_failed";
        },
        community(state, communityId) {
            state.communityId = communityId;
        },
        role(state, role) {
            state.role = role;
            localStorage.setItem("role", role);
        },
        unsavedChanges(state, isChanged) {
            state.unsavedChanges = isChanged;
        },
        unsavedBar(state, barDetails) {
            state.unsavedBar = barDetails;
        },
        beforeLoginPage(state, url) {
            state.beforeLoginPage = url;
        },
        homePage(state, url) {
            state.homePage = url;
        },
        isMobile(state, flag) {
            state.isMobile = flag;
        },
        forceFocusMode(state, flag) {
            state.forceFocusMode = flag;
        }
    },
    actions: {
        register({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit("auth_request");
                register(user)
                    .then(resp => {
                        const data = {
                            user: resp.data.user
                        };
                        commit("auth_success", data);
                        resolve(resp);
                    })
                    .catch(err => {
                        commit("auth_error", err);
                        reject(err);
                    });
            });
        },
        async login({ commit, dispatch, state }, user) {
            let userData;
            try {
                const resp = await login(user);
                userData = {
                    user: resp.data.user,
                    token: resp.data.token,
                    email: user.email
                };
            } catch (err) {
                commit("auth_error", err);
                localStorage.removeItem("token");
                throw err;
            }

            localStorage.setItem("token", userData.token);
            localStorage.setItem("userId", userData.user.id);
            localStorage.setItem("email", user.email);
            HTTP.defaults.headers.common.Authorization = `Bearer ${userData.token}`;

            commit("auth_success", userData);

            // Get the communities the user is part of (ignore the rejection, it's ok if not).
            await dispatch("userCommunities", state.userId).catch(e => undefined);

            return "/";
        },
        logout({ commit, state }) {
            return logout(state.userId).finally(() => {
                commit("logout");
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("communityId");
                localStorage.removeItem("role");
                localStorage.removeItem("email");
                delete HTTP.defaults.headers.common.Authorization;
            });
        },
        resetPassword({ commit }, email) {
            return new Promise((resolve, reject) => {
                resetPassword(email)
                    .then(resp => {
                        commit("reset_password");
                        resolve();
                    })
                    .catch(err => {
                        commit("reset_password_error");
                        reject(err);
                    });
            });
        },
        newCommunity({ commit, dispatch, state }, name) {
            return new Promise((resolve, reject) => {
                createNewCommunity(name)
                    .then(resp => {
                        const community = resp.data.community;
                        commit("new_community", community);
                        dispatch("userCommunities", state.userId).catch(e => undefined).then(resolve);
                    })
                    .catch(err => {
                        commit("community_error");
                        reject(err);
                    });
            });
        },
        userCommunities({ commit }, userId) {
            return new Promise((resolve, reject) => {
                getUserCommunities(userId)
                    .then(resp => {
                        const communities = resp.data.communities;
                        if (communities.length !== 0) {
                            localStorage.setItem("communityId", communities[0].id);
                            commit("community", communities[0].id);
                            commit("role", communities[0].role);
                            resolve(communities);
                        } else {
                            reject(new Error("User doesn't have communities."));
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        activeCommunity({ commit }, communityId) {
            return new Promise((resolve, reject) => {
                localStorage.setItem("communityId", communityId);
                commit("community", communityId);
                resolve();
            });
        },
        unsavedChanges({ commit }, isChanged) {
            commit("unsavedChanges", isChanged);
        },
        unsavedBar({ commit }, barDetails) {
            if (barDetails) {
                localStorage.setItem("unsavedBar", JSON.stringify(barDetails));
            } else {
                localStorage.removeItem("unsavedBar");
            }
            commit("unsavedBar", barDetails);
        },
        forceFocusMode({ commit }, flag) {
            if (flag) {
                localStorage.setItem("focusMode", true);
            } else {
                localStorage.removeItem("focusMode");
            }
            commit("forceFocusMode", !!flag);
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        userId: state => state.userId,
        email: state => state.email,
        communityId: state => state.communityId,
        role: state => state.role,
        isManager: state => state.role === "manager",
        hasAccount: state => !!state.communityId,
        unsavedChanges: state => state.unsavedChanges,
        /** @type {BarDetails} */
        unsavedBar: state => state.unsavedBar,
        resetPasswordEmail: state => state.resetPasswordEmail,
        beforeLoginPage: state => state.beforeLoginPage,
        homePage: state => state.homePage,
        isMobile: state => state.isMobile,
        forceFocusMode: state => state.forceFocusMode
    }
});
