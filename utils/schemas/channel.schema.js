import { z } from "zod";

export const channelFormSchema = z.object({
  channelName: z.string().trim().min(1, "Channel Name is required"),
  channelDescription: z.string().optional(),
});

export const BlogChannelConfigFormSchema = z.object({
  blog_description: z.string().trim().min(1, "Description is required"),
  blog_length: z
    .object({
      minLength: z
        .number({ invalid_type_error: "Min Length must be a number" })
        .min(50, "Min Length must be at least 50"),
      maxLength: z
        .number({ invalid_type_error: "Max Length must be a number" })
        .min(100, "Max Length must be at least 100"),
    })
    .refine((data) => data.maxLength > data.minLength, {
      message: "Max Length must be greater than Min Length",
      path: ["maxLength"],
    }),
});

export const channelConfigFormSchema = z.object({
  featureBullets: z
    .object({
      minLength: z
        .number({ invalid_type_error: "Min Length must be a number" })
        .min(50, "Min Length must be at least 50"),
      maxLength: z
        .number({ invalid_type_error: "Max Length must be a number" })
        .min(100, "Max Length must be at least 100"),
      traits: z.array(z.string().trim().min(1, "Trait cannot be empty")),
    })
    .refine((data) => data.maxLength > data.minLength, {
      message: "Max Length must be greater than Min Length",
      path: ["maxLength"],
    }),
  shortDescription: z
    .object({
      minLength: z
        .number({ invalid_type_error: "Min Length must be a number" })
        .min(50, "Min Length must be at least 50"),
      maxLength: z
        .number({ invalid_type_error: "Max Length must be a number" })
        .min(100, "Max Length must be at least 100"),
    })
    .refine((data) => data.maxLength > data.minLength, {
      message: "Max Length must be greater than Min Length",
      path: ["maxLength"],
    }),

  longDescription: z
    .object({
      minLength: z
        .number({ invalid_type_error: "Min Length must be a number" })
        .min(50, "Min Length must be at least 50"),
      maxLength: z
        .number({ invalid_type_error: "Max Length must be a number" })
        .min(100, "Max Length must be at least 100"),
    })
    .refine((data) => data.maxLength > data.minLength, {
      message: "Max Length must be greater than Min Length",
      path: ["maxLength"],
    }),
});
