from datetime import datetime
from app.database.db import db
from app.utils.qr_generator import generate_tool_qr

class Tool(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    qr_code = db.Column(db.Text, nullable=False)  # QR code is now required
    status = db.Column(db.String(20), default='available')  # available, lent
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    lending_records = db.relationship('LendingRecord', backref='tool', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'qr_code': self.qr_code,
            'print_ready': True
        }

    def generate_qr_code(self):
        """Generate QR code for the tool"""
        qr_code = generate_tool_qr(self.id, self.name)
        self.qr_code = qr_code  # Store the generated QR code
        db.session.commit()
        return qr_code 