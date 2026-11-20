import { ImageResponse } from 'next/og'

// Preview card for shared links (LinkedIn, X, Slack, messengers).
export const alt =
  'Grocery first-order prototype: show the deal before the cart — minimum order, delivery fee and next slot up front'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const ORANGE = '#F07C22'
const PAPER = '#F4F2EF'
const INK = '#1F1A17'
const MUTED = '#6B635C'

const steps = ['Postcode', 'The deal', 'Shopping', 'Cart', 'Checkout']

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: PAPER,
          color: INK,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: ORANGE }} />
          <div style={{ fontSize: 28, color: MUTED }}>Grocery first-order prototype</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Show the deal before the cart
          </div>
          <div style={{ fontSize: 32, color: MUTED, lineHeight: 1.35, maxWidth: 940 }}>
            Minimum order, delivery fee, next slot and final price up front — and kept in view until checkout.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {steps.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  display: 'flex',
                  padding: '10px 20px',
                  borderRadius: 999,
                  fontSize: 24,
                  background: i === 1 ? ORANGE : '#FFFFFF',
                  color: i === 1 ? '#FFFFFF' : INK,
                  border: i === 1 ? `2px solid ${ORANGE}` : '2px solid #E2DDD7',
                }}
              >
                {step}
              </div>
              {i < steps.length - 1 && <div style={{ fontSize: 24, color: MUTED }}>→</div>}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
