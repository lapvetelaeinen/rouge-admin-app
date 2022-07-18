import { useSession, signIn, signOut } from "next-auth/react";
import Router from "next/router";
import { useEffect, useState } from "react";
import connectDB from "./api/auth/lib/connectDB";
import axios from "axios";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const signinUser = async (e) => {
    e.preventDefault();

    let options = { redirect: false, email, password };
    const res = await signIn("credentials", options);
    setMessage(null);
    if (res?.error) {
      setMessage(res.error);
      return;
    }
    return Router.push("/");
  };

  const signupUser = async (e) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        body: JSON.stringify({ email, password }),
      },
    });

    let { data } = await axios.post("/api/register", {
      email: email,
      password: password,
    });

    console.log(data);
    if (data.message) {
      setMessage(data.message);
    }
    if (data.message == "Registered successfully") {
      let options = { redirect: false, email, password };
      const res = await signIn("credentials", options);
      return Router.push("/");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-violet-300">
      <div>
        <p>Logga in</p>
        <form action="" className="flex flex-col gap-2 mt-8">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-red-200">{message}</p>
          <button
            onClick={(e) => signinUser(e)}
            className="bg-yellow-200 py-4 px-10 rounded-md shadow-md mt-5"
          >
            Logga in
          </button>
        </form>
      </div>
    </div>
  );
}
