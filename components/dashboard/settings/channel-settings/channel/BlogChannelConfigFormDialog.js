import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Typography,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import {
  BlogChannelConfigFormSchema,
  channelConfigFormSchema,
} from "../../../../../utils/schemas/channel.schema";
import CustomToolTip from "../../../../../components/common-ui/CustomToolTip";
import { Help, Delete } from "@mui/icons-material";
import {
  useGetChannelDataQuery,
  useUpdateChannelDataMutation,
} from "../../../../../store/services/channel.services";
import { useEffect } from "react";
import { useToast } from "../../../../../context/ToastContext";

const BlogChannelConfigFormDialog = ({
  open,
  onClose,
  channelId,
  channelData,
}) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(BlogChannelConfigFormSchema),
    defaultValues: {
      blog_description: "",
      blog_length: { minLength: 50, maxLength: 100 },
    },
  });

  const { showToast } = useToast();

  const { refetch } = useGetChannelDataQuery(channelId);
  const [updateChannelData, { isLoading: isAdding }] =
    useUpdateChannelDataMutation();

  const onSubmit = async (data) => {
    await updateChannelData?.({ id: channelId, data });
    refetch();
    onClose();
  };

  useEffect(() => {
    if (channelData) {
      setValue("blog_description", channelData?.blog_description ?? "");
      setValue(
        "blog_length",
        channelData?.blog_length ?? { minLength: 50, maxLength: 100 }
      );
    }
  }, [channelData, setValue]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit?.(onSubmit),
        sx: { maxWidth: "700px", width: "700px", borderRadius: "10px" },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Channel Configurations
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center" }} gap={1}>
              <Typography variant="body-2">
                Blog Description{" "}
                <CustomToolTip
                  title="Provide blog description here."
                  placement="right"
                >
                  <Help fontSize="10px" />
                </CustomToolTip>
              </Typography>
            </Box>
            <TextField
              autoFocus
              variant="standard"
              fullWidth
              multiline
              {...register?.("blog_description")}
              error={!!errors?.blog_description}
              helperText={errors?.blog_description?.message}
            />

            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center" }} gap={1}>
                <Typography variant="body-2">
                  Blog Length
                  <CustomToolTip
                    title="Set the min and max character length for the blog."
                    placement="right"
                  >
                    <Help fontSize="10px" />
                  </CustomToolTip>
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="Min Length *"
                  {...register?.("blog_length.minLength", {
                    valueAsNumber: true,
                  })}
                  error={!!errors?.blog_length?.minLength}
                  helperText={errors?.blog_length?.minLength?.message}
                />
                <TextField
                  variant="standard"
                  fullWidth
                  label="Max Length *"
                  {...register?.("blog_length.maxLength", {
                    valueAsNumber: true,
                  })}
                  error={!!errors?.blog_length?.maxLength}
                  helperText={errors?.blog_length?.maxLength?.message}
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          {isAdding ? "Submitting" : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlogChannelConfigFormDialog;
