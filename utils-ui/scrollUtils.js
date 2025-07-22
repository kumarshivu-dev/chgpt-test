export const scrollPageUp = () => {
    window.scrollTo({
      top: window.scrollY - 20,
      behavior: "smooth",
    });
  };