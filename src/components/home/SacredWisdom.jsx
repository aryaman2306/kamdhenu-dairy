import "../../styles/sacred-wisdom.css";

export default function SacredWisdom() {
  return (
    <section className="sacred-section">
      {/* Background Layer (isolated) */}
      <div className="sacred-bg" />

      {/* Content Layer */}
      <div className="sacred-overlay">
        <div className="sacred-container">
          <h2 className="sacred-title">Sacred Wisdom</h2>
          <p className="sacred-subtitle">
            Ancient verses honoring the divine cow
          </p>

          <div className="sacred-grid">
            <div className="sacred-card">
              <span className="quote-mark">“</span>
              <h3>गावो विश्वस्य मातरः</h3>
              <p className="translation">
                “Cows are the mothers of the universe”
              </p>
              <span className="source">— Rig Veda</span>
            </div>

            <div className="sacred-card">
              <span className="quote-mark">“</span>
              <h3>
                धेनुः कामदुघा नित्यं
                <br />
                पार्वती परमेश्वरी
              </h3>
              <p className="translation">
                “The divine cow Kamdhenu fulfills all desires eternally”
              </p>
              <span className="source">— Puranas</span>
            </div>

            <div className="sacred-card">
              <span className="quote-mark">“</span>
              <h3>
                सर्वे देवाः स्थिता देहे
                <br />
                सर्वे देवा सनातनाः
              </h3>
              <p className="translation">
                “All gods reside in the body of the sacred cow”
              </p>
              <span className="source">— Mahabharata</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
