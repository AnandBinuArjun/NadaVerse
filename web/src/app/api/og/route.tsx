import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query parameters with elegant fallbacks
    const ragaName = searchParams.get('raga') || 'Mayamalavagowla';
    const ragaMl = searchParams.get('ml') || 'മായാമാളവഗൗള';
    const melakarta = searchParams.get('melakarta') || '15';
    const arohanam = searchParams.get('arohanam') || 'S R₁ G₃ M₁ P D₁ N₃ Ṡ';
    const avarohanam = searchParams.get('avarohanam') || 'Ṡ N₃ D₁ P M₁ G₃ R₁ S';
    const subtitle = searchParams.get('desc') || 'Carnatic Music Discovery, Knowledge & Practice Platform';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0d0c0a',
            padding: '50px 60px',
            fontFamily: 'serif',
            color: '#F4EBDD',
            position: 'relative',
            border: '8px solid #1f1d17'
          }}
        >
          {/* Golden radial background glow */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(199,164,91,0.25) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(50px)'
            }}
          />

          {/* Top Brand Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid rgba(199,164,91,0.3)',
              paddingBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #DFB960, #C7A45B)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#11110F'
                }}
              >
                ॐ
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '26px',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    background: 'linear-gradient(90deg, #F4EBDD, #C7A45B)',
                    backgroundClip: 'text',
                    color: '#C7A45B'
                  }}
                >
                  NadaVerse
                </span>
                <span style={{ fontSize: '12px', color: '#BDB4A4', fontFamily: 'monospace' }}>
                  ANCIENT NAADAM · MODERN RIGOR
                </span>
              </div>
            </div>

            {melakarta && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 20px',
                  borderRadius: '12px',
                  backgroundColor: '#1c1a14',
                  border: '1.5px solid #C7A45B',
                  color: '#E0C98F',
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Melakarta #{melakarta}
              </div>
            )}
          </div>

          {/* Main Raga Presentation */}
          <div style={{ display: 'flex', flexDirection: 'column', margin: '30px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '60px',
                  fontWeight: 'bold',
                  color: '#F4EBDD',
                  marginRight: '20px'
                }}
              >
                {ragaName}
              </span>
              {ragaMl && (
                <span
                  style={{
                    fontSize: '34px',
                    color: '#C7A45B',
                    opacity: 0.9
                  }}
                >
                  ({ragaMl})
                </span>
              )}
            </div>

            <p
              style={{
                fontSize: '18px',
                color: '#BDB4A4',
                marginTop: '10px',
                maxWidth: '900px',
                lineHeight: '1.4'
              }}
            >
              {subtitle}
            </p>

            {/* Notation Showcase Box */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#161410',
                border: '1px solid rgba(199,164,91,0.3)',
                borderRadius: '16px',
                padding: '20px 24px',
                marginTop: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    color: '#C7A45B',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    width: '140px'
                  }}
                >
                  AROHANAM:
                </span>
                <span
                  style={{
                    fontSize: '22px',
                    letterSpacing: '2px',
                    color: '#F4EBDD',
                    fontFamily: 'monospace'
                  }}
                >
                  {arohanam}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    color: '#C7A45B',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    width: '140px'
                  }}
                >
                  AVAROHANAM:
                </span>
                <span
                  style={{
                    fontSize: '22px',
                    letterSpacing: '2px',
                    color: '#F4EBDD',
                    fontFamily: 'monospace'
                  }}
                >
                  {avarohanam}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(199,164,91,0.2)',
              paddingTop: '18px',
              fontSize: '14px',
              color: '#87947A',
              fontFamily: 'monospace'
            }}
          >
            <span>Verified Just Intonation Ragas · Web Audio Tanpura & Tala Metronome</span>
            <span style={{ color: '#C7A45B' }}>nadaverse.abarjun.online</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
