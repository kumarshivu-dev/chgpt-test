import { useToast } from "../../../context/ToastContext";

export const downloadCloudConfigurationPDF = (cloudSetup) => {
    const filePaths = {
      aws: '/dashboard/ContentHubGPT-AWS-login.pdf',
    };
    const { showToast } = useToast();
  
    const filePath = filePaths[cloudSetup];
  
    if (!filePath) {
      
      showToast("Invalid Cloud Setup specified", "error");

      return;
    }
  
    try {
      const link = document.createElement("a");
      link.href = filePath;
      link.download = `${cloudSetup}-guide.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      
      showToast("Error Occured in downloading the file");
    }
  };
  