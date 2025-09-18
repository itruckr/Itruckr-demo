import { ElevenLabsRequest } from "@/types/app";
import axios from "axios";


const external = import.meta.env["VITE_EXTERNAL_SVC"];


export const outBoundCall = async (
  elevenLabsRequest: ElevenLabsRequest,
) => {
  try {
    const url = `${external}/eleven-labs/outbound-call`;

    const { data } = await axios.post(url, elevenLabsRequest);

    return data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new Error("Invalid user credentials");
    }
    throw err;
  }
};