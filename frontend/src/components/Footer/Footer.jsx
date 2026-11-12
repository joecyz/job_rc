import instagramIcon from "../../assets/images/instagram.png";
import facebookIcon from "../../assets/images/facebook.png";

function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#ffffff",
        padding: "90px 24px 150px",
        color: "#111111",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr 0.6fr",
          gap: "80px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Company Information */}
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "42px",
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#050505",
            }}
          >
            PT Bintang Sayap Utama
          </h2>

          <p
            style={{
              margin: "26px 0 0",
              maxWidth: "760px",
              fontSize: "18px",
              lineHeight: 1.8,
              color: "#222222",
            }}
          >
            Jl. Subur No.1, RT.05/RW.05, Penarukan, Kec. Kepanjen,
            Kabupaten Malang, Jawa Timur 65163. Telp +62 822-2500-0968
          </p>

          <p
            style={{
              margin: "34px 0 0",
              fontSize: "16px",
              color: "#222222",
            }}
          >
            Copyright © 2026 PT Bintang Sayap Utama
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "42px",
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#050505",
            }}
          >
            Follow Us
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              marginTop: "26px",
            }}
          >
            {/* Facebook */}
            <a
              href="https://www.facebook.com/bintang.utama.638852/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook PT Bintang Sayap Utama"
              style={{
                width: "64px",
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: "transparent",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <img
                src={facebookIcon}
                alt="Facebook"
                style={{
                  width: "64px",
                  height: "64px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/bsu_recruitment/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram PT Bintang Sayap Utama"
              style={{
                width: "64px",
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: "#ffffff",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <img
                src={instagramIcon}
                alt="Instagram"
                style={{
                  width: "64px",
                  height: "64px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </a>
          </div>
        </div>
      </div>

      {/* BSU Decorative Curve */}
      <div
        style={{
          position: "absolute",
          left: "-5%",
          right: "-5%",
          bottom: "-105px",
          height: "190px",
          background: "#17177a",
          borderRadius: "50% 50% 0 0 / 45% 45% 0 0",
          transform: "rotate(-4deg)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "48%",
          right: "-5%",
          bottom: "-105px",
          height: "145px",
          background: "#16608f",
          borderRadius: "50% 50% 0 0 / 45% 45% 0 0",
          transform: "rotate(-7deg)",
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "54%",
          right: "-5%",
          bottom: "-125px",
          height: "135px",
          background: "#ffffff",
          borderRadius: "50% 50% 0 0 / 45% 45% 0 0",
          transform: "rotate(-8deg)",
          zIndex: 3,
        }}
      />

      <style>
        {`
          @media (max-width: 900px) {
            footer > div:first-child {
              grid-template-columns: 1fr !important;
              gap: 45px !important;
            }
          }

          @media (max-width: 600px) {
            footer {
              padding: 60px 20px 120px !important;
            }

            footer h2 {
              font-size: 30px !important;
            }

            footer p {
              font-size: 14px !important;
            }

            footer a {
              width: 54px !important;
              height: 54px !important;
            }

            footer a img {
              width: 54px !important;
              height: 54px !important;
            }
          }
        `}
      </style>
    </footer>
  );
}

export default Footer;