from flask import Flask, send_from_directory
from flask_cors import CORS
from app.database.db import init_db
from app.views.routes import init_routes

app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app)

# Set up the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tools.db'

# Initialize database
init_db(app)

# Register routes
init_routes(app)

# Serve static files
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/manage')
def manage():
    return send_from_directory('static', 'manage.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 