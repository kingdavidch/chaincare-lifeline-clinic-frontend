import { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Container,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { data } from './data';

export default function FaqPage() {
  const [expanded, setExpanded] = useState(null);

  const handleChange = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#fff',
        position: 'relative',
        py: { xs: 2, md: 4 },
        overflow: 'hidden',
        borderRadius: 2,
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            color: '#1a1a1a',
            mb: 5,
          }}
        >
          Frequently Asked Questions
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {data.map((faq) => (
            <Accordion
              key={faq.id}
              expanded={expanded === faq.id}
              onChange={() => handleChange(faq.id)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #0DB058',
                borderRadius: '50px !important',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: expanded === faq.id ? '#fff' : '#1a1a1a',
                      fontSize: '24px',
                    }}
                  />
                }
                sx={{
                  backgroundColor: expanded === faq.id ? '#0DB058' : 'transparent',
                  px: { xs: 2, md: 4 },
                  py: 2,
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: expanded === faq.id ? '#0a9047' : 'rgba(13, 176, 88, 0.1)',
                  },
                  '& .MuiAccordionSummary-content': { margin: 0 },
                }}
              >
                <Typography
                  sx={{
                    color: expanded === faq.id ? '#fff' : '#1a1a1a',
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 600,
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
                <Typography
                  sx={{
                    color: '#333',
                    fontSize: '16px',
                    lineHeight: 1.6,
                    mb: faq.videoUrl ? 2 : 0,
                  }}
                >
                  {faq.answer}
                </Typography>

                {faq.videoUrl && (
                  <Box
                    sx={{
                      position: 'relative',
                      paddingBottom: '56.25%',
                      height: 0,
                      overflow: 'hidden',
                      borderRadius: '12px',
                      mt: 2,
                    }}
                  >
                    <iframe
                      src={faq.videoUrl}
                      title={faq.question}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: '12px',
                      }}
                    />
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
