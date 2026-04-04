import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { upsertStreamUser, deleteStreamUser } from "./stream.js";
import User from "../models/user.model.js";

export const inngest = new Inngest({ id: "interviewFlow" });

const syncUser = inngest.createFunction(
  {
    id: "syncUser",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0].email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);

    //sync user to stream
    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
  },
);

const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    //delete user from stream
    await deleteStreamUser(id.toString());
  },
);

export const functions = [syncUser, deleteUserFromDB];
