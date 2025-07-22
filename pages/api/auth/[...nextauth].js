import axios from "axios";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import LinkedInProvider from "next-auth/providers/linkedin";
import trackActivity from "../../../components/helper/dashboard/trackActivity";
import "dotenv";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const nextAuthOptions = (req, res) => {
  return {
    // secret: process.env.NEXTAUTH_SECRET,
    providers: [
      CredentialsProvider({
        id: "otp",
        name: "otp",
        async authorize(credentials) {
          let user = {};
          let error = "";
          const { email, otp } = credentials;
          // console.log({ email, otp });
          await axios
            .post(process.env.NEXT_PUBLIC_BASE_URL + `/auth/verify/otp`, {
              email: email,
              otp: otp,
              realm: getCookie("realm", { req, res }),
            })
            .then((res) => {
              user = {
                name: res.data.name,
                email: res.data.email,
                id_token: res.data.auth_token,
                newUser: res.data.newUser,
                realm: res.data.realm,
                user_id: res.data.user_id,
                org_id: res.data.org_id,
                inviteStatus: res?.data?.inviteStatus || "active",
                role: res?.data?.role,
                planCode: res?.data?.planCode,
                allowedFeatures: res?.data?.allowed_features,
              };
              // trackActivity("LOGIN", "", user, user?.org_id);
              console.log("Signed in via Secure Code Login");
            })
            .catch((err) => {
              console.error(
                "Secure Code Login failed, ",
                err.response.data.message
              );
              if (err.response?.data?.message === "Invalid OTP") {
                error = "Invalid OTP";
              } else if (
                err.response?.data?.message ===
                "OTP Invalidated, Request another one"
              ) {
                error = "OTP has expired. Please request a new one.";
              } else {
                error = "Login failed. Please try again.";
              }
            });
          if (Object.keys(user).length === 0) {
            throw new Error(error);
          } else {
            return user;
          }
        },
      }),
      // CredentialsProvider({
      //   // id: "credentials",
      //   name: "credentials",
      //   credentials: {
      //     username: { label: "Username", type: "text", placeholder: "marshalleriksen" },
      //     password: { label: "Password", type: "password" }
      //   },
      //   async authorize(credentials){
      //     let user = {};
      //     await axios.post("http://127.0.0.1:7777/token_login", credentials)
      //     .then((res) => {
      //         console.log("able to sign in");
      //         console.log("--------------------Start of Response--------------");
      //         console.log("Response:", res.data);
      //         console.log("--------------------End of Response--------------");
      //         user = res.data;
      //     })
      //     .catch((err) => {
      //       console.log("not able to sign in");
      //       return null;
      //     })
      //     if(Object.keys(user).length === 0) {
      //       return null;
      //     }
      //     else {
      //       return user;
      //     }
      //   }
      // }),
      // OAuth authentication providers...

      // for okta
      CredentialsProvider({
        id: "okta",
        name: "okta",
        credentials: {
          token: { label: "Okta Access Token", type: "text" },
          userEmail: { label: "Email", type: "text" },
          userName: { label: "Username", type: "text" },
        },
        async authorize(credentials) {
          console.log("entering here");
          const { token, userEmail, userName } = credentials;

          const user = {
            id_token: token,
            email: userEmail,
            name: userName || "",
          };

          // console.log("check user", user)
          // console.log("Signed in via Okta");
          return user;
        },
      }),

      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbacks: "googleSignIn",
      }),
      LinkedInProvider({
        clientId: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        // issuer: "https://www.linkedin.com",
        idToken: true,
        authorization: {
          url: "https://www.linkedin.com/oauth/v2/authorization",
          params: { scope: "openid profile email" },
        },
        wellKnown:
          "https://www.linkedin.com/oauth/.well-known/openid-configuration",
        profile(profile, req, res) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          };
        },
      }),
      // {
      //   id: "okta",
      //   name: "Okta",
      //   clientId: process.env.OKTA_CLIENT_ID,
      //   clientSecret: process.env.OKTA_CLIENT_SECRET,
      //   authorization: `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/authorize?response_type=code&scope=openid%20profile%20email`,
      //   token: `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/token`,
      //   userinfo: `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/userinfo`,
      //   profile(profile) {
      //     return {
      //       id: profile.sub,
      //       name: profile.name || profile.preferred_username || profile.email,
      //       email: profile.email,
      //       image: profile.picture || null,
      //     };
      //   },
      // },
    ],
    session: {
      jwt: true,
      maxAge: 7 * 24 * 60 * 60,
    },
    callbacks: {
      async signIn({ user, account }) {
        if (user && account.provider === "google") {
          try {
            const realm = getCookie("realm", { req, res });
            const response = await axios.post(
              process.env.NEXT_PUBLIC_BASE_URL + "/auth/google-signin",
              {
                token: account.id_token,
                realm: realm,
              }
            );

            if (response?.data?.inviteStatus === "disabled") {
              setCookie("login-msg", "This user is disabled", { req, res });
              return "/login";
            } else {
              deleteCookie("login-msg", { req, res });
              account.id_token = response.data.auth_token;
              account.newUser = response.data.newUser;
              account.realm = response.data.realm;
              account.user_id = response.data.user_id;
              account.org_id = response.data.org_id;
              account.inviteStatus = response?.data?.inviteStatus || "active";
              account.role = response?.data?.role;
              account.planCode = response?.data?.planCode;
              account.allowedFeatures = response?.data?.allowed_features;
              // trackActivity("LOGIN", "", account, "", account?.org_id);
              return true;
            }
          } catch (error) {
            console.error(
              "Error in google sign-in api:",
              error?.response?.data
            );
          }
          return true; // Returning true if the conditions are not met
        }
        if (user && account.provider === "linkedin") {
          try {
            const realm = getCookie("realm", { req, res });
            const response = await axios.post(
              process.env.NEXT_PUBLIC_BASE_URL + "/auth/linkedin",
              {
                token: account.access_token,
                realm: realm,
              }
            );

            if (response?.data?.inviteStatus === "disabled") {
              setCookie("login-msg", "This user is disabled", { req, res });
              return "/login";
            } else {
              deleteCookie("login-msg", { req, res });
              account.id_token = response.data.auth_token;
              account.newUser = response.data.newUser;
              account.realm = response.data.realm;
              account.user_id = response.data.user_id;
              account.org_id = response.data.org_id;
              account.inviteStatus = response?.data?.inviteStatus || "active";
              account.role = response?.data?.role;
              account.planCode = response?.data?.planCode;
              console.log("Signed in using Linkedin");
              // trackActivity("LOGIN", "", account, account?.org_id);
            }
          } catch (error) {
            console.error(
              "Error in linkedin sign-in api:",
              error?.response?.data
            );
          }
          return true; // Returning true if the conditions are not met
        }
        // if (user && account.provider === "okta") {
        //   try {
        //     const realm = getCookie("realm", { req, res });
        //     const response = await axios.post(
        //       process.env.NEXT_PUBLIC_BASE_URL + "/auth/okta-signin",
        //       {
        //         token: account.id_token,
        //         realm,
        //       }
        //     );

        //     if (response?.data?.inviteStatus === "disabled") {
        //       setCookie("login-msg", "This user is disabled", { req, res });
        //       return "/login";
        //     } else {
        //       deleteCookie("login-msg", { req, res });
        //       account.id_token = response.data.auth_token;
        //       account.newUser = response.data.newUser;
        //       account.realm = response.data.realm;
        //       account.user_id = response.data.user_id;
        //       account.org_id = response.data.org_id;
        //       account.inviteStatus = response?.data?.inviteStatus || "active";
        //       account.role = response?.data?.role;
        //       account.planCode = response?.data?.planCode;
        //       account.allowedFeatures = response?.data?.allowed_features;
        //       console.log("Signed in using Okta");
        //       trackActivity("LOGIN", "", account, account?.org_id);
        //       return true;
        //     }
        //   } catch (error) {
        //     console.error("Error in Okta sign-in API:", error?.response?.data);
        //   }
        //   return false; // Reject the sign-in if conditions are not met
        // }
        if (user && account.provider == "otp") {
          console.log("Signed in using otp");
          return true;
        }
        if (user && account.provider === "okta") {
          console.log("getting heree");
          // If Okta specific logic is needed, you can add it here
          account.providerAccountId = "okta";
          console.log("Okta sign-in, account:", account);
          return true;
        }
      },
      async jwt({ token, user, account, trigger, session }) {
        if (trigger == "update") {
          // if (account.provider === "okta" && account.id_token) {
          //   token.id_token = account.id_token;
          //   token.email = user.email;
          //   token.name = user.name;
          // }

          if (!session.user.termsUpdated) {
            await axios
              .get(
                process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL +
                  "/dashboard/profile/get/user",
                {
                  headers: {
                    Authorization: session?.user?.id_token,
                  },
                }
              )
              .then((res) => {
                // console.log("auth user: ", res);
                if (!res.data.terms || res.data.terms !== session.user.terms) {
                  axios
                    .post(
                      process.env.NEXT_PUBLIC_BASE_URL + "/auth/user/terms",
                      {
                        terms: session.user.terms,
                      },
                      {
                        headers: {
                          Authorization: session?.user?.id_token,
                        },
                      }
                    )
                    .then((response) => {
                      session.user.termsUpdated = true;
                      console.log("terms updated");
                    })
                    .catch((error) => {
                      console.error(
                        "Error in updating terms",
                        error?.response?.data
                      );
                    });
                } else {
                  session.user.termsUpdated = true;
                }
              })
              .catch((err) => {
                console.error("Error in fetching profile", err.response.data);
              });
            return { ...token, ...session.user, ...account };
          }
          return { ...token, ...session.user, ...account };
        }

        return { ...user, ...token, ...account };
      },
      async session({ session, token, user }) {
        session.user = token;
        return session;
      },
    },
    pages: {
      signIn: "/login",
    },
  };
};

export default (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
