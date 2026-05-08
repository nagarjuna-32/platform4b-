from flask import Blueprint, request, jsonify
from services.composition_service import get_coach_position
from models import MAJOR_JUNCTIONS

bp = Blueprint('platform', __name__, url_prefix='/api')


def demo_position(train_number, coach, station_code):
    demo_data = {
        ("12627", "S6", "NDLS"): {
            "position": "middle",
            "emoji": "🟡",
            "ascii": "[ FRONT ] ----- [ S6 HERE ] ----- [ REAR ]",
            "instruction": "Stand near the middle section of the platform.",
            "tip": "Look for the center display boards or middle footbridge.",
            "coach_layout": ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"],
            "journey": {"name": "Karnataka Express"}
        },
        ("22691", "B3", "SBC"): {
            "position": "rear",
            "emoji": "🔵",
            "ascii": "[ FRONT ] ----------- [ B3 HERE / REAR ]",
            "instruction": "Stand closer to the rear side of the platform.",
            "tip": "Move towards the last coaches side.",
            "coach_layout": ["A1", "B1", "B2", "B3", "S1", "S2"],
            "journey": {"name": "Rajdhani Express"}
        },
        ("12301", "A1", "HWH"): {
            "position": "front",
            "emoji": "🟢",
            "ascii": "[ A1 HERE / FRONT ] ----------- [ REAR ]",
            "instruction": "Stand near the front side of the platform.",
            "tip": "Move towards the engine side.",
            "coach_layout": ["A1", "A2", "B1", "B2", "S1", "S2"],
            "journey": {"name": "Howrah Rajdhani"}
        },
        ("12952", "H1", "BCT"): {
            "position": "front",
            "emoji": "🟢",
            "ascii": "[ H1 HERE / FRONT ] ----------- [ REAR ]",
            "instruction": "Stand near the front section of the platform.",
            "tip": "H1 is usually close to premium coach area.",
            "coach_layout": ["H1", "A1", "A2", "B1", "B2", "S1"],
            "journey": {"name": "Mumbai Rajdhani"}
        },
        ("12001", "CC1", "BPL"): {
            "position": "middle",
            "emoji": "🟡",
            "ascii": "[ FRONT ] ----- [ CC1 HERE ] ----- [ REAR ]",
            "instruction": "Stand near the middle section of the platform.",
            "tip": "Chair car coaches are usually near the center.",
            "coach_layout": ["EC1", "CC1", "CC2", "CC3", "CC4"],
            "journey": {"name": "Shatabdi Express"}
        },
    }

    key = (train_number, coach.upper(), station_code.upper())

    return demo_data.get(
        key,
        {
            "position": "middle",
            "emoji": "🟡",
            "ascii": "[ FRONT ] ----- [ YOUR COACH AREA ] ----- [ REAR ]",
            "instruction": "Prototype estimate: stand near the middle of the platform.",
            "tip": "For demo, this app gives a safe estimated standing zone.",
            "coach_layout": ["FRONT", "MIDDLE", "REAR"],
            "journey": {"name": f"Train {train_number}"}
        }
    )


@bp.route('/platformposition', methods=['GET'])
def get_position():
    train_number = request.args.get('train_number')
    coach = request.args.get('coach')
    station_code = request.args.get('station')

    if not train_number or not coach or not station_code:
        return jsonify({'error': 'train_number, coach, and station are required'}), 400

    pos_data = get_coach_position(train_number, coach, station_code=station_code)

    if not pos_data:
        pos_data = demo_position(train_number, coach, station_code)

    station_name = MAJOR_JUNCTIONS.get(station_code.upper(), station_code)

    coach_type = ''.join([i for i in coach if not i.isdigit()]).upper()
    coach_types_map = {
        'H': 'AC 1st Class',
        'A': 'AC 2nd Class',
        'B': 'AC 3rd Class',
        'M': 'AC 3rd Economy',
        'S': 'Sleeper Class',
        'GS': 'General',
        'UR': 'Unreserved',
        'CC': 'AC Chair Car',
        'EC': 'Exec. Chair Car'
    }

    response = {
        'train': {
            'number': train_number,
            'name': (pos_data.get('journey') or {}).get('name', f"Train {train_number}")
        },
        'station': {
            'code': station_code.upper(),
            'name': station_name
        },
        'coach': {
            'id': coach.upper(),
            'type': coach_types_map.get(coach_type, "Express Coach")
        },
        'platform_position': pos_data,
        'coach_layout': pos_data.get('coach_layout', []),
        'highlighted_coach': coach.upper(),
        'highlighted_zone': pos_data.get('position', 'middle')
    }

    return jsonify(response), 200


@bp.route('/platformguide/<train_number>/<coach_id>/<station_code>', methods=['GET'])
def get_guide(train_number, coach_id, station_code):
    pos_data = get_coach_position(train_number, coach_id, station_code=station_code)

    if not pos_data:
        pos_data = demo_position(train_number, coach_id, station_code)

    return jsonify({
        'train_number': train_number,
        'train_name': (pos_data.get('journey') or {}).get('name', f"Train {train_number}"),
        'station_code': station_code.upper(),
        'station_name': MAJOR_JUNCTIONS.get(station_code.upper(), station_code),
        'coach_id': coach_id.upper(),
        'platform_position': pos_data.get('position', 'middle'),
        'emoji': pos_data.get('emoji', '🟡'),
        'ascii_marker': pos_data.get('ascii', '[ FRONT ] ----- [ YOUR COACH AREA ] ----- [ REAR ]'),
        'instruction': pos_data.get('instruction', 'Stand near the middle of the platform.'),
        'tip': pos_data.get('tip', 'Prototype estimate for demo.')
    }), 200
