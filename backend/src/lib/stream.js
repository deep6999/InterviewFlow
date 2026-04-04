import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
export const streamClient = new StreamClient(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("Stream user upserted successfully", userData);
    return true; //why true? because we want to return true if the user is upserted successfully
  } catch (error) {
    console.error("Error upserting stream user:", error);
    return false; //why false? because we want to return false if the user is not upserted successfully
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully", userId);
    return true; //why true? because we want to return true if the user is deleted successfully
  } catch (error) {
    console.error("Error deleting stream user:", error);
    return false; //why false? because we want to return false if the user is not deleted successfully
  }
};
