import axios from "axios";

const chat_base_url = import.meta.env["VITE_CHAT_SVC"];

export const obtainChats = async (
  accessToken: string,
) => {
  try {
    const url = `${chat_base_url}/chat/all`;

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

export const obtainMessagesByChatId = async (
  accessToken: string,
  chatId: string
) => {
  try {
    const url = `${chat_base_url}/message/byChaId/${chatId}`;

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