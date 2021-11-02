import axios from "axios";
// Getting the API url directly from the config, rather than the constants (which depend on something that depends
// on this file)
import { CONFIG } from "@/config/config";

export const HTTP = axios.create({
    baseURL: CONFIG.API_URL,
    headers: { "Content-Type": "application/json; charset=utf-8" }
});
