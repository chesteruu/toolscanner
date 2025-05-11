from flask import jsonify, request
from app.models.tool import Tool
from app.database.db import db
from app.utils.qr_generator import generate_tool_qr

class ToolController:
    @staticmethod
    def get_all_tools():
        tools = Tool.query.all()
        return jsonify([tool.to_dict() for tool in tools])

    @staticmethod
    def get_tool(tool_id):
        tool = Tool.query.get_or_404(tool_id)
        return jsonify(tool.to_dict())

    @staticmethod
    def create_tool(data):
        # Validate required fields
        if 'name' not in data:
            return jsonify({'error': 'Tool name is required'}), 400

        # Create new tool with a temporary ID for QR code generation
        temp_id = Tool.query.count() + 1  # Get a temporary ID
        qr_code = generate_tool_qr(temp_id, data['name'])

        # Create new tool with QR code
        new_tool = Tool(
            name=data['name'],
            description=data.get('description', ''),
            status='available',
            qr_code=qr_code
        )
        
        # Save the tool
        db.session.add(new_tool)
        db.session.commit()
        
        # Update QR code with actual ID
        qr_code = generate_tool_qr(new_tool.id, new_tool.name)
        new_tool.qr_code = qr_code
        db.session.commit()
        
        return jsonify({
            'id': new_tool.id,
            'name': new_tool.name,
            'description': new_tool.description,
            'status': new_tool.status,
            'created_at': new_tool.created_at.isoformat(),
            'qr_code': qr_code,
            'print_ready': True  # Indicate that the QR code is ready for printing
        }), 201

    @staticmethod
    def get_tool_qr(tool_id):
        tool = Tool.query.get_or_404(tool_id)
        return jsonify({
            'tool_id': tool.id,
            'tool_name': tool.name,
            'qr_code': tool.qr_code,
            'print_ready': True
        }) 