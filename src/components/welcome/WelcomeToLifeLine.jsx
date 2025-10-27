import PropTypes from 'prop-types';

import { Box, Button, Typography, CircularProgress } from '@mui/material';

import { useClinicDetails, useAcceptContract } from 'src/hooks/useClinicHooks';

export default function WelcomeToLifeLine() {
  const { data: clinic, isLoading: loadingClinic } = useClinicDetails();
  const { mutate: acceptContract, isPending } = useAcceptContract();

  const handleAccept = () => {
    if (!clinic?.contractAccepted) {
      const confirmed = window.confirm(
        'Are you sure you want to accept the contract and register your clinic with LifeLine?'
      );
      if (confirmed) {
        acceptContract();
      }
    }
  };

  if (loadingClinic || !clinic) return null;

  if (clinic.contractAccepted) return null;

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        padding: { xs: 3, md: 6 },
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Welcome To <span style={{ color: '#22C55E' }}>LifeLine</span>
      </Typography>

      <Typography variant="subtitle1" mb={3}>
        Partner with us by supporting our subscription
      </Typography>

      <Typography variant="body1" mb={4} maxWidth="700px" mx="auto">
        By joining LifeLine, your clinic can provide affordable, life-saving clinical tests to
        patients while ensuring seamless claim approvals and real-time outpatient tracking.
      </Typography>

      <Typography variant="h6" fontWeight="bold" mb={2}>
        Why Partner with LifeLine?
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          gap: 3,
          mb: 4,
        }}
      >
        <InfoCard
          img="/assets/icons/welcome/fast.svg"
          title="Fast Payments"
          desc="We pay claims within 30 days, so you never have to worry about delays in receiving your money."
        />
        <InfoCard
          img="/assets/icons/welcome/integration.svg"
          title="Seamless Integration"
          desc="Instant claim approvals through smart contracts, no need for calls for patient ID verification."
        />
        <InfoCard
          img="/assets/icons/welcome/impact.svg"
          title="Scalable Impact"
          desc="Help us make healthcare accessible and efficient for millions across Africa."
        />
      </Box>

      <Typography variant="body1" mb={2}>
        Support our mission. Partner today.
      </Typography>

      <Typography variant="h6" fontWeight="bold" mb={2}>
        Covered Clinical Tests
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr' },
          gap: 1.5,
          mb: 4,
          maxWidth: '600px',
          mx: 'auto',
          textAlign: 'left',
        }}
      >
        {[
          'Malaria Test (RDT/Blood Smear)',
          'Typhoid Test (Widal)',
          'Complete Blood Count (CBC/FBC)',
          'Urinalysis',
          'Blood Glucose (Random)',
          'HIV Test (Rapid)',
          'Hepatitis B Surface Antigen (HBsAg) Test',
          'Stool Microscopy',
          'Erythrocyte Sedimentation Rate (ESR)',
          'Blood Pressure Check',
        ].map((test, index) => (
          <Typography key={index} variant="body2">
            {index + 1}. {test}
          </Typography>
        ))}
      </Box>

      <Button
        variant="contained"
        disabled={clinic.contractAccepted || isPending}
        onClick={handleAccept}
        sx={{
          backgroundColor: '#22C55E',
          color: '#fff',
          paddingX: 4,
          paddingY: 1,
          borderRadius: '30px',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#16A34A',
          },
        }}
      >
        {isPending ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Register'}
      </Button>
    </Box>
  );
}

// Sub-component with PropTypes
function InfoCard({ img, title, desc }) {
  return (
    <Box
      sx={{
        backgroundColor: '#F0FDF4',
        border: '1px solid #DCFCE7',
        borderRadius: '12px',
        padding: 3,
        flex: 1,
      }}
    >
      <img src={img} alt={title} width={32} height={32} />
      <Typography variant="subtitle1" fontWeight="bold" mt={1}>
        {title}
      </Typography>
      <Typography variant="body2" mt={1}>
        {desc}
      </Typography>
    </Box>
  );
}

InfoCard.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};
