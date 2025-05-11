const API_BASE_URL = '/api';

// DOM Elements
const addToolForm = document.getElementById('addToolForm');
const toolsList = document.getElementById('toolsList');
const toolSelect = document.getElementById('toolSelect');
const lendToolForm = document.getElementById('lendToolForm');
const lentTools = document.getElementById('lentTools');
const lendingRecords = document.getElementById('lendingRecords');
const scanQRBtn = document.getElementById('scanQRBtn');

// Fetch all tools
async function fetchTools() {
    try {
        const response = await fetch(`${API_BASE_URL}/tools`);
        const tools = await response.json();
        displayTools(tools);
        updateToolSelect(tools);
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
        `;
        toolsList.appendChild(toolCard);

        // Show modal on click
        toolCard.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                    <p>Created: ${new Date(tool.created_at).toLocaleDateString()}</p>
                    <span class="status ${tool.status}">${tool.status}</span>
                    <div class="qr-container">
                        <img src="data:image/png;base64,${tool.qr_code}" alt="QR Code for ${tool.name}" />
                    </div>
                    ${tool.status === 'lent' ? `<button class="return-btn">Return Tool</button>` : ''}
                    <button class="close-btn">Close</button>
                </div>
            `;
            document.body.appendChild(modal);

            // Close modal on button click
            modal.querySelector('.close-btn').addEventListener('click', () => {
                modal.remove();
            });

            // Return tool on button click
            const returnBtn = modal.querySelector('.return-btn');
            if (returnBtn) {
                returnBtn.addEventListener('click', async () => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/tools/${tool.id}/return`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        if (response.ok) {
                            modal.remove();
                            fetchTools();
                        } else {
                            console.error('Error returning tool:', await response.text());
                        }
                    } catch (error) {
                        console.error('Error returning tool:', error);
                    }
                });
            }
        });
    });
}

// Update tool select dropdown
function updateToolSelect(tools) {
    toolSelect.innerHTML = '<option value="">Select a tool...</option>';
    tools
        .filter(tool => tool.status === 'available')
        .forEach(tool => {
            const option = document.createElement('option');
            option.value = tool.id;
            option.textContent = tool.name;
            toolSelect.appendChild(option);
        });
}

// Fetch lent tools
async function fetchLentTools() {
    try {
        const response = await fetch(`${API_BASE_URL}/tools`);
        const tools = await response.json();
        const lentToolsList = tools.filter(tool => tool.status === 'lent');
        displayLentTools(lentToolsList);
    } catch (error) {
        console.error('Error fetching lent tools:', error);
    }
}

// Display lent tools
function displayLentTools(tools) {
    lentTools.innerHTML = '';
    tools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.innerHTML = `
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
            <p>Created: ${new Date(tool.created_at).toLocaleDateString()}</p>
            <span class="status ${tool.status}">${tool.status}</span>
        `;
        lentTools.appendChild(toolCard);
    });
}

// Fetch lending records
async function fetchLendingRecords() {
    try {
        const response = await fetch(`${API_BASE_URL}/lending-records`);
        const records = await response.json();
        displayLendingRecords(records);
    } catch (error) {
        console.error('Error fetching lending records:', error);
    }
}

// Display lending records
function displayLendingRecords(records) {
    lendingRecords.innerHTML = '';
    records.forEach(record => {
        const recordCard = document.createElement('div');
        recordCard.className = 'record-card';
        recordCard.innerHTML = `
            <h3>Tool ID: ${record.tool_id}</h3>
            <p>Borrower: ${record.borrower_name}</p>
            <p>Borrowed: ${new Date(record.borrowed_at).toLocaleString()}</p>
            <p>Returned: ${record.returned_at ? new Date(record.returned_at).toLocaleString() : 'Not returned'}</p>
            <p>Notes: ${record.notes || 'No notes'}</p>
        `;
        lendingRecords.appendChild(recordCard);
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

// Lend tool
lendToolForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(lendToolForm);
    const toolId = formData.get('toolId');
    const lendingData = {
        borrower_name: formData.get('borrower_name'),
        notes: formData.get('notes')
    };

    try {
        const response = await fetch(`${API_BASE_URL}/tools/${toolId}/lend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lendingData)
        });

        if (response.ok) {
            lendToolForm.reset();
            fetchTools();
            fetchLendingRecords();
        } else {
            console.error('Error lending tool:', await response.text());
        }
    } catch (error) {
        console.error('Error lending tool:', error);
    }
});

// Scan QR Code
document.addEventListener('DOMContentLoaded', () => {
    const scanQRBtn = document.getElementById('scanQRBtn');
    if (scanQRBtn) {
        scanQRBtn.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Scan QR Code</h2>
                    <video id="qr-video" width="100%" height="auto"></video>
                </div>
            `;
            document.body.appendChild(modal);
            const video = document.getElementById('qr-video');
            const closeBtn = modal.querySelector('.close');
            closeBtn.onclick = () => {
                modal.remove();
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            };
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    video.srcObject = stream;
                    video.play();
                    // ... rest of the code ...
                })
                .catch(err => {
                    console.error('Error accessing camera:', err);
                    modal.remove();
                });
        });
    } else {
        console.error('Button with ID "scanQRBtn" not found!');
    }
});

// Initialize the application
function init() {
    fetchTools();
    fetchLentTools();
    fetchLendingRecords();
}

// Start the application
init(); 