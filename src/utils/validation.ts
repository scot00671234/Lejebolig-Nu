import { PropertyType } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  propertyType: PropertyType;
  size: string;
  bedrooms: string;
  bathrooms: string;
  deposit: string;
  availableFrom: string;
  petsAllowed: boolean;
  furnished: boolean;
}

export const validatePropertyForm = (data: PropertyFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Title validation
  if (!data.title.trim()) {
    errors.push({ field: 'title', message: 'Titel er påkrævet' });
  } else if (data.title.length < 5) {
    errors.push({ field: 'title', message: 'Titel skal være mindst 5 tegn' });
  }

  // Property Type validation
  if (!data.propertyType || !Object.values(PropertyType).includes(data.propertyType)) {
    errors.push({ field: 'propertyType', message: 'Vælg venligst en gyldig boligtype' });
  }

  // Description validation
  if (!data.description.trim()) {
    errors.push({ field: 'description', message: 'Beskrivelse er påkrævet' });
  } else if (data.description.length < 20) {
    errors.push({ field: 'description', message: 'Beskrivelse skal være mindst 20 tegn' });
  }

  // Price validation
  const price = Number(data.price);
  if (!price) {
    errors.push({ field: 'price', message: 'Pris er påkrævet' });
  } else if (price < 1000) {
    errors.push({ field: 'price', message: 'Pris skal være mindst 1.000 kr.' });
  } else if (price > 100000) {
    errors.push({ field: 'price', message: 'Pris skal være under 100.000 kr.' });
  }

  // Location validation
  if (!data.location.trim()) {
    errors.push({ field: 'location', message: 'Adresse er påkrævet' });
  } else if (data.location.length < 5) {
    errors.push({ field: 'location', message: 'Indtast venligst en gyldig adresse' });
  }

  // Size validation
  const size = Number(data.size);
  if (!size) {
    errors.push({ field: 'size', message: 'Størrelse er påkrævet' });
  } else if (size < 10) {
    errors.push({ field: 'size', message: 'Størrelse skal være mindst 10 m²' });
  } else if (size > 1000) {
    errors.push({ field: 'size', message: 'Størrelse skal være under 1.000 m²' });
  }

  // Bedrooms validation
  const bedrooms = Number(data.bedrooms);
  if (!bedrooms) {
    errors.push({ field: 'bedrooms', message: 'Antal værelser er påkrævet' });
  } else if (bedrooms < 1) {
    errors.push({ field: 'bedrooms', message: 'Der skal være mindst 1 værelse' });
  } else if (bedrooms > 20) {
    errors.push({ field: 'bedrooms', message: 'Antal værelser skal være under 20' });
  }

  // Bathrooms validation
  const bathrooms = Number(data.bathrooms);
  if (!bathrooms) {
    errors.push({ field: 'bathrooms', message: 'Antal badeværelser er påkrævet' });
  } else if (bathrooms < 1) {
    errors.push({ field: 'bathrooms', message: 'Der skal være mindst 1 badeværelse' });
  } else if (bathrooms > 10) {
    errors.push({ field: 'bathrooms', message: 'Antal badeværelser skal være under 10' });
  }

  // Deposit validation
  const deposit = Number(data.deposit);
  if (!deposit) {
    errors.push({ field: 'deposit', message: 'Depositum er påkrævet' });
  } else if (deposit < 1000) {
    errors.push({ field: 'deposit', message: 'Depositum skal være mindst 1.000 kr.' });
  } else if (deposit > 100000) {
    errors.push({ field: 'deposit', message: 'Depositum skal være under 100.000 kr.' });
  }

  // Available from validation
  if (!data.availableFrom) {
    errors.push({ field: 'availableFrom', message: 'Dato er påkrævet' });
  } else {
    const availableFromDate = new Date(data.availableFrom);
    const today = new Date();
    if (availableFromDate < today) {
      errors.push({ field: 'availableFrom', message: 'Dato skal være i fremtiden' });
    }
  }

  return errors;
};
