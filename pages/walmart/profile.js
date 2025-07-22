import {
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { getSession, useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { MuiTelInput } from "mui-tel-input";
import { useRouter } from "next/router";
import "dotenv/config";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const Profile = (props) => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyname] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("United States");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const [formError, setFormError] = useState(false);
  const [profileMessage, setProfileMessage] = useState();
  const [updatedMessage, setUpdatedMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    setName(props.user.name);
    setEmail(props.user.email);
    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + "/auth/user/profile", {
        headers: {
          Authorization: props.user.id_token,
        },
      })
      .then((response) => {
        response.data.company ? setCompanyname(response.data.company) : "";
        response.data.department ? setDepartment(response.data.department) : "";
        response.data.phone ? setPhone(response.data.phone) : "";
        response.data.websiteUrl ? setWebsite(response.data.websiteUrl) : "";
        response.data.country ? setCountry(response.data.country) : "";
        response.data.clientId ? setClientId(response.data.clientId) : "";
        response.data.clientSecret
          ? setClientSecret(response.data.clientSecret)
          : "";
      })
      .catch((error) => {
        console.error(error);
        if (error?.response?.data == "Unauthorized") {
          signOut();
        }
      });
  }, [status]);

  useEffect(() => {
    setProfileMessage(props.message.profile_message);
  }, []);

  const handlePhone = (newValue, info) => {
    setPhone(newValue);
    let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    let countryName;
    try {
      countryName = regionNames.of(info.countryCode);
    } catch (error) {
      countryName = "United States";
    }
    setCountry(countryName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientId || !clientSecret) {
      if (!clientId && !clientSecret) {
        setFormError(true);
        setErrorMessage("Please enter your Client ID and Client Secret.");
      } else if (!clientId) {
        setErrorMessage("Please enter your Client ID.");
        setFormError(true);
      } else {
        setErrorMessage("Please enter your Client Secret.");
        setFormError(true);
      }
      return;
    }
    axios
      .post(
        process.env.NEXT_PUBLIC_BASE_URL + "/auth/user/profile/update",
        {
          name: name,
          company: companyName,
          department: department,
          country: country,
          phone: phone,
          websiteUrl: website,
          clientId: clientId,
          clientSecret: clientSecret,
        },
        {
          headers: {
            Authorization: props.user.id_token,
          },
        }
      )
      .then((response) => {
        setUpdatedMessage("Profile Updated, Thank You!");
        setName(name);
        update({ ...session, name: name });
        session.user.name = name;
        update({ ...session, newUser: false });
        session.user.newUser = false;
        props.user.name = name;
        setTimeout(() => (window.location.href = "/walmart/dashboard"), 4000);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        console.error("Error while Updating Profile", error);
      });
  };

  const departments = [
    {
      value: "Administration",
      label: "Administration",
    },
    {
      value: "IT",
      label: "IT",
    },
    {
      value: "Marketing",
      label: "Marketing",
    },
    {
      value: "Operations",
      label: "Operations",
    },
    {
      value: "Product Management",
      label: "Product Management",
    },
    {
      value: "Sales",
      label: "Sales",
    },
    {
      value: "Other",
      label: "Other",
    },
  ];

  const handleSnackbarClose = () => {
    setProfileMessage();
    setUpdatedMessage();
    setErrorMessage();
  };

  return (
    <>
      <div className="profile_page">
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "700" }}
        >
          Profile
        </Typography>
        <Box>
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Item>
                <Typography variant="h5">Add Info</Typography>
                <Typography variant="body1" sx={{ marginBottom: "20px" }}>
                  Add your client ID and secret, name, phone
                </Typography>
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1 },
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  {/* <div> */}
                  <Grid container>
                    <Grid
                      item
                      sx={{ display: "flex", justifyContent: "center" }}
                      xs={12}
                      md={6}
                    >
                      <TextField
                        fullWidth
                        id="outlined-name"
                        label="Name"
                        disabled={props.user.provider == "otp" ? false : true}
                        value={name ? name : ""}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      sx={{ display: "flex", justifyContent: "center" }}
                      xs={12}
                      md={6}
                    >
                      <TextField
                        fullWidth
                        disabled
                        id="outlined-email"
                        label="Email"
                        value={email ? email : ""}
                      />
                    </Grid>
                    <Grid
                      item
                      sx={{ display: "flex", justifyContent: "center" }}
                      xs={12}
                      md={6}
                    >
                      <TextField
                        required
                        fullWidth
                        inputProps={{
                          form: {
                            autoComplete: "off",
                          },
                        }}
                        id="outlined-id"
                        label="Walmart Client ID"
                        error={clientId ? false : formError}
                        helperText={
                          clientId
                            ? ""
                            : formError
                            ? "This field is required"
                            : ""
                        }
                        value={clientId ? clientId : ""}
                        onChange={(e) => {
                          setClientId(e.target.value);
                          setFormError(false);
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      sx={{ display: "flex", justifyContent: "center" }}
                      xs={12}
                      md={6}
                    >
                      <TextField
                        required
                        type="password"
                        fullWidth
                        inputProps={{
                          form: {
                            autoComplete: "off",
                          },
                        }}
                        id="outlined-secret"
                        label="Walmart Client Secret"
                        error={clientSecret ? false : formError}
                        helperText={
                          clientSecret
                            ? ""
                            : formError
                            ? "This field is required"
                            : ""
                        }
                        value={clientSecret ? clientSecret : ""}
                        onChange={(e) => {
                          setClientSecret(e.target.value);
                          setFormError(false);
                        }}
                      />
                    </Grid>{" "}
                    <Grid
                      item
                      sx={{ display: "flex", justifyContent: "center" }}
                      xs={12}
                      md={6}
                    >
                      <TextField
                        fullWidth
                        inputProps={{
                          form: {
                            autoComplete: "off",
                          },
                        }}
                        id="outlined-company"
                        label="Company Name"
                        value={companyName ? companyName : ""}
                        onChange={(e) => {
                          setCompanyname(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      sx={{ display: "flex", justifyContent: "center" }}
                      xs={12}
                      md={6}
                    >
                      <TextField
                        fullWidth
                        id="outlined-department"
                        select
                        label="Department"
                        value={department ? department : ""}
                        defaultValue=""
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        <MenuItem value="">Please Choose</MenuItem>
                        {departments.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid
                      item
                      sx={{ display: "flex", justifyContent: "center" }}
                      xs={12}
                      md={6}
                    >
                      {/* <TextField
                                fullWidth 
                                id="outlined-phone"
                                label="Phone"
                                type="number"
                                value={phone ? phone : ""}
                                onChange={(e) => setPhone(e.target.value)}
                                /> */}
                      <MuiTelInput
                        label="Phone"
                        helperText="Please tap on the flag to choose country"
                        fullWidth
                        defaultCountry="US"
                        forceCallingCode
                        value={phone ? phone : ""}
                        onChange={handlePhone}
                      />
                    </Grid>
                    <Grid
                      item
                      sx={{ display: "flex", justifyContent: "center" }}
                      xs={12}
                      md={6}
                    >
                      <TextField
                        fullWidth
                        id="outlined-website-url"
                        label="Website URL"
                        value={website ? website : ""}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </Grid>
                    <Grid
                      item
                      sx={{ display: "flex", justifyContent: "center" }}
                      xs={12}
                    >
                      <Grid
                        item
                        sx={{ display: "flex", justifyContent: "center" }}
                        xs={12}
                        md={6}
                      >
                        <TextField
                          fullWidth
                          id="outlined-country"
                          label="Country"
                          inputProps={{
                            form: {
                              autoComplete: "off",
                            },
                          }}
                          value={country ? country : ""}
                          onChange={(e) => {
                            setCountry(e.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center", gap: 2 }}
                    >
                      <Button
                        type="submit"
                        sx={{
                          marginTop: "20px",
                          backgroundColor: "#FB9005",
                          color: "#ffffff",
                          borderRadius: "50px",
                          "&:hover": {
                            backgroundColor: "#f6aa46",
                          },
                        }}
                        variant="contained"
                        size="medium"
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                  {/* </div> */}
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={updatedMessage ? true : false}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" onClose={handleSnackbarClose}>
          <AlertTitle>Profile Updated, Thank You!</AlertTitle>
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={profileMessage ? true : false}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" onClose={handleSnackbarClose}>
          <AlertTitle>{profileMessage}</AlertTitle>
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={errorMessage ? true : false}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" onClose={handleSnackbarClose}>
          <AlertTitle>Error in updating profile!</AlertTitle>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  return {
    props: { message: context.query, user: session.user },
  };
}
