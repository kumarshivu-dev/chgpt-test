import * as XLSX from "xlsx/xlsx";

// Excel Export function of Product table data
export const excelExport = (formattedData, isResultPage, nameToExport) => {
  // console.log("formatted Data:", formattedData);

  // let contentToAdd = isResultPage ? "Results" : "Products";
  let contentToAdd = "Products";

  // Check if isResultPage is a boolean or a string
  if (typeof isResultPage === "boolean") {
    contentToAdd = isResultPage ? "Results" : "Products";
  } else if (typeof isResultPage === "string") {
    contentToAdd = isResultPage.replace(/\.xlsx$/, "");
  }

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(
    "0" +
    (currentDate.getMonth() + 1)
  ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}`;

  if (formattedData.length > 0) {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    // Add a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // Write the workbook to a buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    // Convert the buffer to a Blob
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${contentToAdd}-${formattedDate}-ContentHubGPT.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
};

export const productSampleData = [
  {
    id: 1,
    product_id: "142152375",
    product_name: "Lululemon The Reversible Yoga Mat 5mm",
    brand: "Lululemon",
    keywords: "",
    exclude_keywords: "",
    feature_bullet1:
      "Our innovative grippy top layer absorbs moisture to help you stay grounded in high-sweat practices",
    feature_bullet2:
      "A sustainably sourced and FSC™-certified natural rubber base gives you cushioning and textured grip for low-sweat practices",
    feature_bullet3:
      "I'm reversible—flip as needed between the smooth, grippy side and the cushioned, natural rubber side",
    feature_bullet4:
      "An antimicrobial additive helps prevent mould and mildew on the mat",
    feature_bullet5:
      "CONTAINS LATEX: People with rubber or latex allergies should avoid contact with this product as it contains natural rubber and may contain latex",
  },
  {
    id: 2,
    product_id: "52205",
    product_name: "Gaiam Total Body Balance Yoga Ball Kit",
    brand: "Gaiam",
    keywords: "",
    exclude_keywords: "",
    product_description:
      "The Total Body Balance Ball Workout was developed to combine our Balance Ball with resistance training for maximum results. Leading fitness instructor Tanja Djelevic takes you through a series of Pilates, yoga and strength moves using the Balance Ball to focus on major muscle groups. Improve your body’s core strength and natural balance while getting trim and toned. Kit delivers dynamic whole-body workouts that range from beginner to advanced featuring a 105-minute workout (Total Body Balance Ball with three 20-minute focused segments on upper body, lower body and abs and Balance Ball Express with three 10-minute segments), an air pump and high-quality, anti-burst Balance Ball. Includes Anti-Burst Stability Exercise Yoga Ball, Air Pump, and Workout Program.",
  },
  {
    id: 3,
    product_id: "ABCD1234",
    product_name: "Hydr8 Water Bottle",
    brand: "Hydr8",
    keywords:
      "Ocean-blue, BPA free, made from 50% recycled materials, durable construction, lid attached with keeper loop, includes carabiner",
    exclude_keywords: "",
    product_description:
      "Hydr8 allows for a completely organic customer facing experience delivering plastic-free and high quality coffee solutions, bottle and can-free flavored beverages, non-packaged snacks, and compostable disposables cost effectively. ",
    feature_bullet1: "32 oz.",
    feature_bullet2: "Wide mouth",
  },
];

export const paidProductSampleData = [
  {
    id: 1,
    product_id: "WYZEC3X2",
    product_name: "Wyze Cam v3",
    brand: "WYZE",
    keywords: "",
    exclude_keywords: "",
  },
  {
    id: 2,
    product_id: "960-000733",
    product_name: "AIRWHEEL Q5 AWQ5BLU double wheels electric scooter",
    brand: "Radioshack",
    keywords: "Intuitive Controls,  LED lights",
    exclude_keywords: "",
    product_description:
      "RadioShack Airwheel Q5 AWQ5BLU Double Wheels Electric Scooter is designed for the modern commuter and adventurous spirit, this sleek and innovative scooter offers a blend of performance, style, and convenience. All purchases from this Web Site are made pursuant to a shipment contract. Lightweight and foldable, the Airwheel Q5 is designed for easy transport and storage.",
    feature_bullet1:
      "Equipped with a robust electric motor, the Q5 delivers a top speed of up to 12 mph (20 km/h) and a range of up to 9 miles (15 km) on a single charge. Perfect for short commutes, quick errands, or leisurely rides.",
    feature_bullet2:
      "Built with high-quality materials, the Q5 is designed to withstand daily wear and tear.",
  },
  {
    id: 3,
    product_id: "BS27",
    product_name: "Beautyshade Jackie Sunglasses, Tortise",
    brand: "BeautyShade",
    keywords:
      "classic style, tortiseshell rims, UV protection, fashionable, durable, elegant, protective case",
    exclude_keywords: "",
  },
  {
    id: 4,
    product_id: "142152375",
    product_name: "Naxa 4-In-1 Pro Gaming Combo",
    brand: "Circuitcity",
    keywords: "Upto 3200 DPI , Dynamic RGB,Stereo audio",
    exclude_keywords: "",
    feature_bullet1:
      "Equipped with dynamic backlighting and anti-ghosting technology, the gaming keyboard ensures every keystroke is registered with precision.",
    feature_bullet2:
      "The included mouse pad features a non-slip base and a smooth surface for precise mouse movement, ensuring uninterrupted gameplay.",
    feature_bullet3:
      "Easy to set up with a simple plug-and-play design, the Naxa 4-In-1 Pro Gaming Combo is compatible with most PCs and gaming consoles, allowing you to get started right away.",
    feature_bullet4:
      "Featuring adjustable DPI settings up to 3200 DPI, customizable buttons, and an ergonomic design, the gaming mouse provides accurate tracking and swift response times, giving you an edge in every game.",
    product_description:
      "The Circuitcity Naxa 4-In-1 Pro Gaming Combo offers a gaming mouse, RGB-backlit keyboard, stereo headset, and durable mousepad—perfect for enhancing any gaming setup and an ideal birthday gift for gamers. Circuitcity may collect demographic information like your birthday to improve your shopping experience, with third-party providers assisting in secure data processing where needed.",
  },
  {
    id: 5,
    product_id: "52205",
    product_name: "BBT-102 Plus 9 inch Multimedia Player",
    brand: "National",
    keywords: "Mounting bracket",
    exclude_keywords: "",
    product_description:
      "Introducing the National BBT-102 Plus 9-inch Multimedia Player, a must-have for every car enthusiast seeking impeccable entertainment on the go. This advanced multimedia player combines a sleek design with cutting-edge technology to enhance your driving experience. You can  create an account or profile on a website or application. Enjoy seamless connectivity with the latest audio and video formats including MP3, MP4, and AVI.",
    feature_bullet1:
      "Make your journeys more enjoyable with the National BBT-102 Plus 9-inch Multimedia Player.",
    feature_bullet2:
      "The high-resolution 9-inch screen delivers stunning visuals, making your favorite movies and shows come to life.",
  },
  {
    id: 6,
    product_id: "ABCD1234",
    product_name: "Hydr8 Water Bottle",
    brand: "Hydr8",
    keywords:
      "Ocean-blue, BPA free, made from 50% recycled materials, durable construction, lid attached with keeper loop, includes carabiner",
    exclude_keywords: "",
    product_description:
      "Hydr8 allows for a completely organic customer facing experience delivering plastic-free and high quality coffee solutions, bottle and can-free flavored beverages, non-packaged snacks, and compostable disposables cost effectively.",
    feature_bullet1:
      "Crafted from BPA-free, food-grade stainless steel, the Hydr8 bottle ensures that your drinks remain free from harmful chemicals and tastes.",
    feature_bullet2:
      "The secure, leak-proof lid guarantees no spills or drips, making it perfect for tossing in your gym bag or taking on the go.",
  },
];

export const imageRecSampleData = [
  {
    id: 1,
    image_id: "5077C002",
    item: "Canon EOS R5 C",
    optional_keywords: "",
    image_url:
      "https://s7d1.scene7.com/is/image/canon/5077C002_eos-r5-c_primary_clean?wid=1200",
  },
  {
    id: 2,
    image_id: "B01L1IICR2",
    item: "Sennheiser HD 599 Open Back Headphone, Ivory",
    optional_keywords: "",
    image_url:
      "https://m.media-amazon.com/images/I/61rC-yMhtZL._AC_SL1000_.jpg",
  },
  {
    id: 3,
    image_id: "B09S4VLZYD",
    item: "Casio Illuminator Watch",
    optional_keywords:
      "100 meter water resistant, easy-read wide LCD, long life battery",
    image_url: "https://m.media-amazon.com/images/I/71PUTD-MlAL._AC_UY741_.jpg",
  },
];

export const requiredFields = {
  product_id: "product_id",
  product_name: "product_name",
  brand: "brand",
};

export const requiredFieldsImgRec = {
  image_url: "image_url",
};

export const createCurrentRowData = (product, isSelected, isResultPage) => {
  var productData = {};
  if (isSelected === "product") {
    productData = {
      id: product?.id ? product?.id : "",
      product_id: product?.product_id ? product?.product_id : "",
      product_name: product?.product_name ? product?.product_name : "",
      persona: product?.persona ? product?.persona : "",
      product_description: product?.product_description
        ? product?.product_description
        : "",
      brand: product?.brand ? product?.brand : "",
      keywords: product?.keywords ? product?.keywords : "",
      seo_keywords: product?.seo_keywords? product?.seo_keywords : "",
      exclude_keywords: product?.exclude_keywords
        ? product?.exclude_keywords
        : "",
      feature_bullet1: product?.feature_bullet1 ? product?.feature_bullet1 : "",
      feature_bullet2: product?.feature_bullet2 ? product?.feature_bullet2 : "",
      feature_bullet3: product?.feature_bullet3 ? product?.feature_bullet3 : "",
      feature_bullet4: product?.feature_bullet4 ? product?.feature_bullet4 : "",
      feature_bullet5: product?.feature_bullet5 ? product?.feature_bullet5 : "",
      Taxonomy: product?.Taxonomy ? product?.Taxonomy : "",
      seo_meta_description: product?.seo_meta_description
        ? product?.seo_meta_description
        : "",
      seo_meta_title: product?.seo_meta_title ? product?.seo_meta_title : "",
      status: product?.status ? product?.status : "",
      input_product_description: product?.input_product_description
        ? product?.input_product_description
        : "",
    };
  } else if (isSelected === "image" && isResultPage) {
    productData["id"] = product?.id ? product?.id : "";
    productData["persona"] = product?.persona ? product?.persona : "";
    productData["image_id"] = product?.image_id ? product?.image_id : "";
    productData["item"] = product?.item ? product?.item : "";
    productData["optional_keywords"] = product["optional_keywords"]
      ? product["optional_keywords"]
      : "";
    productData["image_url"] = product?.image_url ? product?.image_url : "";
    productData["labels"] = product?.labels ? product?.labels : "";
    productData["alt-text"] = product["alt-text"] ? product["alt-text"] : "";
    productData["Item Description"] = product["Item Description"]
      ? product["Item Description"]
      : "";
    productData["Feature_Bullet1"] = product?.Feature_Bullet1
      ? product?.Feature_Bullet1
      : "";
    productData["Feature_Bullet2"] = product?.Feature_Bullet2
      ? product?.Feature_Bullet2
      : "";
    productData["Feature_Bullet3"] = product?.Feature_Bullet3
      ? product?.Feature_Bullet3
      : "";
    productData["Feature_Bullet4"] = product?.Feature_Bullet4
      ? product?.Feature_Bullet4
      : "";
    productData["Feature_Bullet5"] = product?.Feature_Bullet5
      ? product?.Feature_Bullet5
      : "";
  } else if (isSelected === "image") {
    productData["id"] = product?.id;
    productData["image_id"] = product?.image_id ? product?.image_id : "";
    productData["item"] = product?.item ? product?.item : "";
    productData["optional_keywords"] = product?.optional_keywords
      ? product?.optional_keywords
      : "";
    productData["image_url"] = product?.image_url;
  }

  return productData;
};

export const defaultRow = {
  id: "0",
  persona: "Default",
  characteristics: "General product description not specific to any persona",
  promptExists: true,
};
export const defaultRow2 = {
  id: "1",
  persona: "Default",
  characteristics: "General product description not specific to any persona",
  promptExists: true,
};
export const defaultRow3 = {
  id: "2",
  persona: "Default",
  characteristics: "General product description not specific to any persona",
  promptExists: true,
};

export const defaultChannel = {
  id: "Default",
  channelName: "Default",
  channelDescription: "Default",
};
