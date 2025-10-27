import { useState } from 'react';

import PropTypes from 'prop-types';

import { Box, Modal, Stack, Button, CircularProgress } from '@mui/material';

import { useUpdateOrderStatus, useFetchClinicOrderDetails } from 'src/hooks/useClinicHooks';

import {
  TestList,
  OrderHeader,
  ReasonModal,
  OrderInfoSection,
  InsuranceDetails,
  RejectOrderModal,
  StatusHistoryModal,
} from './orderDetail';

const ClinicOrderDetailsModal = ({ orderId, open, onClose }) => {
  const { data, isLoading } = useFetchClinicOrderDetails(orderId);
  const { mutate, isPending } = useUpdateOrderStatus();

  const [statusMap, setStatusMap] = useState({});
  const [errorMap, setErrorMap] = useState({});
  const [successMap, setSuccessMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectingTest, setRejectingTest] = useState(null);
  const [openReasonModal, setOpenReasonModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [pendingStatus, setPendingStatus] = useState('');

  const [statusHistory, setStatusHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const order = data?.data;
  const isRejectable = order?.paymentMethod?.toLowerCase() === 'insurance';

  const handleSelectChange = (status, test) => {
    if (['rejected', 'cancelled', 'failed'].includes(status)) {
      if (status === 'rejected' && isRejectable) {
        setRejectingTest(test);
        setOpenRejectModal(true);
        return;
      }
      setSelectedTest(test);
      setPendingStatus(status);
      setOpenReasonModal(true);
      return;
    }

    setStatusMap((prev) => ({ ...prev, [test._id]: status }));
    setLoadingMap((prev) => ({ ...prev, [test._id]: true }));

    mutate(
      { orderId: order._id, testId: test._id, status },
      {
        onSuccess: () => {
          setErrorMap((prev) => ({ ...prev, [test._id]: '' }));
          setSuccessMap((prev) => ({ ...prev, [test._id]: true }));
          setTimeout(() => {
            setSuccessMap((prev) => ({ ...prev, [test._id]: false }));
          }, 5000);
        },
        onError: (err) => {
          const message = err?.response?.data?.message || 'Failed to update status.';
          setErrorMap((prev) => ({ ...prev, [test._id]: message }));
        },
        onSettled: () => {
          setLoadingMap((prev) => ({ ...prev, [test._id]: false }));
        },
      }
    );
  };

  const handleConfirmReason = (statusReason) => {
    if (!selectedTest || !pendingStatus) return;

    mutate(
      {
        orderId: order._id,
        testId: selectedTest._id,
        status: pendingStatus,
        statusReason,
      },
      {
        onSuccess: () => {
          setStatusMap((prev) => ({ ...prev, [selectedTest._id]: pendingStatus }));
          setErrorMap((prev) => ({ ...prev, [selectedTest._id]: '' }));
          setSuccessMap((prev) => ({ ...prev, [selectedTest._id]: true }));
          setTimeout(() => {
            setSuccessMap((prev) => ({ ...prev, [selectedTest._id]: false }));
          }, 5000);
        },
        onError: (err) => {
          const message = err?.response?.data?.message || 'Failed to update status.';
          setErrorMap((prev) => ({ ...prev, [selectedTest._id]: message }));
        },
        onSettled: () => {
          setOpenReasonModal(false);
          setSelectedTest(null);
          setPendingStatus('');
        },
      }
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          outline: 'none',
        }}
        onClick={onClose}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: '85vw',
            maxWidth: '1400px',
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          {isLoading ? (
            <CircularProgress sx={{ display: 'block', margin: '2rem auto', color: '#00AC4F' }} />
          ) : (
            <>
              <OrderHeader orderId={order?.orderId} />

              <OrderInfoSection
                patient={order?.patient}
                publicBooker={order?.publicBooker}
                deliveryAddress={order?.deliveryAddress}
                paymentMethod={order?.paymentMethodLabel}
                deliveryMethod={order?.deliveryMethod}
                currencySymbol={order?.currencySymbol}
                totalAmount={order?.totalAmount}
                createdAt={order?.createdAt}
                isPublicBooking={order?.isPublicBooking}
              />

              <InsuranceDetails insuranceDetails={order?.insuranceDetails} />

              <TestList
                tests={order?.tests || []}
                statusMap={statusMap}
                successMap={successMap}
                errorMap={errorMap}
                loadingMap={loadingMap}
                isRejectable={isRejectable}
                currencySymbol={order?.currencySymbol}
                onSelectChange={handleSelectChange}
                renderExtraActions={(test) => (
                  <Stack direction="row" justifyContent="flex-end">
                    <Button
                      size="small"
                      variant="text"
                      sx={{
                        fontSize: '0.7rem',
                        padding: '1px 4px',
                        minWidth: 'unset',
                        textTransform: 'none',
                        fontWeight: 400,
                        lineHeight: 1.2,
                      }}
                      disabled={!test.statusHistory?.length}
                      onClick={() => {
                        setStatusHistory(test.statusHistory);
                        setShowHistoryModal(true);
                      }}
                    >
                      View History
                    </Button>
                  </Stack>
                )}
              />

              {rejectingTest && (
                <RejectOrderModal
                  open={openRejectModal}
                  orderId={order._id}
                  testId={rejectingTest._id}
                  handleClose={() => {
                    setOpenRejectModal(false);
                    setRejectingTest(null);
                  }}
                  onSuccess={() => {
                    setStatusMap((prev) => ({
                      ...prev,
                      [rejectingTest._id]: 'rejected',
                    }));
                    setErrorMap((prev) => ({ ...prev, [rejectingTest._id]: '' }));
                    setSuccessMap((prev) => ({ ...prev, [rejectingTest._id]: true }));
                    setTimeout(() => {
                      setSuccessMap((prev) => ({ ...prev, [rejectingTest._id]: false }));
                    }, 5000);
                    setOpenRejectModal(false);
                    setRejectingTest(null);
                  }}
                />
              )}

              <ReasonModal
                open={openReasonModal}
                title={`Confirm ${pendingStatus}`}
                message={`Please provide a reason for marking this test as ${pendingStatus}.`}
                loading={isPending}
                onClose={() => {
                  setOpenReasonModal(false);
                  setPendingStatus('');
                  setSelectedTest(null);
                }}
                onConfirm={handleConfirmReason}
              />

              <StatusHistoryModal
                open={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                history={statusHistory}
              />
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

ClinicOrderDetailsModal.propTypes = {
  orderId: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ClinicOrderDetailsModal;
