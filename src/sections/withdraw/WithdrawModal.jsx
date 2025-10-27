import { useState } from 'react';

import PropTypes from 'prop-types';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Modal,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import {
  useClinicDetails,
  useCreateWithdrawal,
  useCreateYellowCardWithdrawal,
} from 'src/hooks/useClinicHooks';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const paymentMethods = [
  {
    key: 'mobile_money',
    label: 'Mobile Money',
    subtext: 'Pay with MTN Mobile Money or Airtel Money',
    provider: 'Powered by Pawapay',
    image: 'https://res.cloudinary.com/dxgz6a0ir/image/upload/v1744461197/image_30_fru9vt.png',
    comingSoon: false,
  },
  {
    key: 'bank_transfer',
    label: 'Bank Transfer',
    subtext: 'Pay via bank transfer',
    provider: 'Powered by Yellowcard',
    image: 'https://res.cloudinary.com/dxgz6a0ir/image/upload/v1753562179/image_31_ksjujf.png',
    comingSoon: true,
  },
];

export default function WithdrawModal({ open, handleClose }) {
  const [selectedMethod, setSelectedMethod] = useState('mobile_money');
  const [formData, setFormData] = useState({
    momoNumber: '',
    amount: '',
    accountNumber: '',
    accountName: '',
    bankName: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const { mutate: submitPawapay, isPending: isPawaPayPending } = useCreateWithdrawal();
  const { mutate: submitYellowCard, isPending: isYellowCardPending } =
    useCreateYellowCardWithdrawal();
  const { data: clinic } = useClinicDetails();

  const isBankTransfer = selectedMethod === 'bank_transfer';
  const isPending = isPawaPayPending || isYellowCardPending;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    const amount = Number(formData.amount);

    if (!formData.amount) errs.amount = 'Amount is required';
    else if (amount < 100) errs.amount = 'Minimum amount is 100 RWF';

    if (clinic?.balance != null && amount > clinic.balance) {
      errs.amount = `Insufficient balance. You have ${clinic.balance.toLocaleString()} RWF`;
    }

    if (isBankTransfer) {
      if (!formData.accountNumber) errs.accountNumber = 'Account number is required';
      if (!formData.accountName) errs.accountName = 'Account name is required';
      if (!formData.bankName) errs.bankName = 'Bank name is required';
    }

    if (!isBankTransfer) {
      if (!formData.momoNumber) errs.momoNumber = 'Mobile number is required';
      if (formData.momoNumber && !/^2507\d{8}$/.test(formData.momoNumber)) {
        errs.momoNumber = 'Invalid Rwandan mobile number (2507xxxxxxxx)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = isBankTransfer
      ? {
          accountNumber: formData.accountNumber,
          amount: Number(formData.amount),
          accountName: formData.accountName,
          bankName: formData.bankName,
        }
      : {
          phoneNumber: formData.momoNumber,
          amount: Number(formData.amount),
        };

    const mutation = isBankTransfer ? submitYellowCard : submitPawapay;

    mutation(payload, {
      onSuccess: () => {
        alert('Withdrawal submitted successfully.');
        handleClose();
        setFormData({
          momoNumber: '',
          amount: '',
          accountNumber: '',
          accountName: '',
          bankName: '',
        });
        setErrors({});
        setApiError('');
      },
      onError: (err) => {
        const msg =
          err?.response?.data?.failureMessage ||
          err?.response?.data?.message ||
          'Withdrawal failed';
        setApiError(msg);
      },
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle, maxHeight: '90vh', overflowY: 'auto' }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" mb={3}>
          Withdrawal
        </Typography>

        <Typography variant="subtitle2" mb={1}>
          Select Payment Method
        </Typography>

        <Box display="flex" flexDirection="column" gap={2} mb={2}>
          {paymentMethods.map((method) => (
            <Box
              key={method.key}
              onClick={() => {
                if (!method.comingSoon) setSelectedMethod(method.key);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor:
                  selectedMethod === method.key && !method.comingSoon ? '#22C55E' : '#E0E0E0',
                borderRadius: 2,
                p: 2,
                cursor: method.comingSoon ? 'not-allowed' : 'pointer',
                position: 'relative',
                opacity: method.comingSoon ? 0.5 : 1,
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <img src={method.image} alt={method.label} width={36} height={36} />
                <Box>
                  <Typography fontWeight="bold">
                    {method.label}{' '}
                    {method.comingSoon && (
                      <Typography
                        component="span"
                        variant="body2"
                        color="error"
                        fontWeight="bold"
                        ml={1}
                      >
                        (Coming Soon)
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {method.subtext}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {method.provider}
                  </Typography>
                </Box>
              </Box>
              {!method.comingSoon && selectedMethod === method.key && (
                <CheckCircleIcon sx={{ color: '#22C55E' }} />
              )}
            </Box>
          ))}
        </Box>

        {/* ✅ Fee and delay disclaimers */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            A {isBankTransfer ? '1%' : '2%'} processing fee will be charged on all withdrawals.
          </Typography>

          {isBankTransfer && (
            <Typography variant="body2" color="warning.main" mt={0.5}>
              For YellowCard transactions, confirmation may take up to 24 hours.
            </Typography>
          )}
        </Box>

        {apiError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {apiError}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          {isBankTransfer ? (
            <>
              <TextField
                name="accountName"
                label="Account Name"
                value={formData.accountName}
                onChange={handleChange}
                error={!!errors.accountName}
                helperText={errors.accountName || ''}
                fullWidth
              />
              <TextField
                name="accountNumber"
                label="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                error={!!errors.accountNumber}
                helperText={errors.accountNumber || ''}
                fullWidth
              />
              <TextField
                name="bankName"
                label="Bank Name"
                value={formData.bankName}
                onChange={handleChange}
                error={!!errors.bankName}
                helperText={errors.bankName || ''}
                fullWidth
              />
            </>
          ) : (
            <>
              <TextField
                name="momoNumber"
                label="Mobile Money Number"
                value={formData.momoNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 15);
                  handleChange({ target: { name: 'momoNumber', value } });
                }}
                error={!!errors.momoNumber}
                helperText={errors.momoNumber || ''}
                inputProps={{ inputMode: 'numeric', maxLength: 15 }}
                fullWidth
                placeholder="250788123456"
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: -1, mb: 1, display: 'block', textAlign: 'center' }}
              >
                Enter your MoMo number as <b>2507XXXXXXXX</b> (without the + sign) to avoid payment
                issues.
              </Typography>
            </>
          )}

          <TextField
            name="amount"
            label="Amount"
            value={formData.amount}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount || 'Withdrawal amount in RWF'}
            type="number"
            fullWidth
          />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              sx={{
                backgroundColor: '#22C55E',
                color: '#fff',
                '&:hover': { backgroundColor: '#1FA14A' },
              }}
            >
              {isPending ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Withdraw'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

WithdrawModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
