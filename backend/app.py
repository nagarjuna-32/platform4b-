from flask import Flask
from flask_cors import CORS
from routes.platform_routes import bp as platform_bp
from routes.train_routes import bp as train_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.register_blueprint(platform_bp)
    app.register_blueprint(train_bp)
    
    @app.route('/health')
    def health():
        return {"status": "ok"}, 200
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
