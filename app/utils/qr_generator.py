import qrcode
import io
import base64
from PIL import Image

def generate_tool_qr(tool_id, tool_name):
    """
    Generate a QR code for a tool that contains the tool ID and name.
    Returns the QR code as a base64 encoded string.
    """
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Add data to QR code
    qr_data = f"Tool ID: {tool_id}\nName: {tool_name}"
    qr.add_data(qr_data)
    qr.make(fit=True)

    # Create an image from the QR code
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Convert the image to base64
    buffered = io.BytesIO()
    qr_image.save(buffered, format="PNG")
    qr_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    return qr_base64 