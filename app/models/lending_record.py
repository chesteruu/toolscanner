from datetime import datetime
from app.database.db import db

class LendingRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tool_id = db.Column(db.Integer, db.ForeignKey('tool.id'), nullable=False)
    borrower_name = db.Column(db.String(100), nullable=False)
    borrowed_at = db.Column(db.DateTime, default=datetime.utcnow)
    returned_at = db.Column(db.DateTime, nullable=True)
    notes = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'tool_id': self.tool_id,
            'borrower_name': self.borrower_name,
            'borrowed_at': self.borrowed_at.isoformat(),
            'returned_at': self.returned_at.isoformat() if self.returned_at else None,
            'notes': self.notes
        } 