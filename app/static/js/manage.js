const API_BASE_URL = '/api';

// DOM Elements
const addToolForm = document.getElementById('addToolForm');
const toolsList = document.getElementById('toolsList');

// Fetch all tools
async function fetchTools() {
    try {
        const response = await fetch(`${API_BASE_URL}/tools`);
        const tools = await response.json();
        displayTools(tools);
    } catch (error) {
        console.error('Error fetching tools:', error);
    }
}

// Display tools in the grid
function displayTools(tools) {
    toolsList.innerHTML = '';
    tools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.innerHTML = `
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
            <p>Created: ${new Date(tool.created_at).toLocaleDateString()}</p>
            <span class="status ${tool.status}">${tool.status}</span>
            <div class="qr-container">
                <img src="data:image/png;base64,${tool.qr_code}" alt="QR Code for ${tool.name}" />
            </div>
        `;
        toolsList.appendChild(toolCard);
    });
}

// Add new tool
addToolForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addToolForm);
    const toolData = {
        name: formData.get('name'),
        description: formData.get('description')
    };

    try {
        const response = await fetch(`${API_BASE_URL}/tools`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toolData)
        });

        if (response.ok) {
            addToolForm.reset();
            fetchTools();
        } else {
            console.error('Error adding tool:', await response.text());
        }
    } catch (error) {
        console.error('Error adding tool:', error);
    }
});

// Initialize the page
fetchTools(); 