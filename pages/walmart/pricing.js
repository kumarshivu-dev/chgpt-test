import { CenterFocusStrong } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSession, getSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPlanMode,
  setPaymentButton,
  setEssentialButton,
  setPremiumButton,
  setEliteButton,
  setPlancodeValue,
} from "../../store/walmart/walmartPricingSlice";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
export default function Pricing({ user }) {
  const { data: session, status } = useSession();

  const [fullname, setFullName] = useState("");
  const subscriptionUrlMonthly = `https://subscriptions.zoho.com/subscribe/d40b61d19b733552abebe7e649f6c1a26a2bba0f6b0532170999d0f436d01b3f/walgpt-essentials-monthly?${
    fullname[0] ? "first_name=" + fullname[0] : ""
  }${fullname[1] ? "&last_name=" + fullname[1] : ""}&email=${
    session ? session?.user.email : ""
  }`;
  const subscriptionUrlYearly = `https://subscriptions.zoho.com/subscribe/d40b61d19b733552abebe7e649f6c1a26a2bba0f6b0532170999d0f436d01b3f/walgpt-essentials?${
    fullname[0] ? "first_name=" + fullname[0] : ""
  }${fullname[1] ? "&last_name=" + fullname[1] : ""}&email=${
    session ? session?.user.email : ""
  }`;
  const subscriptionUrlBasicMonthly = `https://subscriptions.zoho.com/subscribe/d40b61d19b733552abebe7e649f6c1a26a2bba0f6b0532170999d0f436d01b3f/walgpt-basic-monthly?${
    fullname[0] ? "first_name=" + fullname[0] : ""
  }${fullname[1] ? "&last_name=" + fullname[1] : ""}&email=${
    session ? session?.user.email : ""
  }`;
  const subscriptionUrlBasicYearly = `https://subscriptions.zoho.com/subscribe/d40b61d19b733552abebe7e649f6c1a26a2bba0f6b0532170999d0f436d01b3f/walgpt-basic?${
    fullname[0] ? "first_name=" + fullname[0] : ""
  }${fullname[1] ? "&last_name=" + fullname[1] : ""}&email=${
    session ? session?.user.email : ""
  }`;
  const subscriptionUrlPremiumMonthly = `https://subscriptions.zoho.com/subscribe/edcc52d10a99d5574fe150f70997ba577906f5e6327bed22ad482bf477cf719e/walgpt-premium-monthly?${
    fullname[0] ? "first_name=" + fullname[0] : ""
  }${fullname[1] ? "&last_name=" + fullname[1] : ""}&email=${
    session ? session?.user.email : ""
  }`;
  const subscriptionUrlPremiumYearly = `https://subscriptions.zoho.com/subscribe/edcc52d10a99d5574fe150f70997ba577906f5e6327bed22ad482bf477cf719e/walgpt-premium?${
    fullname[0] ? "first_name=" + fullname[0] : ""
  }${fullname[1] ? "&last_name=" + fullname[1] : ""}&email=${
    session ? session?.user.email : ""
  }`;
  const subscriptionUrlEliteMonthly = `https://subscriptions.zoho.com/subscribe/d40b61d19b733552abebe7e649f6c1a26a2bba0f6b0532170999d0f436d01b3f/walgpt-elite-monthly?${
    fullname[0] ? "first_name=" + fullname[0] : ""
  }${fullname[1] ? "&last_name=" + fullname[1] : ""}&email=${
    session ? session?.user.email : ""
  }`;
  const subscriptionUrlEliteYearly = `https://subscriptions.zoho.com/subscribe/d40b61d19b733552abebe7e649f6c1a26a2bba0f6b0532170999d0f436d01b3f/walgpt-elite?${
    fullname[0] ? "first_name=" + fullname[0] : ""
  }${fullname[1] ? "&last_name=" + fullname[1] : ""}&email=${
    session ? session?.user.email : ""
  }`;

  const dispatch = useDispatch();
  const pricingState = useSelector((state) => state.walmartPricing);

  useEffect(() => {
    if (user.name.indexOf(" ") > 0) {
      let tmpName = user ? user.name.split(" ") : "";
      let displayname = tmpName[0] + " " + tmpName[tmpName.length - 1];
      setFullName(displayname.split(" "));
    } else {
      let tmpName = [];
      tmpName[0] = user.name;
      setFullName(tmpName);
    }
  }, []);

  const subscriptionPlan = (event) => {
    const { checked } = event.target;
    dispatch(setPaymentButton(!pricingState.paymentButton));
    if (checked) {
      dispatch(setPlanMode(true));
    } else {
      dispatch(setPlanMode(false));
    }
  };

  return (
    <>
      <Box className="threecolsecpricing">
        <Grid className="switch-button">
          <input
            className="switch-button-checkbox"
            type="checkbox"
            onChange={subscriptionPlan}
            checked={pricingState.planMode}
          />
          <label className="switch-button-label" htmlFor="">
            <span className="switch-button-label-span">Yearly</span>
          </label>
        </Grid>
        <Stack
          className="card-deck"
          direction={{ xs: "column", sm: "column", md: "row" }}
        >
          <Item className="card">
            <div className="plan-name">
              <Typography variant="h3" className="text-center">
                Free
              </Typography>
              <Typography>
                (Up to <Typography variant="span">5</Typography> Product calls
                per month)
              </Typography>
            </div>
            <div className="plan-action">
              <div className="price-and-duration">
                <Typography variant="h4" className="text-center">
                  {pricingState.planMode ? "$0/mo" : "$0/mo"}
                </Typography>
                <Typography> &nbsp;</Typography>
                <Typography> &nbsp;</Typography>
                <Button variant="contained" size="medium" disabled>
                  {pricingState.plancodeValue}
                </Button>
              </div>
            </div>
            <div className="card-body">
              <List className="features-included">
                <ListItem>1 User</ListItem>
                <ListItem>Product Content Generation</ListItem>
              </List>
              <List className="features-not-included">
                <ListItem>Keywords/SEO</ListItem>
                <ListItem>Taxonomy/Categorization</ListItem>
                <ListItem>Content Training</ListItem>
                <ListItem>Industry Training</ListItem>
                <ListItem>Custom API Integration</ListItem>
                <ListItem>Custom PIM/eCommerce Integration</ListItem>
              </List>
            </div>
          </Item>

          <Item className="card">
            <div className="plan-name">
              <Typography
                className="popular"
                sx={{ display: pricingState.planMode ? "none" : "block" }}
              >
                Most Popular
              </Typography>
              <Typography variant="h3" className="text-center">
                Essentials
              </Typography>
              <Typography>
                (Up to <Typography variant="span">250</Typography> Product calls
                per month)
              </Typography>
            </div>
            <div
              className={`plan-action ${
                pricingState.essentialButton.disable === true ? "essential" : ""
              }`}
            >
              <div className="price-and-duration">
                <Typography variant="h4" className="text-center">
                  {pricingState.planMode ? "$124.99/mo" : "$99/mo"}
                </Typography>
                {/* <Typography variant="h4" className="text-center">$124.99/mo</Typography> */}
              </div>
              <Typography>
                {pricingState.planMode ? "" : "(12 month commitment)"} &nbsp;
              </Typography>
              <Typography>&nbsp;</Typography>
              <Tooltip
                title="Upgrade now to add SEO Enhancement and more!"
                placement="bottom"
                className={`paymentoptions ${
                  pricingState.paymentButton ? "monthlypay" : ""
                }`}
              >
                <Link
                  className="payLink"
                  href={`${
                    pricingState.paymentButton
                      ? subscriptionUrlMonthly
                      : subscriptionUrlYearly
                  }`}
                >
                  <Button
                    variant="contained"
                    size="medium"
                    disabled={pricingState.essentialButton.disable}
                  >
                    {pricingState.essentialButton.name}
                  </Button>
                </Link>
              </Tooltip>
            </div>
            <div className="card-body">
              <List className="features-included">
                <ListItem>3 Users</ListItem>
                <ListItem>Product Content Generation</ListItem>
                <ListItem>Keywords/SEO</ListItem>
              </List>
              <List className="features-not-included">
                <ListItem>Taxonomy/Categorization</ListItem>
                <ListItem>Content Training</ListItem>
                <ListItem>Industry Training</ListItem>
                <ListItem>Custom API Integration</ListItem>
                <ListItem>Custom PIM/eCommerce Integration</ListItem>
              </List>
            </div>
          </Item>

          <Item className="card">
            <div className="plan-name">
              <Typography variant="h3" className="text-center">
                Premium
              </Typography>
              <Typography>
                (Up to <Typography variant="span">2500</Typography> Product
                calls per month)
              </Typography>
            </div>
            <div
              className={`plan-action ${
                pricingState.premiumButton.disable == true ? "essential" : ""
              }`}
            >
              <div className="price-and-duration">
                <Typography variant="h4" className="text-center">
                  {pricingState.planMode ? "$624.99/mo" : "$499/mo"}
                </Typography>
                {/* <Typography variant="h4" className="text-center">$124.99/mo</Typography> */}
              </div>
              <Typography>(12 month commitment) &nbsp;</Typography>
              <Typography>$3000 one time setup * &nbsp;</Typography>
              <Tooltip
                title="Upgrade now to add SEO Enhancement and more!"
                placement="bottom"
                className={`paymentoptions ${
                  pricingState.paymentButton ? "monthlypay" : ""
                }`}
              >
                <Link
                  className="payLink"
                  href={`${
                    pricingState.paymentButton
                      ? subscriptionUrlPremiumMonthly
                      : subscriptionUrlPremiumYearly
                  }`}
                >
                  <Button
                    variant="contained"
                    size="medium"
                    disabled={pricingState.premiumButton.disable}
                  >
                    {pricingState.premiumButton.name}
                  </Button>
                </Link>
              </Tooltip>
            </div>
            <div className="card-body">
              <List className="features-included">
                <ListItem>10 Users</ListItem>
                <ListItem>Product Content Generation</ListItem>
                <ListItem>Field Mappings</ListItem>
                <ListItem>Keywords/SEO</ListItem>
                <ListItem>Taxonomy/Categorization</ListItem>
                <ListItem>Content Training</ListItem>
              </List>
              <List className="features-not-included">
                <ListItem>Industry Training</ListItem>
                <ListItem>Custom API Integration</ListItem>
                <ListItem>Custom PIM/eCommerce Integration</ListItem>
              </List>
            </div>
          </Item>

          {/* <Item className="card">
            <div className="plan-name">
              <Typography variant="h3" className="text-center">
                Elite
              </Typography>
              <Typography>
                (Up to <Typography variant="span">10000</Typography> Product
                calls per month)
              </Typography>
            </div>
            <div
              className={`plan-action ${
                pricingState.eliteButton.disable == true ? "essential" : ""
              }`}
            >
              <div className="price-and-duration">
                <Typography variant="h4" className="text-center">
                  {pricingState.planMode ? "$1,249.99/mo" : "$999/mo"}
                </Typography>
                {/* <Typography variant="h4" className="text-center">$124.99/mo</Typography> *</div>
              <Typography>(12 month commitment) &nbsp;</Typography>
              <Typography>$5000 one time setup * &nbsp;</Typography>
              <Tooltip
                title="Upgrade now to add SEO Enhancement and more!"
                placement="bottom"
                className={`paymentoptions ${
                  pricingState.paymentButton ? "monthlypay" : ""
                }`}
              >
                <Link
                  className="payLink"
                  href={`${
                    pricingState.paymentButton
                      ? subscriptionUrlEliteMonthly
                      : subscriptionUrlEliteYearly
                  }`}
                >
                  <Button
                    variant="contained"
                    size="medium"
                    disabled={pricingState.eliteButton.disable}
                  >
                    {pricingState.eliteButton.name}
                  </Button>
                </Link>
              </Tooltip>
            </div>
            <div className="card-body">
              <List className="features-included">
                <ListItem>25 Users</ListItem>
                <ListItem>Product Content Generation</ListItem>
                <ListItem>Field Mappings</ListItem>
                <ListItem>Keywords/SEO</ListItem>
                <ListItem>Taxonomy/Categorization</ListItem>
                <ListItem>Content Training</ListItem>
                <ListItem>Industry Training</ListItem>
              </List>
              <List className="features-not-included">
                <ListItem>Custom API Integration</ListItem>
                <ListItem>Custom PIM/eCommerce Integration</ListItem>
              </List>
            </div>
          </Item> */}

          <Item className="card">
            <div className="plan-name">
              <Typography variant="h3" className="text-center">
                Enterprise
              </Typography>
              <Typography>
                (<Typography variant="span">Unlimited</Typography> Product calls
                per month)
              </Typography>
            </div>
            <div className="plan-action">
              <div className="price-and-duration">
                <Typography variant="h4" className="text-center">
                  {pricingState.planMode ? "Custom Pricing" : "Custom Pricing"}
                </Typography>{" "}
              </div>
              <Typography> &nbsp;</Typography>
              <Typography> &nbsp;</Typography>
              <Link target="_blank" href={process.env.NEXT_PUBLIC_MEET_URL}>
                <Button variant="contained" size="medium">
                  Contact Sales
                </Button>
              </Link>
            </div>
            <div className="card-body">
              <List className="features-included">
                <ListItem>Unlimited Users</ListItem>
                <ListItem>Product Content Generation</ListItem>
                <ListItem>Keywords/SEO</ListItem>
                <ListItem>Taxonomy/Categorization</ListItem>
                <ListItem>Content Training</ListItem>
                <ListItem>Industry Training</ListItem>
                <ListItem>Custom API Integration</ListItem>
                <ListItem>Custom PIM/eCommerce Integration</ListItem>
                <ListItem>Technical Support</ListItem>
              </List>
            </div>
          </Item>
        </Stack>
      </Box>
      <Grid container spacing={2} mt={5} justifyContent="center">
        <Grid item xs={11} p={2} className="plan-notes">
          <Typography>Notes:</Typography>
          <List>
            <ListItem>
              Product calls are number of times a product is enhanced.
            </ListItem>
            <ListItem>
              The content training and initial configuration will take two
              weeks.
            </ListItem>
            <ListItem>
              If you require an integration with your existing PIM/eCommerce
              platform or custom API based integration, contact sales@zorang.com
              for Enterprise subscription.
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </>
  );
}

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
