import { Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const UpgradeToast = () => {
  const router = useRouter();

  return (
    <>
      
      <Typography variant="body2" sx={{ mt: 0 }}>
        Please update your{" "} 
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.push("/dashboard/settings/environmentSettings");
          }}
          underline="hover"
          color="primary"
        >
          environment settings
        </Link>{" "}
         to continue ...
      </Typography>
    </>
  );
};

export default UpgradeToast;
