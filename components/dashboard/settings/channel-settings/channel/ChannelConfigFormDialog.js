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
import { channelConfigFormSchema } from "../../../../../utils/schemas/channel.schema";
import CustomToolTip from "../../../../../components/common-ui/CustomToolTip";
import { Help, Delete } from "@mui/icons-material";
import {
  useGetChannelDataQuery,
  useUpdateChannelDataMutation,
} from "../../../../../store/services/channel.services";
import { useEffect } from "react";
import { useToast } from "../../../../../context/ToastContext";

const highlightSuggestion = [
  "Claims or Nutritionals",
  "Product type/form",
  "Flavor or Variety",
  "Consumption Occasion & Food Pairing",
  "Package Functionality/Benefit",
];

const ChannelConfigFormDialog = ({ open, onClose, channelId, channelData }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(channelConfigFormSchema),
    defaultValues: {
      featureBullets: {
        minLength: 50,
        maxLength: 100,
        traits: [],
      },
      shortDescription: { minLength: 50, maxLength: 100 },
      longDescription: { minLength: 50, maxLength: 100 },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "featureBullets.traits",
  });

  const { showToast } = useToast();

  const { refetch } = useGetChannelDataQuery(channelId);
  const [updateChannelData, { isLoading: isAdding }] =
    useUpdateChannelDataMutation();

  const onSubmit = async (data) => {
    data.featureBullets.traits = getValues("featureBullets.traits");
    await updateChannelData?.({ id: channelId, data });
    refetch();
    onClose();
  };

  useEffect(() => {
    if (channelData) {
      setValue(
        "featureBullets.minLength",
        channelData?.featureBullets?.minLength ?? 50
      );
      setValue(
        "featureBullets.maxLength",
        channelData?.featureBullets?.maxLength ?? 100
      );
      setValue(
        "featureBullets.traits",
        channelData?.featureBullets?.traits ?? []
      );
      setValue(
        "shortDescription",
        channelData?.shortDescription ?? { minLength: 50, maxLength: 100 }
      );
      setValue(
        "longDescription",
        channelData?.longDescription ?? { minLength: 50, maxLength: 100 }
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
                Feature Bullets{" "}
                <CustomToolTip
                  title="Provide keywords for each highlight to match the purpose of each Feature bullet point."
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
                {...register?.("featureBullets.minLength", {
                  valueAsNumber: true,
                })}
                error={!!errors?.featureBullets?.minLength}
                helperText={errors?.featureBullets?.minLength?.message}
              />
              <TextField
                variant="standard"
                fullWidth
                label="Max Length *"
                {...register?.("featureBullets.maxLength", {
                  valueAsNumber: true,
                })}
                error={!!errors?.featureBullets?.maxLength}
                helperText={errors?.featureBullets?.maxLength?.message}
              />
            </Stack>

            <Stack spacing={1}>
              {fields?.map?.((field, index) => (
                <TextField
                  autoFocus
                  key={field?.id}
                  variant="standard"
                  placeholder={`eg. ${
                    highlightSuggestion[index % highlightSuggestion?.length]
                  }`}
                  {...register?.(`featureBullets.traits.${index}`)}
                  fullWidth
                  label={`Highlight ${index + 1} *`}
                  error={!!errors?.featureBullets?.traits?.[index]}
                  helperText={errors?.featureBullets?.traits?.[index]?.message}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => remove(index)}>
                        <Delete />
                      </IconButton>
                    ),
                  }}
                />
              ))}
            </Stack>
          </Stack>

          <Divider>
            <Chip
              label="Add Trait"
              variant="outlined"
              color="primary"
              size="small"
              disabled={fields?.length >= 5}
              onClick={() => {
                const lastIndex = fields.length - 1;
                if (lastIndex >= 0) {
                  const lastTraitValue = getValues(
                    `featureBullets.traits.${lastIndex}`
                  )?.trim();
                  if (!lastTraitValue) {
                    showToast("Trait can't be empty", "warning");
                    return;
                  }
                }
                append("");
              }}
              sx={{ padding: "10px", cursor: "pointer", fontSize: "14px" }}
            />
          </Divider>

          <Stack spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center" }} gap={1}>
              <Typography variant="body-2">
                Short Description
                <CustomToolTip
                  title="Set the min and max character length for the short description."
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
                {...register?.("shortDescription.minLength", {
                  valueAsNumber: true,
                })}
                error={!!errors?.shortDescription?.minLength}
                helperText={errors?.shortDescription?.minLength?.message}
              />
              <TextField
                variant="standard"
                fullWidth
                label="Max Length *"
                {...register?.("shortDescription.maxLength", {
                  valueAsNumber: true,
                })}
                error={!!errors?.shortDescription?.maxLength}
                helperText={errors?.shortDescription?.maxLength?.message}
              />
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center" }} gap={1}>
              <Typography variant="body-2">
                Long Description
                <CustomToolTip
                  title="Set the min and max character length for the long description."
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
                {...register?.("longDescription.minLength", {
                  valueAsNumber: true,
                })}
                error={!!errors?.longDescription?.minLength}
                helperText={errors?.longDescription?.minLength?.message}
              />
              <TextField
                variant="standard"
                fullWidth
                label="Max Length *"
                {...register?.("longDescription.maxLength", {
                  valueAsNumber: true,
                })}
                error={!!errors?.longDescription?.maxLength}
                helperText={errors?.longDescription?.maxLength?.message}
              />
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

export default ChannelConfigFormDialog;
