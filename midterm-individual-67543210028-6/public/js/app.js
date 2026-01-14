// Global state
let currentStatusFilter = 'all';
let currentMajorFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setupEventListeners();
});

function setupEventListeners() {
    // Add Student Button
    document.getElementById('add-btn').addEventListener('click', showAddModal);
    
    // Close Buttons
    document.getElementById('student-close').addEventListener('click', () => closeModal('student-modal'));
    document.getElementById('gpa-close').addEventListener('click', () => closeModal('gpa-modal'));
    document.getElementById('status-close').addEventListener('click', () => closeModal('status-modal'));
    
    // Cancel Buttons
    document.getElementById('cancel-btn').addEventListener('click', () => closeModal('student-modal'));
    document.getElementById('gpa-cancel').addEventListener('click', () => closeModal('gpa-modal'));
    document.getElementById('status-cancel').addEventListener('click', () => closeModal('status-modal'));
    
    // Forms
    document.getElementById('student-form').addEventListener('submit', handleStudentSubmit);
    document.getElementById('gpa-form').addEventListener('submit', handleGPASubmit);
    document.getElementById('status-form').addEventListener('submit', handleStatusSubmit);
    
    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update UI
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update Filter
            currentStatusFilter = e.target.dataset.filter;
            loadStudents(currentStatusFilter, currentMajorFilter);
        });
    });
}

// Load Students
async function loadStudents(status = 'all', major = 'all') {
    try {
        const loading = document.getElementById('loading');
        const list = document.getElementById('student-list');
        
        if(loading) loading.style.display = 'block';
        if(list) list.style.display = 'none';
        
        const data = await api.getAllStudents(major, status);
        
        displayStudents(data.students);
        updateStatistics(data.statistics);
        
        if(loading) loading.style.display = 'none';
        if(list) list.style.display = 'grid';
        
    } catch (error) {
        console.error('Error loading students:', error);
        alert('Failed to load students. Please ensure server is running.');
        const loading = document.getElementById('loading');
        if(loading) loading.style.display = 'none';
    }
}

// Display Students
function displayStudents(students) {
    const container = document.getElementById('student-list');
    
    if (!students || students.length === 0) {
        container.innerHTML = '<div class="no-students">🎓 No students found</div>';
        return;
    }
    
    container.innerHTML = students.map(student => {
        const gpaClass = getGPAClass(student.gpa);
        // Note: Using inline onclick for simplicity in generated HTML
        return `
            <div class="student-card">
                <div class="student-header">
                    <div>
                        <h3>${escapeHtml(student.first_name)} ${escapeHtml(student.last_name)}</h3>
                        <span class="student-code">🆔 ${escapeHtml(student.student_code)}</span>
                    </div>
                    <span class="status-badge status-${student.status}">
                        ${student.status.toUpperCase()}
                    </span>
                </div>
                
                <div class="student-details">
                    <div class="detail-row">
                        <span class="detail-label">📧 Email:</span>
                        <span class="detail-value">${escapeHtml(student.email)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">📚 Major:</span>
                        <span class="detail-value">${escapeHtml(student.major)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">📊 GPA:</span>
                        <span class="gpa-badge ${gpaClass}">${student.gpa.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="actions">
                    <button class="btn btn-info" onclick="window.showGPAModal(${student.id}, ${student.gpa})">Update GPA</button>
                    <button class="btn btn-warning" onclick="window.showStatusModal(${student.id}, '${student.status}')">Change Status</button>
                    <button class="btn btn-secondary" onclick="window.editStudent(${student.id})">Edit</button>
                    <button class="btn btn-danger" onclick="window.deleteStudent(${student.id}, '${student.status}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function getGPAClass(gpa) {
    if (gpa >= 3.5) return 'gpa-excellent';
    if (gpa >= 3.0) return 'gpa-good';
    if (gpa >= 2.0) return 'gpa-fair';
    return 'gpa-poor';
}

function updateStatistics(stats) {
    if (!stats) return;
    document.getElementById('stat-active').textContent = stats.active || 0;
    document.getElementById('stat-graduated').textContent = stats.graduated || 0;
    document.getElementById('stat-suspended').textContent = stats.suspended || 0;
    document.getElementById('stat-total').textContent = stats.total || 0;
    document.getElementById('stat-gpa').textContent = (stats.averageGPA || 0).toFixed(2);
}

// --- MODAL FUNCTIONS (Exposed to Window) ---

window.showAddModal = function() {
    document.getElementById('modal-title').textContent = 'Add New Student';
    document.getElementById('student-form').reset();
    document.getElementById('student-id').value = '';
    document.getElementById('student-modal').style.display = 'flex';
};

window.closeModal = function(modalId) {
    document.getElementById(modalId).style.display = 'none';
};

window.showGPAModal = function(id, currentGPA) {
    document.getElementById('gpa-student-id').value = id;
    document.getElementById('gpa').value = currentGPA.toFixed(2);
    document.getElementById('gpa-modal').style.display = 'flex';
};

window.showStatusModal = function(id, currentStatus) {
    document.getElementById('status-student-id').value = id;
    document.getElementById('status').value = currentStatus;
    document.getElementById('status-modal').style.display = 'flex';
};

// --- CRUD OPERATIONS ---

// Handle Add/Edit Submit
async function handleStudentSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('student-id').value;
    const studentData = {
        student_code: document.getElementById('student_code').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        major: document.getElementById('major').value
    };
    
    try {
        if (id) {
            await api.updateStudent(id, studentData);
            alert('Student updated successfully!');
        } else {
            await api.createStudent(studentData);
            alert('Student added successfully!');
        }
        window.closeModal('student-modal');
        loadStudents(currentStatusFilter, currentMajorFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Handle GPA Submit
async function handleGPASubmit(event) {
    event.preventDefault();
    const id = document.getElementById('gpa-student-id').value;
    const gpa = parseFloat(document.getElementById('gpa').value);
    
    try {
        await api.updateGPA(id, gpa);
        alert('GPA updated successfully!');
        window.closeModal('gpa-modal');
        loadStudents(currentStatusFilter, currentMajorFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Handle Status Submit
async function handleStatusSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('status-student-id').value;
    const status = document.getElementById('status').value;
    
    try {
        await api.updateStatus(id, status);
        alert('Status updated successfully!');
        window.closeModal('status-modal');
        loadStudents(currentStatusFilter, currentMajorFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Edit Student (Load data)
window.editStudent = async function(id) {
    try {
        const student = await api.getStudentById(id);
        
        document.getElementById('modal-title').textContent = 'Edit Student';
        document.getElementById('student-id').value = student.id;
        document.getElementById('student_code').value = student.student_code;
        document.getElementById('first_name').value = student.first_name;
        document.getElementById('last_name').value = student.last_name;
        document.getElementById('email').value = student.email;
        document.getElementById('major').value = student.major;
        
        document.getElementById('student-modal').style.display = 'flex';
    } catch (error) {
        alert('Error loading details: ' + error.message);
    }
};

// Delete Student
window.deleteStudent = async function(id, status) {
    if (status === 'active') {
        alert('Cannot delete active student. Change status first.');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        await api.deleteStudent(id);
        alert('Student deleted successfully!');
        loadStudents(currentStatusFilter, currentMajorFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

// Utils
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}
