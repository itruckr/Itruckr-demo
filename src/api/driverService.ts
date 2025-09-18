import axios from "axios";

const registration = import.meta.env["VITE_REGISTRATION_SVC"];

export const obtainDriver = async (
  accessToken: string,
) => {
  try {
    const url = `${registration}/driver/all`;

    const { data } = await axios.get(url, {
      headers: { "Authorization": `Bearer ${ accessToken }` },
    });

    return data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new Error("Invalid user credentials");
    }
    throw err;
  }
};