# Top 20 Major Junctions in India
# Mapping of station codes to their engine-at-entry-end default state.
# True = Engine usually at the main entry gate end of the platform.
# False = Engine usually at the far end of the platform.
STATION_CONFIG = {
    'NDLS': {'engine_at_entry': True},
    'HWH':  {'engine_at_entry': False},
    'BCT':  {'engine_at_entry': True},
    'CSMT': {'engine_at_entry': False},
    'MAS':  {'engine_at_entry': False},
    'SBC':  {'engine_at_entry': True},
    'SC':   {'engine_at_entry': True},
    'JP':   {'engine_at_entry': False},
    'LKO':  {'engine_at_entry': True},
    'PNBE': {'engine_at_entry': False},
    'ADI':  {'engine_at_entry': True},
    'PUNE': {'engine_at_entry': True},
    'BPL':  {'engine_at_entry': False},
    'NGP':  {'engine_at_entry': True},
    'ASR':  {'engine_at_entry': False},
    'CDG':  {'engine_at_entry': True},
    'JAT':  {'engine_at_entry': False},
    'GHY':  {'engine_at_entry': True},
    'BBS':  {'engine_at_entry': False},
    'TVC':  {'engine_at_entry': False}
}

MAJOR_JUNCTIONS = {
    "NDLS": "New Delhi",
    "HWH": "Howrah",
    "CSMT": "Mumbai CSMT",
    "BCT": "Mumbai Central",
    "MAS": "Chennai Central",
    "SBC": "KSR Bengaluru",
    "SC": "Secunderabad",
    "PNBE": "Patna",
    "LKO": "Lucknow",
    "ADI": "Ahmedabad",
    "PUNE": "Pune",
    "BPL": "Bhopal",
    "NGP": "Nagpur",
    "GHY": "Guwahati",
    "JP": "Jaipur",
    "BBS": "Bhubaneswar",
    "ASR": "Amritsar",
    "CDG": "Chandigarh",
    "JAT": "Jammu Tawi",
    "TVC": "Thiruvananthapuram"
}

# Standard Coach Order Heuristics (Front to Rear)
RAKE_TYPES = {
    "LHB_PREMIUM": ["LOCO", "EOG", "H1", "A1", "A2", "B1", "B2", "B3", "B4", "B5", "B6", "PC", "M1", "M2", "EOG"],
    "LHB_REGULAR": ["LOCO", "EOG", "GS", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "PC", "B1", "B2", "A1", "GS", "EOG"],
    "ICF_EXPRESS": ["LOCO", "SLR", "GS", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "PC", "B1", "B2", "A1", "GS", "SLR"]
}

# Static Journey Info for major trains
TRAIN_JOURNEYS = {
    "12951": {
        "name": "Mumbai Rajdhani",
        "origin": "NDLS",
        "destination": "BCT",
        "stops": ["NDLS", "KOTA", "RTM", "BRC", "BCT"]
    },
    "12952": {
        "name": "August Kranti Rajdhani",
        "origin": "BCT",
        "destination": "NDLS",
        "stops": ["BCT", "BRC", "RTM", "KOTA", "NDLS"]
    },
    "12627": {
        "name": "Karnataka Express",
        "origin": "SBC",
        "destination": "NDLS",
        "stops": ["SBC", "DMM", "ATP", "GTL", "RC", "WADI", "SUR", "DD", "ANG", "MMR", "JL", "BSL", "KNW", "ET", "BPL", "BINA", "VGLJ", "GWL", "AGC", "MTJ", "NDLS"]
    },
    "12628": {
        "name": "Karnataka Express",
        "origin": "NDLS",
        "destination": "SBC",
        "stops": ["NDLS", "MTJ", "AGC", "GWL", "VGLJ", "BINA", "BPL", "ET", "KNW", "BSL", "JL", "MMR", "ANG", "DD", "SUR", "WADI", "RC", "GTL", "ATP", "DMM", "SBC"]
    },
    "12301": {
        "name": "Howrah Rajdhani",
        "origin": "HWH",
        "destination": "NDLS",
        "stops": ["HWH", "DHN", "GAYA", "DDU", "PRYJ", "CNB", "NDLS"]
    },
    "22691": {
        "name": "Rajdhani Express",
        "origin": "SBC",
        "destination": "NZM",
        "stops": ["SBC", "SSPN", "GTL", "RC", "SC", "KZJ", "BPQ", "NGP", "ET", "BPL", "VGLJ", "GWL", "AGC", "NZM"]
    },
    "12001": {
        "name": "Shatabdi Express",
        "origin": "RKMP",
        "destination": "NDLS",
        "stops": ["RKMP", "BPL", "VGLJ", "GWL", "AGC", "MTJ", "NDLS"]
    }
}
