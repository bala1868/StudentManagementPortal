// ==================== GLOBAL VARIABLES ====================
let currentDepartment = '';
let editingStudentId = null;

// ==================== FETCH STUDENTS FROM JSON ====================
async function fetchStudentsFromJSON() {
    try {
        const response = await fetch('../students.json');
        if (!response.ok) {
            throw new Error('Failed to fetch students.json');
        }
        const data = await response.json();
        console.log('✅ Students loaded from JSON:', data);
        return data;
    } catch (error) {
        console.error('❌ Error fetching student data:', error);
        console.log('📋 Using fallback sample data...');
        return [
            {
                id: "STU001",
                name: "Rajesh Kumar",
                class: "1st Year",
                department: "CSE",
                contact: "+91 98765 43210",
                email: "rajesh.kumar@auracollege.edu",
                percentage: 92.5,
                grade: "A+",
                photo: "https://i.pravatar.cc/150?img=10",
                address: "Chennai, Tamil Nadu"
            },
            {
                id: "STU002",
                name: "Priya Sharma",
                class: "2nd Year",
                department: "ECE",
                contact: "+91 98765 43211",
                email: "priya.sharma@auracollege.edu",
                percentage: 88.0,
                grade: "A",
                photo: "https://i.pravatar.cc/150?img=11",
                address: "Coimbatore, Tamil Nadu"
            },
            {
                id: "STU003",
                name: "Amit Patel",
                class: "3rd Year",
                department: "MECH",
                contact: "+91 98765 43212",
                email: "amit.patel@auracollege.edu",
                percentage: 85.5,
                grade: "A",
                photo: "https://i.pravatar.cc/150?img=12",
                address: "Salem, Tamil Nadu"
            },
            {
                id: "STU004",
                name: "Sneha Reddy",
                class: "1st Year",
                department: "CIVIL",
                contact: "+91 98765 43213",
                email: "sneha.reddy@auracollege.edu",
                percentage: 90.0,
                grade: "A+",
                photo: "https://i.pravatar.cc/150?img=13",
                address: "Madurai, Tamil Nadu"
            },
            {
                id: "STU005",
                name: "Vikram Singh",
                class: "2nd Year",
                department: "EEE",
                contact: "+91 98765 43214",
                email: "vikram.singh@auracollege.edu",
                percentage: 87.5,
                grade: "A",
                photo: "https://i.pravatar.cc/150?img=14",
                address: "Trichy, Tamil Nadu"
            },
            {
                id: "STU006",
                name: "Meera Krishnan",
                class: "3rd Year",
                department: "IT",
                contact: "+91 98765 43215",
                email: "meera.krishnan@auracollege.edu",
                percentage: 91.0,
                grade: "A+",
                photo: "https://i.pravatar.cc/150?img=15",
                address: "Erode, Tamil Nadu"
            }
        ];
    }
}

// ==================== INITIALIZE LOCAL STORAGE ====================
async function initializeLocalStorage() {
    const existingData = localStorage.getItem('students');
    
    if (!existingData || existingData === 'undefined' || existingData === 'null') {
        console.log('🔄 Initializing localStorage with sample data...');
        try {
            const sampleStudents = await fetchStudentsFromJSON();
            localStorage.setItem('students', JSON.stringify(sampleStudents));
            console.log('✅ LocalStorage initialized successfully with', sampleStudents.length, 'students');
        } catch (error) {
            console.error('❌ Failed to initialize localStorage:', error);
        }
    } else {
        console.log('✅ LocalStorage already contains student data');
        try {
            const students = JSON.parse(existingData);
            console.log('📊 Found', students.length, 'students in localStorage');
        } catch (error) {
            console.error('❌ Invalid data in localStorage, reinitializing...');
            localStorage.removeItem('students');
            await initializeLocalStorage();
        }
    }
}

// ==================== GET STUDENTS FROM STORAGE ====================
function getStudents() {
    const studentsData = localStorage.getItem('students');
    
    if (!studentsData || studentsData === 'undefined' || studentsData === 'null') {
        console.warn('⚠️ No student data found in localStorage');
        return [];
    }
    
    try {
        const students = JSON.parse(studentsData);
        return Array.isArray(students) ? students : [];
    } catch (error) {
        console.error('❌ Error parsing student data:', error);
        return [];
    }
}

// ==================== SAVE STUDENTS TO STORAGE ====================
function saveStudents(students) {
    try {
        localStorage.setItem('students', JSON.stringify(students));
        console.log('💾 Students saved to localStorage:', students.length, 'records');
    } catch (error) {
        console.error('❌ Error saving students:', error);
    }
}

// ==================== DELETE STUDENT ====================
function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student record?')) {
        let students = getStudents();
        const studentToDelete = students.find(s => s.id === studentId);
        
        students = students.filter(student => student.id !== studentId);
        saveStudents(students);
        
        if (currentDepartment) {
            loadStudentRecords(currentDepartment);
        }
        
        alert(`Student ${studentToDelete ? studentToDelete.name : ''} deleted successfully!`);
    }
}

// ==================== EDIT STUDENT ====================
function editStudent(studentId) {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        alert('Student not found!');
        return;
    }
    
    console.log('✏️ Editing student:', student);
    
    sessionStorage.setItem('editingStudent', JSON.stringify(student));
    sessionStorage.setItem('returnDepartment', currentDepartment);
    
    window.location.href = 'add-student.html';
}

// ==================== LOAD EDITING STUDENT DATA ====================
function loadEditingStudentData() {
    const editingStudent = sessionStorage.getItem('editingStudent');
    
    if (editingStudent) {
        const student = JSON.parse(editingStudent);
        editingStudentId = student.id;
        
        console.log('📝 Loading student data for editing:', student);
        
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentId').readOnly = true;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentClass').value = student.class;
        document.getElementById('studentDepartment').value = student.department;
        document.getElementById('studentContact').value = student.contact;
        document.getElementById('studentEmail').value = student.email;
        document.getElementById('studentPercentage').value = student.percentage;
        document.getElementById('studentGrade').value = student.grade;
        document.getElementById('studentPhoto').value = student.photo || '';
        document.getElementById('studentAddress').value = student.address || '';
        
        document.querySelector('.page-title').textContent = 'Edit Student';
        document.querySelector('.page-subtitle').textContent = 'Update the student information below';
        document.querySelector('.btn-primary').textContent = 'Update Student';
        
        sessionStorage.removeItem('editingStudent');
    }
}
