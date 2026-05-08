import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { fetchStations, fetchPosition } from './services/api';

// --- Motion Variants ---
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
};

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
};

const Header = () => (
  <motion.div className="header" variants={fadeIn} initial="initial" animate="animate">
    <div className="logo-line">
      <span className="logo-text">Platform 4B</span>
    </div>
    <p className="tagline">
      Know exactly where to stand before your train arrives.
      <br />
      30 seconds. No sign-up needed.
    </p>
  </motion.div>
);

const ExampleChips = ({ onFill }) => {
  const examples = [
    { train: '12627', coach: 'S6', station: 'NDLS' },
    { train: '22691', coach: 'B3', station: 'SBC' },
    { train: '12301', coach: 'A1', station: 'HWH' },
    { train: '12952', coach: 'H1', station: 'BCT' },
    { train: '12001', coach: 'CC1', station: 'BPL' },
  ];

  return (
    <motion.div className="examples" variants={staggerContainer} initial="initial" animate="animate">
      {examples.map((ex, i) => (
        <motion.span 
          key={i} 
          className="ex-chip" 
          variants={fadeIn}
          whileHover={{ scale: 1.05, borderColor: 'var(--brand)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFill(ex.train, ex.coach, ex.station)}
        >
          {ex.train} · {ex.coach} · {ex.station}
        </motion.span>
      ))}
    </motion.div>
  );
};

const PlatformVisual = ({ position, coachId, color }) => {
  const PAD = 10;
  let coachPct;
  if (position === 'front') coachPct = PAD;
  else if (position === 'middle') coachPct = 50;
  else coachPct = 100 - PAD;

  return (
    <div className="platform-visual">
      <div className="platform-track"></div>
      <motion.div 
        className="train-bar" 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        style={{ 
          left: `${PAD}%`, 
          width: '80%', 
          background: `${color}30`, 
          border: `0.5px solid ${color}55`,
          originX: 0
        }}
      ></motion.div>
      <motion.div 
        className="coach-marker" 
        initial={{ height: 0, x: "-50%" }}
        animate={{ height: 44, left: `${coachPct}%`, x: "-50%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: color }}
      ></motion.div>
      <motion.div 
        className="coach-label-dot" 
        initial={{ opacity: 0, scale: 0, x: "-50%" }}
        animate={{ opacity: 1, scale: 1, left: `${coachPct}%`, x: "-50%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: color }}
      >
        {coachId}
      </motion.div>
      <motion.div 
        className="stand-here" 
        initial={{ opacity: 0, y: -10, x: "-50%" }}
        animate={{ opacity: 1, y: 0, left: `${coachPct}%`, x: "-50%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="stand-arrow">↓</div>
        <div className="stand-text">STAND HERE</div>
      </motion.div>
    </div>
  );
};

const CoachLayoutStrip = ({ layout, highlightedCoach, engineAtFront }) => {
  const coaches = engineAtFront ? [...layout] : [...layout].reverse();
  const highlightedRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (highlightedRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = highlightedRef.current;
      const scrollPos = element.offsetLeft - (container.offsetWidth / 2) + (element.offsetWidth / 2);
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }, [highlightedCoach, layout]);
  
  return (
    <div className="layout-section">
      <div className="platform-section-label">Approximate Train Layout</div>
      <motion.div 
        ref={containerRef}
        className="coach-strip"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {coaches.map((c, i) => (
          <motion.div 
            key={i} 
            ref={c === highlightedCoach ? highlightedRef : null}
            variants={fadeIn}
            className={`coach-box ${c === highlightedCoach ? 'highlight' : ''} ${c === 'LOCO' ? 'loco' : ''}`}
          >
            {c}
          </motion.div>
        ))}
      </motion.div>
      <div className="direction-labels" style={{ marginTop: '4px' }}>
        <span>{engineAtFront ? 'Front (Engine)' : 'Rear'}</span>
        <span>{engineAtFront ? 'Rear' : 'Front (Engine)'}</span>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <motion.div className="loading-card" variants={slideUp} initial="initial" animate="animate">
    <div className="skeleton" style={{ height: '40px', width: '70%', marginBottom: '1rem' }}></div>
    <div className="skeleton" style={{ height: '80px', width: '100%', marginBottom: '1rem' }}></div>
    <div className="input-row">
      <div className="skeleton" style={{ height: '44px' }}></div>
      <div className="skeleton" style={{ height: '44px' }}></div>
    </div>
  </motion.div>
);

const ResultCard = ({ data }) => {
  if (!data) return null;

  const { train, station, coach, platform_position: pos, coach_layout, highlighted_coach } = data;
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let zoneColors;
  if (pos.position === 'front') zoneColors = { color: '#1D9E75', bg: '#E1F5EE', darkBg: '#0d3d2c' };
  else if (pos.position === 'middle') zoneColors = { color: '#185FA5', bg: '#E6F1FB', darkBg: '#0c2540' };
  else zoneColors = { color: '#993556', bg: '#FBEAF0', darkBg: '#3d1528' };

  const badgeBg = isDark ? zoneColors.darkBg : zoneColors.bg;

  return (
    <motion.div className="result-card" variants={slideUp} initial="initial" animate="animate" exit="exit">
      <div className="result-header">
        <div>
          <div className="train-id">{train.number} — {train.name}</div>
          <div className="train-meta">{station.name} · {coach.type}</div>
        </div>
        <motion.div 
          className="position-badge" 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ background: badgeBg, color: zoneColors.color, border: `0.5px solid ${zoneColors.color}55` }}
        >
          {pos.position} zone
        </motion.div>
      </div>

      <div className="platform-wrap">
        <div className="platform-section-label">Platform view — your coach position</div>
        <PlatformVisual position={pos.position} coachId={coach.id} color={zoneColors.color} />
        <div className="direction-labels">
          <span>{pos.engine_at_front ? 'Front (Engine End)' : 'Front End'}</span>
          <span>{pos.engine_at_front ? 'Rear End' : 'Rear (Engine End)'}</span>
        </div>
      </div>

      {coach_layout && (
        <CoachLayoutStrip 
          layout={coach_layout} 
          highlightedCoach={highlighted_coach} 
          engineAtFront={pos.engine_at_front}
        />
      )}

      <div className="info-row">
        <div className="info-cell">
          <div className="info-cell-label">Your coach</div>
          <div className="info-cell-val">{coach.id}</div>
        </div>
        <div className="info-cell" style={{ gridColumn: 'span 2' }}>
          <div className="info-cell-label">Direction</div>
          <div className="info-cell-val" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className={`fa-solid ${pos.move_direction === 'LEFT' ? 'fa-arrow-left' : pos.move_direction === 'RIGHT' ? 'fa-arrow-right' : 'fa-arrows-left-right'}`} style={{ color: 'var(--brand)', fontSize: '11px' }}></i>
            {pos.direction.toUpperCase()}
          </div>
        </div>
      </div>

      <motion.div 
        className="walk-tip"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <i className="fa-solid fa-person-walking walk-tip-icon"></i>
        <div className="walk-tip-text">
          <strong>Explanation:</strong> {pos.explanation}<br /><br />
          💡 <em>{pos.tip}</em>
        </div>
      </motion.div>
    </motion.div>
  );
};

function App() {
  const [stations, setStations] = useState([]);
  const [trainNum, setTrainNum] = useState('');
  const [coachNum, setCoachNum] = useState('');
  const [station, setStation] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    fetchStations().then(data => {
      if (data.major_stations) setStations(data.major_stations);
    }).catch(console.warn);
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

  const handleFindSpot = async () => {
    setError('');
    setResult(null);
    if (!trainNum || !coachNum || !station) {
      setError('Please fill in train number, coach, and station.');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchPosition(trainNum, coachNum, station);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillExample = (t, c, s) => {
    setTrainNum(t);
    setCoachNum(c);
    setStation(s);
    setResult(null);
  };

  const regions = {
    "North": ["NDLS", "DLI", "ASR", "JAT", "CDG", "LKO", "JP"],
    "East": ["HWH", "PNBE", "BBS", "GHY"],
    "West": ["BCT", "CSMT", "ADI", "PUNE"],
    "South": ["MAS", "SBC", "SC", "TVC", "ERS"],
    "Central": ["BPL", "NGP"]
  };

  return (
    <>
      <div className="floating-particle particle-1"></div>
      <div className="floating-particle particle-2"></div>
      <div className="floating-particle particle-3"></div>
      <div className="floating-particle particle-4"></div>
      
      <div className="container">
        <Header />

      <motion.div 
        className="card" 
        variants={fadeIn} 
        initial="initial" 
        animate="animate"
        transition={{ delay: 0.2 }}
      >
        <div className="section-label">Try an example</div>
        <ExampleChips onFill={fillExample} />

        <div className="input-row">
          <div className="input-group">
            <span className="input-label">Train number</span>
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="text" 
              placeholder="e.g. 12627" 
              maxLength="6" 
              value={trainNum}
              onChange={e => setTrainNum(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-label">Your coach</span>
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="text" 
              placeholder="e.g. S6" 
              maxLength="5" 
              value={coachNum}
              onChange={e => setCoachNum(e.target.value)}
            />
          </div>
          <div className="input-group full-width">
            <span className="input-label">Junction / Station</span>
            <motion.select 
              whileFocus={{ scale: 1.01 }}
              value={station} 
              onChange={e => setStation(e.target.value)}
            >
              <option value="">Select major junction…</option>
              {Object.entries(regions).map(([region, codes]) => (
                <optgroup key={region} label={`${region} India`}>
                  {codes.map(code => {
                    const st = stations.find(s => s.code === code);
                    return st ? (
                      <option key={code} value={code}>{st.name} ({code})</option>
                    ) : null;
                  })}
                </optgroup>
              ))}
            </motion.select>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              className="err-msg"
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: [5, -5, 5, -5, 0], opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          className="find-btn" 
          onClick={handleFindSpot} 
          disabled={loading}
          whileHover={{ opacity: 0.9, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
        >
          <i className="fa-solid fa-location-crosshairs"></i>
          {loading ? 'Finding...' : 'Find my spot on platform'}
        </motion.button>
      </motion.div>

      <div ref={resultRef}>
        <AnimatePresence mode="wait">
          {loading && <LoadingSkeleton key="loading" />}
          {result && !loading && <ResultCard key="result" data={result} />}
        </AnimatePresence>
      </div>

      <motion.div 
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Platform 4B — Indian Railway Coach Position Finder<br />
        A premium navigation utility.
      </motion.div>
      </div>
    </>
  );
}

export default App;
