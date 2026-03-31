import { useState } from "react";
import "./App.css";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserAvatar,
  UserButton,
} from "@clerk/react";

function App() {
  return (
    <>
      <div>
        <h1>Welcome to My App</h1>
      </div>
      <SignInButton mode="modal" />
      <UserAvatar />
      <Show when={(user) => user.signedIn}>
        <UserButton />
      </Show>
    </>
  );
}

export default App;
