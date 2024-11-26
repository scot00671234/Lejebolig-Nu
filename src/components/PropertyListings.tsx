import React, { useEffect } from 'react';
import { usePropertyStore } from '../store/propertyStore';
import PropertyCard from './PropertyCard';
import { Grid, Container, Typography, Box, CircularProgress } from '@mui/material';

const PropertyListings: React.FC = () => {
  const { properties, loading, error, fetchProperties } = usePropertyStore();

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!properties.length) {
    return (
      <Box textAlign="center" p={4}>
        <Typography>Ingen boliger fundet.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item key={property.id} xs={12} sm={6} md={4}>
            <PropertyCard property={property} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PropertyListings;
