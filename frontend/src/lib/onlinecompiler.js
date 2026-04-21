import { axiosInstance } from "./axios";

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const { data } = await axiosInstance.post("/code/execute", {
      language,
      code,
    });

    return data;
  } catch (error) {
    const serverError =
      error.response?.data?.error || error.response?.data?.message;

    return {
      success: false,
      error: serverError || `Failed to execute code: ${error.message}`,
    };
  }
}
