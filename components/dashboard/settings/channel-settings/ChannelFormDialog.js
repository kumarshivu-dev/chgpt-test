import { useForm } from "react-hook-form";
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
} from "@mui/material";
import { channelFormSchema } from "../../../../utils/schemas/channel.schema";
import {
  useAddChannelDataMutation,
  useUpdateChannelDataMutation,
} from "../../../../store/services/channel.services";
import { useSelector } from "react-redux";
import { showToast } from "../../../../context/ToastContext";

const ChannelFormDialog = ({
  open,
  onClose,
  channelData,
  channelList,
  setSelectedChannelData,
}) => {
  console.log(channelList);
  const userState = useSelector((state) => state?.user);
  const brandSpecification = userState?.userInfo?.brandSpecification;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(channelFormSchema),
    defaultValues: channelData ?? {
      channelName: "",
      channelDescription: "",
    },
  });

  // RTK Query mutations
  const [addChannelData] = useAddChannelDataMutation();
  const [updateChannelData] = useUpdateChannelDataMutation();

  const onSubmit = async (data) => {
    const inputName = data?.channelName?.trim().toLowerCase();

    const isDuplicate = channelList?.some((channel) =>
      channel?.channelName?.trim().toLowerCase() === inputName &&
      channel?.id !== channelData?.id
    );

    if (isDuplicate) {
      showToast("Channel name already exists, please rename.", "error");
      return;
    }

    const finalPayload = {
      ...data,
      brandSpecific: brandSpecification?.brandSpecific ?? false,
      brandId: brandSpecification?.brandId ?? null,
    };

    channelData?.id
      ? updateChannelData({ id: channelData.id, data: finalPayload })
      : addChannelData(finalPayload);

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onSubmit),
        sx: {
          maxWidth: "700px",
          width: "700px",
          borderRadius: "10px",
          overflowY: "unset",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {channelData?.id
          ? "Edit Channel Information"
          : "Add Channel Information"}
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={3}>
          <TextField
            variant="standard"
            fullWidth
            label="Channel Name *"
            {...register("channelName")}
            error={!!errors?.channelName}
            helperText={errors?.channelName?.message}
            autoFocus
          />
          <TextField
            variant="standard"
            fullWidth
            label="Channel Description"
            {...register("channelDescription")}
            error={!!errors?.channelDescription}
            helperText={errors?.channelDescription?.message}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          {channelData?.id ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChannelFormDialog;
