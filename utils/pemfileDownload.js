export const pemFileDownload = async (url, fileName, user, onError) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': user?.id_token, // Optional chaining used
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch the file. Status: ${response.status}`);
      }
  
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error(`Error downloading the file "${fileName}":`, error);
      if (onError) {
        onError(error.message || 'An error occurred while downloading the file');
      }
    }
  }; 