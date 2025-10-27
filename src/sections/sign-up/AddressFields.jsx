import PropTypes from 'prop-types';

import { TextField, Autocomplete } from '@mui/material';

const toTitle = (s) =>
  s
    ? s
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    : '';

export function AddressFields({
  currentCountryConfig,
  formData,
  errors,
  handleAddressChange,
  cityOptions = [],
}) {
  if (!currentCountryConfig) return null;

  return (
    <>
      {currentCountryConfig.requiredFields.map((field) => {
        if (field === 'street' || field === 'cityOrDistrict') return null;
        const fieldLabel = currentCountryConfig.fieldLabels[field] || field;
        return (
          <TextField
            key={field}
            label={fieldLabel}
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData[field] || ''}
            onChange={(e) => handleAddressChange(field, e.target.value)}
            error={!!errors[field]}
            helperText={errors[field]}
            inputProps={{ maxLength: 100 }}
          />
        );
      })}

      {currentCountryConfig.requiredFields.includes('cityOrDistrict') && (
        <Autocomplete
          fullWidth
          freeSolo
          options={cityOptions.map((city) => ({
            label: toTitle(city),
            value: city,
          }))}
          value={
            formData.cityOrDistrict
              ? {
                  label: toTitle(formData.cityOrDistrict),
                  value: formData.cityOrDistrict,
                }
              : null
          }
          onChange={(_, newValue) => handleAddressChange('cityOrDistrict', newValue?.value || '')}
          onInputChange={(_, newInputValue) =>
            handleAddressChange('cityOrDistrict', newInputValue || '')
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={currentCountryConfig.fieldLabels.cityOrDistrict || 'City/District'}
              variant="outlined"
              margin="normal"
              error={!!errors.cityOrDistrict}
              helperText={errors.cityOrDistrict}
              inputProps={{
                ...params.inputProps,
                maxLength: 100,
              }}
            />
          )}
        />
      )}

      {currentCountryConfig.requiredFields.includes('street') && (
        <TextField
          label="Street Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.street}
          onChange={(e) => handleAddressChange('street', e.target.value)}
          error={!!errors.street}
          helperText={errors.street}
          inputProps={{ maxLength: 100 }}
        />
      )}

      <TextField
        label="Postal Code (Optional)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.postalCode}
        onChange={(e) => handleAddressChange('postalCode', e.target.value)}
        inputProps={{ maxLength: 10 }}
      />
    </>
  );
}

AddressFields.propTypes = {
  currentCountryConfig: PropTypes.shape({
    requiredFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    fieldLabels: PropTypes.objectOf(PropTypes.string).isRequired,
  }),
  formData: PropTypes.object.isRequired,
  errors: PropTypes.objectOf(PropTypes.string).isRequired,
  handleAddressChange: PropTypes.func.isRequired,
  cityOptions: PropTypes.arrayOf(PropTypes.string),
};
