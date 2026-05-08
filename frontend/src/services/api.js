const API_BASE = 'https://full-project-5-kgfu.onrender.com';

export const fetchStations = async () => {
  return [
    "NDLS",
    "SBC",
    "HWH",
    "BCT",
    "BPL"
  ];
};

export const fetchPosition = async (trainNumber, coach, station) => {
  const url = `${API_BASE}/platformposition?train_number=${trainNumber}&coach=${coach}&station=${station}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Could not find position for this combination');
  return resp.json();
};

export const fetchGuide = async (trainNumber, coach, station) => {
  const resp = await fetch(`${API_BASE}/platformguide/${trainNumber}/${coach}/${station}`);
  if (!resp.ok) throw new Error('Failed to fetch guide');
  return resp.json();
};
