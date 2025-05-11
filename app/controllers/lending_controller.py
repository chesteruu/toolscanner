from flask import jsonify
from datetime import datetime
from app.models.tool import Tool
from app.models.lending_record import LendingRecord
from app.database.db import db

class LendingController:
    @staticmethod
    def lend_tool(tool_id, data):
        tool = Tool.query.get_or_404(tool_id)
        if tool.status != 'available':
            return jsonify({'error': 'Tool is not available'}), 400

        lending_record = LendingRecord(
            tool_id=tool_id,
            borrower_name=data['borrower_name'],
            notes=data.get('notes', '')
        )
        tool.status = 'lent'
        
        db.session.add(lending_record)
        db.session.commit()
        
        return jsonify(lending_record.to_dict()), 201

    @staticmethod
    def return_tool(tool_id):
        tool = Tool.query.get_or_404(tool_id)
        if tool.status != 'lent':
            return jsonify({'error': 'Tool is not lent'}), 400

        lending_record = LendingRecord.query.filter_by(
            tool_id=tool_id,
            returned_at=None
        ).first_or_404()

        lending_record.returned_at = datetime.utcnow()
        tool.status = 'available'
        
        db.session.commit()
        
        return jsonify(lending_record.to_dict())

    @staticmethod
    def get_all_lending_records():
        records = LendingRecord.query.all()
        return jsonify([record.to_dict() for record in records]) 