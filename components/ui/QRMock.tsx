import React from 'react';

interface QRMockProps {
  size?: number;
}

// Simple monochrome QR placeholder (no gradients)
export const QRMock: React.FC<QRMockProps> = ({ size = 96 }) => (
  <div
    className="rounded-sm overflow-hidden"
    style={{
      width: size,
      height: size,
      background:
        'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 12px 12px',
      border: '1px solid #000',
    }}
    aria-label="QR code placeholder"
  />
);
