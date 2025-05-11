from flask import request
from app.controllers.tool_controller import ToolController
from app.controllers.lending_controller import LendingController

def init_routes(app):
    # Tool routes
    @app.route('/api/tools', methods=['GET'])
    def get_tools():
        return ToolController.get_all_tools()

    @app.route('/api/tools', methods=['POST'])
    def create_tool():
        return ToolController.create_tool(request.get_json())

    @app.route('/api/tools/<int:tool_id>', methods=['GET'])
    def get_tool(tool_id):
        return ToolController.get_tool(tool_id)

    @app.route('/api/tools/<int:tool_id>/qr', methods=['GET'])
    def get_tool_qr(tool_id):
        return ToolController.get_tool_qr(tool_id)

    # Lending routes
    @app.route('/api/tools/<int:tool_id>/lend', methods=['POST'])
    def lend_tool(tool_id):
        return LendingController.lend_tool(tool_id, request.get_json())

    @app.route('/api/tools/<int:tool_id>/return', methods=['POST'])
    def return_tool(tool_id):
        return LendingController.return_tool(tool_id)

    @app.route('/api/lending-records', methods=['GET'])
    def get_lending_records():
        return LendingController.get_all_lending_records() 