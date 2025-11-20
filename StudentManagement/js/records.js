// ==================== DEPARTMENT NAVIGATION ====================
function showDepartmentRecords(department) {
    currentDepartment = department;
    console.log('📂 Showing records for department:', department);
    
    document.getElementById('departmentSection').style.display = 'none';
    document.getElementById('recordsSection').style.display = 'block';
    
    const departmentNames = {
        'CSE': 'Computer Science (CSE)',
        'ECE': 'Electronics (ECE)',
        'MECH': 'Mechanical (MECH)',
        'CIVIL': 'Civil (CIVIL)',
        'EEE': 'Electrical (EEE)',
        'IT': 'Information Technology (IT)'
    };
    
    document.getElementById('departmentTitle').textContent = `${departmentNames[department] || department} Department Records`;
    
    loadStudentRecords(department);
}

function backToDepartments() {
    document.getElementById('departmentSection').style.display = 'block';
    document.getElementById('recordsSection').style.display = 'none';
    currentDepartment = '';
}

function loadStudentRecords(department) {
    const students = getStudents();
    console.log('📊 All students:', students.length);
    
    const filteredStudents = students.filter(student => student.department === department);
    console.log(`✅ Filtered students for ${department}:`, filteredStudents.length);
    
    displayStudents(filteredStudents);
    displayTopPerformers(filteredStudents);
}

