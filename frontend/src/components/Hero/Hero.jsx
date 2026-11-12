import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="bsu-hero"
      style={{
        width: "100%",
        minHeight: "590px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 90px",
        boxSizing: "border-box",
        background:
          "linear-gradient(135deg, #071a3d 0%, #0a2b60 52%, #0b4ea2 100%)",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background */}

      <div
        style={{
          position: "absolute",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.07)",
          top: "-260px",
          right: "-120px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.05)",
          bottom: "-220px",
          left: "-120px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(96,165,250,0.10)",
          filter: "blur(2px)",
          right: "14%",
          bottom: "15%",
        }}
      />

      {/* Content */}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "9px",
            padding: "8px 15px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#dbeafe",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            marginBottom: "22px",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#60a5fa",
              boxShadow: "0 0 0 5px rgba(96,165,250,0.12)",
            }}
          />

          PT Bintang Sayap Utama
        </div>

        {/* Heading */}

        <h1
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: "clamp(40px, 7vw, 72px)",
            lineHeight: 1.08,
            fontWeight: 800,
            letterSpacing: "-0.045em",
          }}
        >
          Bangun Kariermu
          <br />
          <span
            style={{
              color: "#93c5fd",
            }}
          >
            Bersama BSU
          </span>
        </h1>

        {/* Description */}

        <p
          style={{
            maxWidth: "680px",
            margin: "24px auto 0",
            color: "rgba(255,255,255,0.78)",
            fontSize: "17px",
            lineHeight: 1.75,
          }}
        >
          Temukan kesempatan untuk berkembang dan menjadi bagian
          dari PT Bintang Sayap Utama. Jelajahi berbagai peluang
          karier dan event recruitment yang tersedia.
        </p>

        {/* CTA */}

        <div
          className="bsu-hero-actions"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginTop: "34px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            style={{
              minHeight: "48px",
              padding: "0 24px",
              border: "1px solid #ffffff",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#071a3d",
              fontSize: "14px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
              transition:
                "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            Lihat Lowongan
          </button>

          <button
            type="button"
            onClick={() => navigate("/events")}
            style={{
              minHeight: "48px",
              padding: "0 24px",
              border: "1px solid rgba(255,255,255,0.28)",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.07)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              transition:
                "background 0.2s ease, border-color 0.2s ease",
            }}
          >
            Lihat Event
          </button>
        </div>

        {/* Bottom information */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "18px",
            marginTop: "46px",
            color: "rgba(255,255,255,0.55)",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          <span>Career Opportunity</span>

          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.35)",
            }}
          />

          <span>Recruitment BSU</span>
        </div>
      </div>

      {/* Responsive */}

      <style>
        {`
          .bsu-hero-actions button:first-child:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 32px rgba(0,0,0,0.22) !important;
          }

          .bsu-hero-actions button:last-child:hover {
            background: rgba(255,255,255,0.14) !important;
            border-color: rgba(255,255,255,0.42) !important;
          }

          @media (max-width: 600px) {
            .bsu-hero {
              min-height: 560px !important;
              padding: 110px 20px 70px !important;
            }

            .bsu-hero-actions {
              flex-direction: column;
              width: 100%;
            }

            .bsu-hero-actions button {
              width: 100%;
              max-width: 300px;
            }
          }

          @media (max-width: 420px) {
            .bsu-hero {
              min-height: 540px !important;
            }

            .bsu-hero p {
              font-size: 15px !important;
            }
          }
        `}
      </style>
    </section>
  );
}

export default Hero;