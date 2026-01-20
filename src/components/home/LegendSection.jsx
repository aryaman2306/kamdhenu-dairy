import { useEffect, useRef } from "react";
import "../../styles/legend.css";

export default function LegendSection() {
  const actsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    actsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="legend-section">
      <div className="legend-container">
        <h2 className="legend-title">The Legend of Kamdhenu</h2>

        {/* ACT 1 */}
        <div
          className="legend-act"
          ref={(el) => (actsRef.current[0] = el)}
        >
          <div className="legend-image">
            <img
              src="/images/samudra-manthan.jpg"
              alt="Samudra Manthan"
            />
          </div>
          <p className="legend-text">
            From the great churning of the cosmic ocean — Samudra Manthan —
            emerged forces of chaos, creation, and divine balance.
          </p>
        </div>

        {/* ACT 2 */}
        <div
          className="legend-act"
          ref={(el) => (actsRef.current[1] = el)}
        >
          <div className="legend-image">
            <img
              src="/images/kamdhenu-emergence.jpg"
              alt="Emergence of Kamdhenu"
            />
          </div>
          <p className="legend-text">
            From this moment of cosmic balance arose Kamdhenu — the divine cow,
            symbol of nourishment, abundance, and selfless giving.
          </p>
        </div>

        {/* ACT 3 */}
        <div
          className="legend-act"
          ref={(el) => (actsRef.current[2] = el)}
        >
          <div className="legend-image">
            <img
              src="/images/kamdhenu-blessing.jpg"
              alt="Blessings of Kamdhenu"
            />
          </div>
          <p className="legend-text">
            Kamdhenu’s blessings flow through care, sustenance, and purity —
            reminding us that true nourishment is both physical and spiritual.
          </p>

          <p className="legend-epilogue">
            Inspired by this timeless belief, Kamdhenu Dairy strives to honour
            nourishment not just as food — but as care, responsibility, and
            trust.
          </p>
        </div>
      </div>
    </section>
  );
}
