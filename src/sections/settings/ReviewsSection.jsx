import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { Box, Card, Stack, Button, Rating, Typography, CardContent } from '@mui/material';

const ReviewsSection = ({ reviews }) => {
  const [expandedReviews, setExpandedReviews] = useState({});
  const maxCommentLength = 100;

  const toggleExpanded = (index) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', pb: 1 }}>
      <Stack direction="row" spacing={2}>
        {reviews?.map((review, index) => {
          const commentToShow = expandedReviews[index]
            ? review?.comment
            : `${review?.comment?.slice(0, maxCommentLength)}`;

          return (
            <Card
              key={index}
              sx={{
                minWidth: 300,
                maxWidth: 300,
                borderRadius: '10px',
                boxShadow: 2,
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold', textTransform: 'capitalize', mb: 1 }}
                >
                  {review?.patient?.fullName || 'Anonymous'}
                </Typography>

                <Rating
                  name={`clinic-rating-${index}`}
                  value={review.rating}
                  precision={0.5}
                  readOnly
                  sx={{ mb: 1 }}
                />

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: expandedReviews[index] ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {commentToShow}
                </Typography>

                {review?.comment?.length > maxCommentLength && (
                  <Button
                    onClick={() => toggleExpanded(index)}
                    size="small"
                    sx={{ mt: 1, textTransform: 'none', p: 0 }}
                  >
                    {expandedReviews[index] ? 'View less' : 'View more...'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

ReviewsSection.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      rating: PropTypes.number,
      comment: PropTypes.string,
      patient: PropTypes.shape({
        fullName: PropTypes.string,
      }),
    })
  ),
};

export default ReviewsSection;
