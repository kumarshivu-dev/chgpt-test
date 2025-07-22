import { Box, Container, Grid, Typography, Paper  } from "@mui/material";
import { styled } from '@mui/material/styles';
import Image from "next/image";

import { getSession, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { validateSession } from "../hooks/validateSession";
import { getToken } from "next-auth/jwt";
import axios from "axios";


const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  position: "relative",
}));



export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  // validateSession();
// console.log(handler());
  
    return (
      <>
      <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography sx={{textAlign: "end"}}>Hi {session?.user.name} <br /></Typography>
          <Typography sx={{textAlign: "end"}}>Signed in as {session?.user.email} <br /></Typography>
        </Grid>
      <Grid item xs={12}>
          <Typography variant="h1" sx={{textAlign:"center"}}>H1 Header</Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Item>
          <Typography variant="h2">H2 Header</Typography>
        <Typography>Article text. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.</Typography>
        <Typography>Article text. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.</Typography>
        <Typography>Article text. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.</Typography>
        <Typography>Article text. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.</Typography>
          </Item>
        
        </Grid>
        <Grid item xs={12} md={8}>
        <Item>
          <Typography>Signin</Typography>
          <Image src="/test.jpg" objectFit="cover" layout="fill"></Image>
          </Item>
        </Grid>
      </Grid>

    </Box>
    </>
    )
  }

  export async function getServerSideProps(ctx) {
    return{
      redirect: {
        destination: "/dashboard/home"
      }
    }
  }