import { Box, Chip, Modal, Stack, Typography, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import React from "react";

const ComplianceResultModal = ({ open, onClose, concern }) => {
  const isComplianceResultExist = concern?.complianceResults;
  const isComplianceResultCompliant =
    concern?.complianceResults?.compliant ?? true;
  const isBrandVoiceResultExist = concern?.brandVoiceResults;
  const isBrandVoiceResultCompliant = concern?.brandVoiceResults?.brand_voice_compliant ?? true;

  const bothCompliant =
    isComplianceResultCompliant && isBrandVoiceResultCompliant;



  // Utility to parse <HIGHLIGHT> tags and render with custom color
  function renderWithHighlight(text) {
    if (!text) return null;
    const parts = text.split(/(<HIGHLIGHT>.*?<\/HIGHLIGHT>)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("<HIGHLIGHT>") && part.endsWith("</HIGHLIGHT>")) {
        const inner = part.replace(/<\/?HIGHLIGHT>/g, "");
        return (
          <span key={idx} style={{ color: "#1976d2", fontWeight: 600 }}>
            {inner}
          </span>
        );
      }
      return (
        <span key={idx} style={{ color: "#d32f2f" }}>
          {part}
        </span>
      );
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#FFF",
          boxShadow: "0 3px 12px rgba(0, 0, 0, 0.18)",
          borderRadius: "14px",
          width: { xs: "92%", md: "38%" },
          p: 0,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)",
            color: "#fff",
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h5" fontWeight={700} letterSpacing={1}>
            Compliance Check Result
          </Typography>
        </Box>
        <Stack spacing={3} sx={{ p: 4 }}>
          {isComplianceResultExist && (
            <>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ minWidth: 140 }}
                >
                  Compliance Files
                </Typography>
                <Chip
                  size="medium"
                  icon={
                    isComplianceResultCompliant ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )
                  }
                  label={
                    isComplianceResultCompliant ? "Compliant" : "Non-Compliant"
                  }
                  color={isComplianceResultCompliant ? "success" : "error"}
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    px: 2,
                  }}
                />
              </Stack>
              {!isComplianceResultCompliant && (
              <Box
                sx={{
                  maxHeight: 300, // or adjust as needed
                  overflowY: "auto",
                  pr: 1, // for scrollbar spacing
                }}
              >
                {concern?.complianceResults?.concerns?.map((c, index) => (
                  <Box key={index} sx={{ pl: 2, pb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} mt={2}>
                      File: {c.source_file}
                    </Typography>
                    {c.violations.map((violation, idx) => (
                      <Typography
                        key={idx}
                        variant="body1"
                        sx={{
                          mt: 1,
                          fontWeight: 500,
                          display: "block",
                          lineHeight: 1.7,
                          fontSize: 17,
                          color: "#d32f2f",
                        }}
                      >
                        {renderWithHighlight(violation)}
                      </Typography>
                    ))}
                  </Box>
                ))}
              </Box>
            )}
              <Divider />
            </>
          )}
          {isBrandVoiceResultExist && (
            <>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ minWidth: 140 }}
                >
                  Brand Voice
                </Typography>
                <Chip
                  size="medium"
                  icon={
                    isBrandVoiceResultCompliant ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )
                  }
                  label={
                    isBrandVoiceResultCompliant
                      ? "Compliant"
                      : "Non-Compliant"
                  }
                  color={isBrandVoiceResultCompliant ? "success" : "error"}
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    px: 2,
                  }}
                />
              </Stack>
              {!isBrandVoiceResultCompliant && (
                <Typography
                  variant="body1"
                  color="error"
                  sx={{ pl: 1, fontWeight: 500 }}
                >
                  {concern?.brandVoiceResults?.concern}
                </Typography>
              )}
            </>
          )}
        </Stack>
      </Box>
    </Modal>
  );
};

export default ComplianceResultModal;
