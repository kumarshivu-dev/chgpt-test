
import { CLOUD_SERVICE_PEM } from "../../../utils/apiEndpoints";
import { pemFileDownload } from "../../../utils/pemfileDownload";


const DownloadPemFile = async (user) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL + CLOUD_SERVICE_PEM
    const fileName = 'Key_File.pem';
    await pemFileDownload(url, fileName, user);
  };
  
  export default DownloadPemFile; 