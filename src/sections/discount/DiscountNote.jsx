import { Alert, AlertTitle } from '@mui/material';

export default function DiscountNote() {
  return (
    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
      <AlertTitle>Note</AlertTitle>
      You can create unlimited discount codes. Codes expire automatically based on the validity
      period you set.
    </Alert>
  );
}
