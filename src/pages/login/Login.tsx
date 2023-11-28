import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import get from "lodash/get";
import { firebaseConfig } from "services/firebase";
import GoogleIcon from "@mui/icons-material/Google";
import Page from "components/Page";

function LoginForm() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [emailLinkSent, setemailLinkSent] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Initialize Firebase app
  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // The signed-in user info.
        const user = result.user;
        // Save the access token and refresh token in local storage
        localStorage.setItem("time", new Date().toISOString());
        localStorage.setItem("accessToken", get(user, "accessToken", ""));
        localStorage.setItem("refreshToken", user.refreshToken);
        localStorage.setItem("email", `${user.email}`);
        localStorage.setItem("name", `${user.displayName}`);
        localStorage.setItem("userId", user.uid);
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const actionCodeSettings = {
    url: "https://app.getflavor.ai/signin?email=" + email,
    handleCodeInApp: true,
  };
  const handleContinue = () => {
    let mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\w{2,3})+$/;
    if (email.match(mailformat)) {
      setEmailError("");
    } else {
      setEmailError("Please enter valid email");
      return;
    }
    setIsSubmittingEmail(true);
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("email", email);
        // const identifyObj = new Identify()
        // identify(identifyObj, {
        //   user_id: email
        // })
        // track('Sign in link sent', { email: email })
        setemailLinkSent(true);
        setIsSubmittingEmail(false);
      })
      .catch((error) => {
        console.log(error.message);
        setIsSubmittingEmail(false);
      });
  };

  const handleContinueAgain = () => {
    let mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\w{2,3})+$/;
    if (email.match(mailformat)) {
      setEmailError("");
    } else {
      setEmailError("Please enter valid email");
      return;
    }
    setemailLinkSent(false);
    setIsSubmittingEmail(true);
    window.localStorage.setItem("email", "");
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("email", email);
        setemailLinkSent(true);
        setIsSubmittingEmail(false);
      })
      .catch((error) => {
        console.log(error.message);
        setIsSubmittingEmail(false);
      });
  };

  console.log();

  return (
    <Page title="Login">
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            bgcolor: "white",
            p: 3,
            borderRadius: "10px",
            boxShadow: theme.shadows[5],
          }}
        >
          <Typography variant="h3">Brand name</Typography>
          <Typography variant="h3" sx={{ fontWeight: 400 }}>
            Log in or Sign up
          </Typography>
          <Button
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            variant="contained"
            sx={{
              bgcolor: "#DB4437",
              color: "#fff",
              marginTop: "20px",
              "&:hover": { bgcolor: "#DB4437" },
            }}
            fullWidth
          >
            Continue with Google
          </Button>

          <Typography variant="subtitle2" sx={{ my: 2 }}>
            or
          </Typography>
          <TextField
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            size="medium"
            label="Email"
            helperText={emailError}
            sx={{
              ".MuiInputBase-input": {
                background: "#fff",
                borderRadius: "10px",
              },
              mb: 2,
            }}
          />
          {emailLinkSent ? (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleContinueAgain}
              sx={{ bgcolor: "#4285F4", color: "white" }}
              disabled={!email || isSubmittingEmail}
            >
              {isSubmittingEmail ? "Sending Email" : "Resend Email"}
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleContinue}
              sx={{ bgcolor: "#4285F4", color: "white" }}
              disabled={!email || isSubmittingEmail}
            >
              {isSubmittingEmail ? "Sending Email" : "Continue"}
            </Button>
          )}
          {emailLinkSent && (
            <Typography textAlign="center">
              Please check your email for the login link.{" "}
            </Typography>
          )}
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            By continuing, you acknowledge that you agree to{" "}
            <a href={"/terms-of-service"} target="_blank" rel="noreferrer">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href={"/privacy-policy"} target="_blank" rel="noreferrer">
              Privacy Policy
            </a>
            .
          </Typography>
        </Box>
      </Box>
    </Page>
  );
}

export default LoginForm;
