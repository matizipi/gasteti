import { ImageResponse } from 'next/og';
import { PiggyBank } from 'lucide-react';



// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <PiggyBank size={28} color="#ff6b9e" />
      </div>
    ),
    {
      ...size,
    }
  );
}
