const API_BASE = 'http://localhost:5000/api';

export const fetchStations = async () => {
  const resp = await fetch(`${API_BASE}/trains/stations`);
  if (!resp.ok) throw new Error('Failed to fetch stations');
  return resp.json();
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
