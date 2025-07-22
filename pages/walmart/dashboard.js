// libs
// utils and helpers
// hooks
// components
// constants
import {
  Box,
  Grid,
  Typography,
  Snackbar,
  Alert,
  AlertTitle,
  Link,
} from "@mui/material";
import { useSession, getSession, signOut } from "next-auth/react";
import "../../app/walmart-style.css";
import Button from "@mui/material/Button";
import EastIcon from "@mui/icons-material/East";
import { useEffect, useState, memo, useCallback } from "react";
import axios from "axios";
import Progress from "../../components/walmart/Progress";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  setPlanMode,
  setPaymentButton,
  setEssentialButton,
  setPremiumButton,
  setEliteButton,
  setPlancodeValue,
  SetIsWalmartPaidUser,
} from "../../store/walmart/walmartPricingSlice";
import ProductTable from "../../components/walmart/ProductTable";
import cookie from "js-cookie";
import { GET_AUTH_USER_PROFILE } from "../../utils/apiEndpoints";

const Dashboard = memo(({ user }) => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const [dataSelected, setDataSelected] = useState([]);
  const [monthSnackbar, setMonthSnackbar] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState(0);

  const handleRowSelectionChange = useCallback((selectedRows) => {
    setDataSelected(selectedRows);
  }, []);

  useEffect(() => {
    if (session && !session.user.terms) {
      update({ ...session, terms: cookie.get("rememberMe") });
      session.user.terms = cookie.get("rememberMe");
    }

    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + GET_AUTH_USER_PROFILE, {
        headers: {
          Authorization: user.id_token,
        },
      })
      .then((response) => {
        setMonthlyLimit(response.data.monthlyLimit);
        if (response.data.monthlyLimit <= 0) {
          setMonthSnackbar(true);
        }
        if (!response.data.profileUpdated) {
          router.push({
            pathname: "/walmart/profile",
            query: {
              profile_message: "Please update your profile to continue",
            },
          });
        } else if (response.data.paidUser === true) {
          dispatch(SetIsWalmartPaidUser(true));
          if (response.data.planCode === "walgpt-essentials") {
            dispatch(
              setEssentialButton({
                name: "Your Current Plan",
                disable: true,
              })
            );
            dispatch(setPlancodeValue("Not Applicable"));
          } else if (response.data.planCode === "walgpt-premium") {
            dispatch(
              setPremiumButton({
                name: "Your Current Plan",
                disable: true,
              })
            );
            dispatch(setPlancodeValue("Not Applicable"));
          } else if (response.data.planCode === "walgpt-elite") {
            dispatch(
              setEliteButton({
                name: "Your Current Plan",
                disable: true,
              })
            );
            dispatch(setPlancodeValue("Not Applicable"));
          }
        }
      })
      .catch((error) => {
        console.error(error);
        if (error?.response?.data == "Unauthorized") {
          signOut();
        }
      });
  }, []);

  const handleSnackbarClose = () => {
    setMonthSnackbar(false);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {/* Stepper */}
          <Grid item xs={12}>
            <Progress active={0} />
          </Grid>
          {/* Heding & desc */}
          <Grid item xs={12} style={{ margin: "25px 0 15px 0" }}>
            <Typography variant="h3" textAlign="center">
              Select Products
            </Typography>
            <Typography textAlign="center" color="#808080">
              Select products you wish to enhance using ContentHubGPT
            </Typography>
          </Grid>
          {/* MUIDataTable */}
          <ProductTable
            resultsPage={false}
            isReadOnly={true}
            onRowSelectionChange={handleRowSelectionChange}
            user={user}
            email={user.email}
            monthlyLimit={monthlyLimit}
          />
          {/* Enhancements Button */}
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              style={{ marginTop: "20px", borderRadius: "5px", color: "#FFF" }}
              variant="contained"
              color="primary"
              disabled={dataSelected.length === 0}
              endIcon={<EastIcon />}
              onClick={() => {
                router.push({
                  pathname: "/walmart/enhancements",
                });
              }}
            >
              choose Enhancements
            </Button>
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={monthSnackbar}
          autoHideDuration={null}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>
              "You have reached your monthly limit. Please Visit the{" "}
              <Link style={{ color: "red" }} href="/walmart/pricing">
                pricing page
              </Link>{" "}
              to upgrade your plan."
            </AlertTitle>
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
});

export default Dashboard;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const { user } = session;
  return {
    props: { user },
  };
}
