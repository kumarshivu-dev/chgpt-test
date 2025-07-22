const onboardingSteps = [
  {
    title:
      "Browse all products, pick the ones you want content for, and hit 'Generate'",
    images: [
      "/dashboard/products/step-1.png",
      "/dashboard/products/step-2.png",
      "/dashboard/products/step-3.png",
    ],
  },
  {
    title: "Choose your content enhancement: Boost SEO or Refine Taxonomy!",
    images: [
      "/dashboard/products/step-4.png",
      "/dashboard/products/step-5.png",
      "/dashboard/products/step-6.png",
      "/dashboard/products/step-7.png",
      "/dashboard/products/step-8.png",
      "/dashboard/products/step-9.png",
    ],
  },
  {
    title: "Get ready and wait for the ContentHubGPT magic",
    images: [
      "/dashboard/products/step-10.png",
      "/dashboard/products/step-11.png",
    ],
  },
  {
    title: "Check content compliance effortlessly — We've got you covered!",
    images: [
      "/dashboard/compliance/compliance-step-1.png",
      "/dashboard/compliance/compliance-step-2.png",
      "/dashboard/compliance/compliance-step-3.png",
    ],
  },
  {
    title: "Instantly verify content readiness for SEO — No more waiting!",
    images: [
      "/dashboard/seo-readiness/seo-readiness-step-1.png",
      "/dashboard/seo-readiness/seo-readiness-step-2.png",
      "/dashboard/seo-readiness/seo-readiness-step-3.png",
    ],
  },
];

const mobileOnboardingSteps = [
  {
    title:
      "Browse all products, pick the ones you want content for, and hit 'Generate'",
    images: [
      "/dashboard/mobile-step-1.png",
      "/dashboard/mobile-step-2.png",
      "/dashboard/mobile-step-3.png",
    ],
  },
  {
    title: "Choose your content enhancement: Boost SEO or Refine Taxonomy!",
    images: [
      "/dashboard/mobile-step-4.png",
      "/dashboard/mobile-step-5.png",
      "/dashboard/mobile-step-6.png",
      "/dashboard/taxonomy-mobile-step-1.png",
      "/dashboard/taxonomy-mobile-step-2.png",
      "/dashboard/mobile-step-7.png",
    ],
  },
  {
    title: "Get ready and wait for the ContentHubGPT magic",
    images: ["/dashboard/mobile-step-8.png", "/dashboard/mobile-step-9.png"],
  },
  {
    title: "Check content compliance effortlessly — We've got you covered!",
    images: [
      "/dashboard/compliance-mobile-step-1.png",
      "/dashboard/compliance-mobile-step-2.png",
      "/dashboard/compliance-mobile-step-3.png",
    ],
  },
  {
    title: "Instantly verify content readiness for SEO — No more waiting!",
    images: [
      "/dashboard/seo-readiness-mobile-step-1.png",
      "/dashboard/seo-readiness-mobile-step-2.png",
      "/dashboard/seo-readiness-mobile-step-3.png",
    ],
  },
];

const brandVoiceSteps = [
  {
    title: "Unlock your Brand Voice with our unique feature!",
    images: [
      "/brand-voice/brand-voice-step-1.png",
      "/brand-voice/brand-voice-step-2.png",
      "/brand-voice/brand-voice-step-3.png",
      "/brand-voice/brand-voice-step-4.png",
      "/brand-voice/brand-voice-step-5.png",
    ],
  },
];

const mobileBrandVoiceSteps = [
  {
    title: "Unlock your Brand Voice with our unique feature!",
    images: [
      "/brand-voice/brand-voice-mobile-step-1.png",
      "/brand-voice/brand-voice-mobile-step-2.png",
      "/brand-voice/brand-voice-mobile-step-3.png",
      "/brand-voice/brand-voice-mobile-step-4.png",
      "/brand-voice/brand-voice-mobile-step-5.png",
    ],
  },
];

const hyperTargetingSteps = [
  {
    title: "Delivering the most relevant and targeted results for you",
    images: [
      "/hypertargeting/hypertargeting-step-1.png",
      "/hypertargeting/hypertargeting-step-2.png",
      "/hypertargeting/hypertargeting-step-3.png",
    ],
  },
];

const mobileHyperTargetingSteps = [
  {
    title: "Delivering the most relevant and targeted results for you",
    images: [
      "/hypertargeting/hypertargeting-step-1-mobile.png",
      "/hypertargeting/hypertargeting-step-2-mobile.png",
      "/hypertargeting/hypertargeting-step-3-mobile.png",
    ],
  },
];

const imageRecOnboardingSteps = [
  {
    title: "Experience our image recognition feature tailored just for you.",
    images: [
      "/dashboard/image-rec/image-rec-step-1.png",
      "/dashboard/image-rec/image-rec-step-2.png",
      "/dashboard/image-rec/image-rec-step-3.png",
    ],
  },
  {
    title: "Your images are being analyzed!",
    images: [
      "/dashboard/image-rec/image-rec-step-4.png",
      "/dashboard/image-rec/image-rec-step-5.png",
    ],
  },
];

const mobileImageRecOnboardingSteps = [
  {
    title: "Experience our image recognition feature tailored just for you.",
    images: [
      "/dashboard/image-rec/image-rec-step-1-mobile.png",
      "/dashboard/image-rec/image-rec-step-2-mobile.png",
      "/dashboard/image-rec/image-rec-step-3-mobile.png",
    ],
  },
  {
    title: "Your images are being analyzed!",
    images: [
      "/dashboard/image-rec/image-rec-step-4-mobile.png",
      "/dashboard/image-rec/image-rec-step-5-mobile.png",
    ],
  },
];

export const tourStepsConfig = {
  "/dashboard/products": {
    desktop: {
      product: onboardingSteps,
      imageRec: imageRecOnboardingSteps,
    },
    mobile: {
      product: mobileOnboardingSteps,
      imageRec: mobileImageRecOnboardingSteps,
    },
  },
  "/dashboard/settings/brand-voice": {
    desktop: { product: brandVoiceSteps },
    mobile: { product: mobileBrandVoiceSteps },
  },
  "/dashboard/settings/hypertarget": {
    desktop: { product: hyperTargetingSteps },
    mobile: { product: mobileHyperTargetingSteps },
  },
};
