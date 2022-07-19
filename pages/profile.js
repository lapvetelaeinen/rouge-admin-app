import { useState, useEffect } from "react";
import {
  withAuthenticator,
  AmplifySignOut,
  Divider,
} from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { CloudHSMV2 } from "aws-sdk";

function Profile() {
  const [user, updateUser] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log("User: ", user);
        updateUser(user);
      })
      .catch((err) => updateUser(null));
  }, []);

  return (
    <>
      <div>{user && <h2>Hello, {user.username}</h2>}</div>
    </>
  );
}

export default withAuthenticator(Profile);
