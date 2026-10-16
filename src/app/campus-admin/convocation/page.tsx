import React from 'react';
import ConvocationManager from '@/components/admin/ConvocationManager';

export const metadata = {
  title: 'Convocation Ceremony & Cryptographic Degree Registry | Campus Admin',
  description: 'Statutory 160-credit degree audit validation, Chancellor digital authentication seals, and National Academic Depository integration.',
};

export default function ConvocationPage() {
  return <ConvocationManager />;
}
