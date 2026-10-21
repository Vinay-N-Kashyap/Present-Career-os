import React from 'react';
import { Metadata } from 'next';
import CentralCampusTransportManager from '@/components/admin/CentralCampusTransportManager';

export const metadata: Metadata = {
  title: 'Campus Transport & EV Fleet Management | PinIT Central University OS',
  description: 'Motor Vehicles Act 1988 compliance, EV shuttle dispatch, fuel card telemetry, and fleet operations console'
};

export default function CampusTransportPage() {
  return <CentralCampusTransportManager />;
}
