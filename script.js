/* ======================================== all-in-one.js

يحتوي على كل وظائف المنصة في ملف واحد

يشمل:

users.js: بيانات الطلاب والمدرس + LocalStorage

lessons.js: بيانات الدروس وإدارتها

utils.js: وظائف مساعدة (تبديل الوضع، عرض/إخفاء الأقسام، توليد الأكواد)

student.js: وظائف الطلاب (تسجيل الدخول، عرض الدروس، لوحة الصدارة)

teacher.js: وظائف المدرس (تسجيل الدخول، إدارة الطلاب والدروس) ======================================== */



// ====================== users.js ====================== let students = [ { name: 'يحيى حسين أحمد', codeA: 'ABC123', codeB: 'XYZ789', active: true, progress: {} }, { name: 'زياد ايهاب جمال', codeA: 'DEF456', codeB: 'UVW987', active: true, progress: {} }, { name: 'محمد علاء العبودي', codeA: 'GHI789', codeB: 'RST654', active: true, progress: {} } ];

let teacher = { username: 'yahia', password: '123456' };

function saveToStorage() { localStorage.setItem('students', JSON.stringify(students)); localStorage.setItem('teacher', JSON.stringify(teacher)); }

function loadFromStorage() { const s = localStorage.getItem('students'); const t = localStorage.getItem('teacher'); if (s) students = JSON.parse(s); if (t) teacher = JSON.parse(t); } loadFromStorage();

// ====================== lessons.js ====================== let lessons = [ { id: 1, title: 'مقدمة في الخلية', youtube: 'https://www.youtube.com/embed/0z6U3kVQ3aU', form: 'https://docs.google.com/forms/d/e/1FAIpQLSe-example-form/viewform?usp=sf_link' }, { id: 2, title: 'الحمض النووي DNA', youtube: 'https://www.youtube.com/embed/example2', form: 'https://docs.google.com/forms/d/e/1FAIpQLSe-example2/viewform?usp=sf_link' } ];

function addLesson(title, youtube, form) { lessons.push({ id: lessons.length + 1, title, youtube, form }); }

function getLessonById(id) { return lessons.find(l => l.id === id); }

// ====================== utils.js ====================== function toggleTheme() { document.body.classList.toggle('dark'); document.body.classList.toggle('light'); localStorage.setItem('theme', document.body.className); }

function loadTheme() { const mode = localStorage.getItem('theme') || 'dark'; document.body.className = mode; }

function showSection(sectionId) { document.querySelectorAll('main section').forEach(s => s.classList.add('hidden')); document.getElementById(sectionId).classList.remove('hidden'); }

function generateCode() { return Math.random().toString(36).slice(2,8).toUpperCase(); }

// ====================== student.js ====================== let currentStudent = null;

function studentLogin(codeA, codeB) { const student = students.find(s => s.codeA === codeA && s.codeB === codeB); if (!student) return { error: 'كود غير صحيح' }; if (!student.active) return { error: 'الحساب غير مفعل' }; currentStudent = student; showSection('studentPanel'); document.getElementById('studentName').innerText = student.name; renderLessons(); renderLeaderboard(); return { success: true }; }

function renderLessons() { const container = document.getElementById('lessonsContainer'); container.innerHTML = ''; lessons.forEach(l => { const card = document.createElement('div'); card.className = 'card lesson-card'; card.innerHTML = <h4>${l.title}</h4> <button onclick="openLesson('${l.youtube}')">مشاهدة الفيديو</button> <button onclick="window.open('${l.form}', '_blank')">حل الكويز</button>; container.appendChild(card); }); }

function openLesson(url) { const container = document.getElementById('lessonsContainer'); container.innerHTML = <button onclick="renderLessons()">العودة للقائمة</button><iframe src="${url}" allowfullscreen></iframe>; }

function renderLeaderboard() { const container = document.getElementById('leaderboardContainer'); container.innerHTML = '<h3>لوحة الصدارة</h3>'; }

// ====================== teacher.js ====================== function teacherLogin(username, password) { if (username === teacher.username && password === teacher.password) { showSection('teacherPanel'); renderStudents(); renderTeacherLessons(); return { success: true }; } else return { error: 'بيانات غير صحيحة' }; }

function addStudent(name) { const newStudent = { name, codeA: generateCode(), codeB: generateCode(), active: true, progress: {} }; students.push(newStudent); saveToStorage(); renderStudents(); }

function toggleStudent(index) { students[index].active = !students[index].active; saveToStorage(); renderStudents(); }

function resetProgress(index) { students[index].progress = {}; saveToStorage(); alert('تم إعادة التقدم'); }

function renderStudents() { const list = document.getElementById('studentsList'); list.innerHTML = ''; students.forEach((s,i) => { const div = document.createElement('div'); div.innerHTML = ${s.name} - ${s.active ? 'نشط' : 'غير نشط'} <button onclick="toggleStudent(${i})">تبديل التفعيل</button> <button onclick="resetProgress(${i})">إعادة التقدم</button>; list.appendChild(div); }); }

function renderTeacherLessons() { const list = document.getElementById('lessonsList'); list.innerHTML = ''; lessons.forEach(l => { const div = document.createElement('div'); div.innerText = l.title; list.appendChild(div); }); }

function addTeacherLesson(title, youtube, form) { addLesson(title, youtube, form); renderTeacherLessons(); }
