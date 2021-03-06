import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import connectDB from "../lib/connectDB";
import Users from "../../../models/userModel";
import bcrypt from "bcrypt";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import EmailProvider from "next-auth/providers/email";

connectDB();

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        // make email to lowercase before sign in
        const email = credentials.email.toLowerCase();
        const password = credentials.password;
        const user = await Users.findOne({ email });
        if (!user) {
          throw new Error("Not registered");
        }
        if (user) {
          console.log(user);
          return signInUser({ password, user });
        }
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    jwt: ({ token, user }) => {
      // first time jwt callback is run, user object is available
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }

      return session;
    },
  },

  jwt: {
    secret: "test",
    encryption: true,
  },
  pages: {
    signIn: "/auth/signin",
  },
  database: process.env.MONGODB_URI,
});

const signInUser = async ({ password, user }) => {
  if (!password) {
    throw new Error("Please enter password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password or username not correct");
  }
  return user;
};