// ==================== DISPLAY STUDENTS ====================
function displayStudents(students) {
    const tableBody = document.getElementById('studentTableBody');
    const noRecordsMsg = document.getElementById('noRecordsMessage');
    
    if (students.length === 0) {
        tableBody.innerHTML = '';
        noRecordsMsg.style.display = 'block';
        return;
    }
    
    noRecordsMsg.style.display = 'none';
    
    tableBody.innerHTML = students.map(student => `
        <tr>
            <td>
                <img src="${student.photo || 'https://i.pravatar.cc/150?img=1'}" 
                     alt="${student.name}" 
                     class="student-photo"
                     onerror="this.src='https://i.pravatar.cc/150?img=1'">
            </td>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.department}</td>
            <td>${student.contact}</td>
            <td>${student.percentage}%</td>
            <td><strong>${student.grade}</strong></td>
            <td class="action-buttons">
                <button class="btn-action btn-edit" onclick="editStudent('${student.id}')" title="Edit" style="color:black;">
                    ✏️ Edit
                </button>
                <button class="btn-action btn-delete" onclick="deleteStudent('${student.id}')" style="color:black;" title="Delete">
                    🗑️ Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// ==================== TOP PERFORMERS ====================
function displayTopPerformers(students) {
    const topPerformers = students
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);
    
    const listElement = document.getElementById('topPerformersList');
    
    if (topPerformers.length === 0) {
        listElement.innerHTML = '<li>No students in this department yet.</li>';
        return;
    }
    
    listElement.innerHTML = topPerformers.map(student => `
        <li>${student.name} - ${student.percentage}% (${student.grade})</li>
    `).join('');
}

// ==================== FILTER STUDENTS ====================
function filterStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const gradeFilter = document.getElementById('filterGrade').value;
    
    const students = getStudents();
    let filtered = students.filter(student => student.department === currentDepartment);
    
    if (searchTerm) {
        filtered = filtered.filter(student =>
            student.name.toLowerCase().includes(searchTerm) ||
            student.id.toLowerCase().includes(searchTerm) ||
            student.class.toLowerCase().includes(searchTerm)
        );
    }
    
    if (gradeFilter) {
        filtered = filtered.filter(student => student.grade === gradeFilter);
    }
    
    displayStudents(filtered);
}

// ==================== ADD/UPDATE STUDENT FORM ====================
function submitStudentForm() {
    console.log('📤 Submitting student form...');
    
    const studentId = document.getElementById('studentId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    const studentClass = document.getElementById('studentClass').value;
    const studentDepartment = document.getElementById('studentDepartment').value;
    const studentContact = document.getElementById('studentContact').value.trim();
    const studentEmail = document.getElementById('studentEmail').value.trim();
    const studentPercentage = parseFloat(document.getElementById('studentPercentage').value);
    const studentGrade = document.getElementById('studentGrade').value;
    const studentAddress = document.getElementById('studentAddress').value.trim();
    
    // Get photo from either upload (Base64) or URL input
    let studentPhoto = document.getElementById('studentPhoto').value.trim();
    const studentPhotoUrl = document.getElementById('studentPhotoUrl') ? 
                           document.getElementById('studentPhotoUrl').value.trim() : '';
    
    // If no uploaded image, try URL input, otherwise use default
    if (!studentPhoto && studentPhotoUrl) {
        studentPhoto = studentPhotoUrl;
    } else if (!studentPhoto) {
        studentPhoto = 'https://i.pravatar.cc/150?img=1';
    }
    
    // Validation
    if (!studentId || !studentName || !studentClass || !studentDepartment || 
        !studentContact || !studentEmail || isNaN(studentPercentage) || !studentGrade) {
        showFormMessage('error', 'Please fill in all required fields.');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
        showFormMessage('error', 'Please enter a valid email address.');
        return;
    }
     const phonePattern = /^\+91\s\d{5}\s\d{5}$/;
    if (!phonePattern.test(studentContact)) {
        showFormMessage('error', 'Phone must be in format: +91 XXXXX XXXXX (10 digits)');
        return;
    }
    
    if (studentPercentage < 0 || studentPercentage > 100) {
        showFormMessage('error', 'Percentage must be between 0 and 100.');
        return;
    }
    
    let students = getStudents();
    const returnDepartment = sessionStorage.getItem('returnDepartment');
    
    if (editingStudentId) {
        // UPDATE EXISTING STUDENT
        const index = students.findIndex(s => s.id === editingStudentId);
        
        if (index !== -1) {
            students[index] = {
                id: studentId,
                name: studentName,
                class: studentClass,
                department: studentDepartment,
                contact: studentContact,
                email: studentEmail,
                percentage: studentPercentage,
                grade: studentGrade,
                photo: studentPhoto,
                address: studentAddress
            };
            
            saveStudents(students);
            showFormMessage('success', 'Student record updated successfully!');
            alert(`Student ${studentName} (${studentId}) has been updated successfully!`);
            
            editingStudentId = null;
            document.getElementById('studentId').readOnly = false;
            document.querySelector('.page-title').textContent = 'Add New Student';
            document.querySelector('.page-subtitle').textContent = 'Fill in the student information below to add a new record to the system';
            document.querySelector('.btn-primary').textContent = 'Add Student';
            
            if (returnDepartment) {
                sessionStorage.removeItem('returnDepartment');
                setTimeout(() => {
                    window.location.href = `records.html?dept=${returnDepartment}`;
                }, 1500);
                return;
            }
        }
    } else {
        // ADD NEW STUDENT
        if (students.some(s => s.id === studentId)) {
            showFormMessage('error', 'Student ID already exists. Please use a unique ID.');
            return;
        }
        
        const newStudent = {
            id: studentId,
            name: studentName,
            class: studentClass,
            department: studentDepartment,
            contact: studentContact,
            email: studentEmail,
            percentage: studentPercentage,
            grade: studentGrade,
            photo: studentPhoto,
            address: studentAddress
        };
        
        console.log('Adding new student:', newStudent);
        
        students.push(newStudent);
        saveStudents(students);
        
        showFormMessage('success', 'Student record added successfully!');
        alert(`Student ${studentName} (${studentId}) has been added successfully! Redirecting to ${studentDepartment} department...`);
        
        // Redirect to the department page after 1.5 seconds
        setTimeout(() => {
            window.location.href = `records.html?dept=${studentDepartment}`;
        }, 1500);
    }
    
    resetStudentForm();
    loadRecentStudents();
}

// ==================== RESET FORM ====================
function resetStudentForm() {
    document.getElementById('studentId').value = '';
    document.getElementById('studentId').readOnly = false;
    document.getElementById('studentName').value = '';
    document.getElementById('studentClass').value = '';
    document.getElementById('studentDepartment').value = '';
    document.getElementById('studentContact').value = '';
    document.getElementById('studentEmail').value = '';
    document.getElementById('studentPercentage').value = '';
    document.getElementById('studentGrade').value = '';
    document.getElementById('studentAddress').value = '';
    
    // Reset photo fields
    const studentPhotoFile = document.getElementById('studentPhotoFile');
    const studentPhotoUrl = document.getElementById('studentPhotoUrl');
    const studentPhoto = document.getElementById('studentPhoto');
    
    if (studentPhotoFile) studentPhotoFile.value = '';
    if (studentPhotoUrl) studentPhotoUrl.value = '';
    if (studentPhoto) studentPhoto.value = '';
    
    // Reset image preview
    if (typeof removeUploadedImage === 'function') {
        removeUploadedImage();
    }
    
    editingStudentId = null;
    sessionStorage.removeItem('returnDepartment');
    document.querySelector('.page-title').textContent = 'Add New Student';
    document.querySelector('.page-subtitle').textContent = 'Fill in the student information below to add a new record to the system';
    document.querySelector('.btn-primary').textContent = 'Add Student';
}

// ==================== FORM MESSAGES ====================
function showFormMessage(type, message) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// ==================== RECENT STUDENTS ====================
function loadRecentStudents() {
    const students = getStudents();
    const recentStudents = students.slice(-5).reverse();
    
    const listElement = document.getElementById('recentStudentsList');
    
    if (!listElement) return;
    
    if (recentStudents.length === 0) {
        listElement.innerHTML = '<p>No students added yet.</p>';
        return;
    }
    
    listElement.innerHTML = recentStudents.map(student => `
        <div class="recent-student-card">
            <img src="${student.photo || 'https://i.pravatar.cc/150?img=1'}" 
                 alt="${student.name}" 
                 style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-right: 10px; vertical-align: middle;">
            <div style="display: inline-block; vertical-align: middle;">
                <strong>${student.name}</strong><br>
                ID: ${student.id} | Dept: ${student.department}<br>
                Grade: ${student.grade} (${student.percentage}%)
            </div>
        </div>
    `).join('');
}

// ==================== CONTACT FORM ====================
function submitContactForm() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value.trim();
    
    if (!name || !email || !subject || !message) {
        showContactMessage('error', 'Please fill in all required fields.');
        return;
    }
    if (!nameRegex.test(studentName)) {
    showFormMessage('error', 'Name must contain only letters and spaces (minimum 2 characters).');
    return;
}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showContactMessage('error', 'Please enter a valid email address.');
        return;
    }
    if (phone) {
        const phonePattern = /^\d{5}\d{5}$/;
        if (!phonePattern.test(phone)) {
            showContactMessage('error', 'Phone must be in format:  XXXXX XXXXX');
            return;
        }
    }
    showContactMessage('success', 'Your message has been sent successfully! We will get back to you soon.');
    
    alert(`Thank you, ${name}! Your message regarding "${subject}" has been submitted successfully.`);
    
    resetContactForm();
}

function resetContactForm() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('contactSubject').value = '';
    document.getElementById('contactMessage').value = '';
}

function showContactMessage(type, message) {
    const messageDiv = document.getElementById('contactFormMessage');
    if (!messageDiv) return;
    
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// ==================== AUTO-CALCULATE GRADE ====================
document.addEventListener('DOMContentLoaded', function() {
    const percentageInput = document.getElementById('studentPercentage');
    const gradeSelect = document.getElementById('studentGrade');
    
    if (percentageInput && gradeSelect) {
        percentageInput.addEventListener('input', function() {
            const percentage = parseFloat(this.value);
            
            if (!isNaN(percentage)) {
                let grade = '';
                if (percentage >= 90) grade = 'A+';
                else if (percentage >= 80) grade = 'A';
                else if (percentage >= 70) grade = 'B+';
                else if (percentage >= 60) grade = 'B';
                else if (percentage >= 50) grade = 'C';
                else if (percentage >= 40) grade = 'D';
                else grade = 'F';
                
                gradeSelect.value = grade;
            }
        });
    }
    
    // Load recent students if on add-student page
    if (window.location.pathname.includes('add-student.html')) {
        loadRecentStudents();
        
        // Check if editing a student
        loadEditingStudentData();
    }
});

// ==================== HANDLE DEPARTMENT REDIRECT ====================
window.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('records.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const dept = urlParams.get('dept');
        
        if (dept) {
            console.log('🔄 Redirecting to department:', dept);
            setTimeout(() => {
                showDepartmentRecords(dept);
            }, 100);
        }
    }
});