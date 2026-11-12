import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";
import { getFAQs } from "../../services/faqService";

function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  // ==================================================
  // FETCH FAQ
  // ==================================================

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFAQs(search);

      console.log("FAQ DATA:", data);

      setFaqs(data.results || []);
      setOpenId(null);
    } catch (error) {
      console.error(
        "FAQ ERROR:",
        error.response?.data || error
      );

      setError("Gagal mengambil FAQ.");
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // SEARCH
  // ==================================================

  const handleSearch = async (e) => {
    e.preventDefault();

    await fetchFAQs();
  };

  // ==================================================
  // TOGGLE FAQ
  // ==================================================

  const toggleFAQ = (id) => {
    setOpenId((currentId) =>
      currentId === id ? null : id
    );
  };

  // ==================================================
  // RESET SEARCH
  // ==================================================

  const handleReset = async () => {
    setSearch("");

    try {
      setLoading(true);
      setError("");

      const data = await getFAQs("");

      setFaqs(data.results || []);
      setOpenId(null);
    } catch (error) {
      console.error(
        "FAQ ERROR:",
        error.response?.data || error
      );

      setError("Gagal mengambil FAQ.");
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div
        className="bsu-faq-page"
        style={{
          minHeight: "calc(100vh - 72px)",
          background: "#f4f6f9",
          paddingBottom: "90px",
        }}
      >
        {/* ==================================================
            HERO
        ================================================== */}

        <section
          className="faq-hero"
          style={{
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #071a3d 0%, #0b4ea2 100%)",
            color: "#ffffff",
            padding: "72px 24px 108px",
          }}
        >
          {/* Decorative circles */}

          <div
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              border:
                "1px solid rgba(255,255,255,0.08)",
              top: "-250px",
              right: "-100px",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "230px",
              height: "230px",
              borderRadius: "50%",
              border:
                "1px solid rgba(255,255,255,0.06)",
              bottom: "-160px",
              left: "-90px",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background:
                "rgba(96,165,250,0.08)",
              right: "20%",
              bottom: "-45px",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "820px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {/* Eyebrow */}

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 14px",
                borderRadius: "999px",
                background:
                  "rgba(255,255,255,0.09)",
                border:
                  "1px solid rgba(255,255,255,0.14)",
                color: "#dbeafe",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                marginBottom: "18px",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#60a5fa",
                  boxShadow:
                    "0 0 0 5px rgba(96,165,250,0.12)",
                }}
              />

              Recruitment Information
            </div>

            {/* Title */}

            <h1
              style={{
                margin: 0,
                fontSize:
                  "clamp(38px, 5vw, 56px)",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              Frequently Asked
              <br />
              <span
                style={{
                  color: "#93c5fd",
                }}
              >
                Questions
              </span>
            </h1>

            <p
              style={{
                maxWidth: "650px",
                margin: "20px auto 0",
                color:
                  "rgba(255,255,255,0.78)",
                fontSize: "16px",
                lineHeight: 1.75,
              }}
            >
              Temukan jawaban atas pertanyaan
              yang sering diajukan seputar
              recruitment dan proses bergabung
              bersama PT Bintang Sayap Utama.
            </p>
          </div>
        </section>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <main
          style={{
            maxWidth: "1000px",
            margin: "-58px auto 0",
            padding: "0 24px",
            position: "relative",
            zIndex: 5,
            boxSizing: "border-box",
          }}
        >
          {/* ==================================================
              SEARCH CARD
          ================================================== */}

          <section
            style={{
              background: "#ffffff",
              border:
                "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "26px",
              boxShadow:
                "0 18px 45px rgba(7,26,61,0.10)",
              marginBottom: "38px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "11px",
                  background: "#eaf2ff",
                  color: "#0b4ea2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "17px",
                  fontWeight: 800,
                }}
              >
                ?
              </div>

              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#071a3d",
                    fontSize: "19px",
                    fontWeight: 800,
                    letterSpacing:
                      "-0.01em",
                  }}
                >
                  Cari Pertanyaan
                </h2>

                <p
                  style={{
                    margin: "3px 0 0",
                    color: "#64748b",
                    fontSize: "12px",
                  }}
                >
                  Ketik kata kunci untuk
                  menemukan informasi yang kamu
                  butuhkan.
                </p>
              </div>
            </div>

            <form
              className="bsu-faq-search"
              onSubmit={handleSearch}
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: "10px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  flex: 1,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    color: "#64748b",
                    fontSize: "19px",
                    pointerEvents:
                      "none",
                  }}
                >
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Contoh: cara melamar, dokumen, recruitment..."
                  style={{
                    width: "100%",
                    height: "48px",
                    boxSizing: "border-box",
                    padding:
                      "0 16px 0 44px",
                    borderRadius: "10px",
                    border:
                      "1px solid #dbe3ed",
                    background: "#f8fafc",
                    color: "#172033",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  minWidth: "112px",
                  height: "48px",
                  padding: "0 18px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#0b4ea2",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 800,
                  transition:
                    "background 0.2s ease, transform 0.2s ease",
                }}
              >
                Cari FAQ
              </button>

              {search && (
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    height: "48px",
                    padding: "0 16px",
                    border:
                      "1px solid #dbe3ed",
                    borderRadius: "10px",
                    background: "#ffffff",
                    color: "#334155",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Reset
                </button>
              )}
            </form>
          </section>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <section
              style={{
                background: "#ffffff",
                border:
                  "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "75px 24px",
                textAlign: "center",
                boxShadow:
                  "0 8px 25px rgba(7,26,61,0.05)",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  border:
                    "4px solid #dbeafe",
                  borderTop:
                    "4px solid #0b4ea2",
                  borderRadius: "50%",
                  margin:
                    "0 auto 18px",
                  animation:
                    "faqSpin 1s linear infinite",
                }}
              />

              <h3
                style={{
                  margin: "0 0 6px",
                  color: "#071a3d",
                  fontSize: "16px",
                  fontWeight: 800,
                }}
              >
                Memuat FAQ
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Sedang mengambil pertanyaan
                yang tersedia...
              </p>
            </section>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && (
            <section
              style={{
                background: "#ffffff",
                border:
                  "1px solid #fecaca",
                borderRadius: "18px",
                padding: "55px 24px",
                textAlign: "center",
                boxShadow:
                  "0 8px 25px rgba(7,26,61,0.04)",
              }}
            >
              <div
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "16px",
                  background: "#fef2f2",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin:
                    "0 auto 17px",
                  fontSize: "23px",
                  fontWeight: 800,
                }}
              >
                !
              </div>

              <h3
                style={{
                  margin: "0 0 7px",
                  color: "#071a3d",
                  fontSize: "19px",
                  fontWeight: 800,
                }}
              >
                FAQ tidak dapat dimuat
              </h3>

              <p
                style={{
                  margin: "0 0 20px",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                {error}
              </p>

              <button
                type="button"
                onClick={fetchFAQs}
                style={{
                  padding: "11px 20px",
                  border: "none",
                  borderRadius: "9px",
                  background: "#071a3d",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Coba Lagi
              </button>
            </section>
          )}

          {/* ==================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            faqs.length === 0 && (
              <section
                style={{
                  background: "#ffffff",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "70px 24px",
                  textAlign: "center",
                  boxShadow:
                    "0 8px 25px rgba(7,26,61,0.04)",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "18px",
                    background: "#eaf2ff",
                    color: "#0b4ea2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin:
                      "0 auto 18px",
                    fontSize: "26px",
                    fontWeight: 800,
                  }}
                >
                  ?
                </div>

                <h3
                  style={{
                    margin: "0 0 8px",
                    color: "#071a3d",
                    fontSize: "20px",
                    fontWeight: 800,
                  }}
                >
                  Tidak ada FAQ ditemukan
                </h3>

                <p
                  style={{
                    maxWidth: "450px",
                    margin:
                      "0 auto 20px",
                    color: "#64748b",
                    fontSize: "13px",
                    lineHeight: 1.7,
                  }}
                >
                  Belum ada pertanyaan yang
                  sesuai dengan pencarian kamu.
                  Coba gunakan kata kunci lain.
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      padding:
                        "11px 20px",
                      border: "none",
                      borderRadius: "9px",
                      background: "#0b4ea2",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    Lihat Semua FAQ
                  </button>
                )}
              </section>
            )}

          {/* ==================================================
              FAQ LIST
          ================================================== */}

          {!loading &&
            !error &&
            faqs.length > 0 && (
              <section>
                {/* SECTION HEADER */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent:
                      "space-between",
                    gap: "20px",
                    marginBottom: "18px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: "40px",
                        height: "4px",
                        borderRadius:
                          "999px",
                        background: "#0b4ea2",
                        marginBottom: "10px",
                      }}
                    />

                    <h2
                      style={{
                        margin: 0,
                        color: "#071a3d",
                        fontSize: "25px",
                        fontWeight: 800,
                        letterSpacing:
                          "-0.02em",
                      }}
                    >
                      Pertanyaan Umum
                    </h2>

                    <p
                      style={{
                        margin:
                          "5px 0 0",
                        color: "#64748b",
                        fontSize: "13px",
                      }}
                    >
                      Klik pertanyaan untuk
                      melihat jawabannya.
                    </p>
                  </div>

                  <span
                    style={{
                      padding:
                        "7px 11px",
                      borderRadius:
                        "999px",
                      background: "#eaf2ff",
                      color: "#0b4ea2",
                      fontSize: "11px",
                      fontWeight: 800,
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {faqs.length} FAQ
                  </span>
                </div>

                {/* FAQ ITEMS */}

                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "12px",
                  }}
                >
                  {faqs.map((faq, index) => {
                    const isOpen =
                      openId === faq.id;

                    return (
                      <article
                        key={faq.id}
                        className={`bsu-faq-item ${
                          isOpen
                            ? "is-open"
                            : ""
                        }`}
                        style={{
                          background:
                            "#ffffff",
                          border: isOpen
                            ? "1px solid #9db8d8"
                            : "1px solid #e2e8f0",
                          borderRadius:
                            "14px",
                          overflow:
                            "hidden",
                          boxShadow: isOpen
                            ? "0 12px 28px rgba(7,26,61,0.08)"
                            : "0 5px 16px rgba(7,26,61,0.035)",
                          transition:
                            "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                        }}
                      >
                        {/* QUESTION */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleFAQ(
                              faq.id
                            )
                          }
                          aria-expanded={
                            isOpen
                          }
                          style={{
                            width: "100%",
                            padding:
                              "20px",
                            background:
                              "#ffffff",
                            border: "none",
                            color:
                              "#071a3d",
                            textAlign:
                              "left",
                            cursor:
                              "pointer",
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            gap: "18px",
                          }}
                        >
                          <span
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "flex-start",
                              gap: "13px",
                              minWidth: 0,
                            }}
                          >
                            {/* NUMBER */}

                            <span
                              style={{
                                width:
                                  "32px",
                                height:
                                  "32px",
                                borderRadius:
                                  "9px",
                                background:
                                  isOpen
                                    ? "#0b4ea2"
                                    : "#eaf2ff",
                                color:
                                  isOpen
                                    ? "#ffffff"
                                    : "#0b4ea2",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                flexShrink: 0,
                                fontSize:
                                  "11px",
                                fontWeight:
                                  800,
                              }}
                            >
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <span
                              style={{
                                paddingTop:
                                  "5px",
                                fontSize:
                                  "14px",
                                lineHeight:
                                  1.55,
                                fontWeight:
                                  800,
                                color:
                                  "#071a3d",
                              }}
                            >
                              {
                                faq.question
                              }
                            </span>
                          </span>

                          {/* PLUS */}

                          <span
                            className="bsu-faq-icon"
                            style={{
                              width:
                                "30px",
                              height:
                                "30px",
                              borderRadius:
                                "9px",
                              background:
                                isOpen
                                  ? "#071a3d"
                                  : "#f1f5f9",
                              color:
                                isOpen
                                  ? "#ffffff"
                                  : "#0b4ea2",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              flexShrink: 0,
                              fontSize:
                                "19px",
                              fontWeight:
                                500,
                              transition:
                                "all 0.2s ease",
                            }}
                          >
                            {isOpen
                              ? "−"
                              : "+"}
                          </span>
                        </button>

                        {/* ANSWER */}

                        {isOpen && (
                          <div
                            style={{
                              padding:
                                "0 20px 20px 65px",
                            }}
                          >
                            <div
                              style={{
                                borderTop:
                                  "1px solid #edf0f5",
                                paddingTop:
                                  "16px",
                                color:
                                  "#526174",
                                fontSize:
                                  "14px",
                                lineHeight:
                                  1.8,
                                whiteSpace:
                                  "pre-line",
                              }}
                            >
                              {
                                faq.answer
                              }
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
        </main>
      </div>

      {/* ==================================================
          STYLE
      ================================================== */}

      <style>
        {`
          @keyframes faqSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          .bsu-faq-item:hover {
            transform: translateY(-2px);
            border-color: #c9d7e8 !important;
            box-shadow: 0 10px 24px rgba(7,26,61,0.07) !important;
          }

          .bsu-faq-item.is-open:hover {
            border-color: #8faed1 !important;
          }

          .bsu-faq-search input:focus {
            border-color: #0b4ea2 !important;
            background: #ffffff !important;
            box-shadow:
              0 0 0 3px rgba(11,78,162,0.08);
          }

          .bsu-faq-search button[type="submit"]:hover {
            background: #071a3d !important;
            transform: translateY(-1px);
          }

          @media (max-width: 650px) {
            .faq-hero {
              padding: 58px 20px 100px !important;
            }

            .bsu-faq-page main {
              padding-left: 16px !important;
              padding-right: 16px !important;
            }

            .bsu-faq-search {
              flex-direction: column !important;
            }

            .bsu-faq-search button {
              width: 100%;
            }
          }

          @media (max-width: 480px) {
            .bsu-faq-item button {
              padding: 16px !important;
            }

            .bsu-faq-item > div {
              padding-left: 16px !important;
              padding-right: 16px !important;
            }

            .bsu-faq-icon {
              width: 27px !important;
              height: 27px !important;
            }
          }
        `}
      </style>
    </MainLayout>
  );
}

export default FAQ;