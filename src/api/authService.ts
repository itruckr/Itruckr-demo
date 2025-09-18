import axios from "axios";

const ssoUrl = import.meta.env["VITE_SSO_URL"];
const realm = import.meta.env["VITE_REALMS"];
const clientId = import.meta.env["VITE_CLIENT_ID"];
const clientIdAdmin = import.meta.env["VITE_CLIENT_ID_ADMIN"];
const realmAdmin = import.meta.env["VITE_REALMS_ADMIN"];

/**
 * Obtener access token de Keycloak (simil Flutter)
 */
export const obtainAccessToken = async (
  username: string,
  password: string,
  isAdmin = false
) => {
  try {
    const url = `${ssoUrl}/realms/${isAdmin ? realmAdmin : realm}/protocol/openid-connect/token`;

    const payload = new URLSearchParams();
    payload.append("client_id", isAdmin ? clientIdAdmin : clientId);
    payload.append("username", username);
    payload.append("password", password);
    payload.append("grant_type", "password");

    const { data } = await axios.post(url, payload, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new Error("Invalid user credentials");
    }
    throw err;
  }
};
