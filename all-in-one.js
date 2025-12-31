document.addEventListener('DOMContentLoaded', () => {

  let currentStudent = null;

  // ===== Dark/Light Mode =====
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', toggleTheme);

  function toggleTheme() {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.remove('dark','light');
    document.body.classList.add(savedTheme);
  }

  loadTheme();

  // ===== User Type Toggle =====
  const userType = document.getElementById('userType');
  userType?.addEventListener('change', () => {
    if(userType.value === 'student'){
      document.getElementById('studentFields').classList.remove('hidden');
      document.getElementById('teacherFields').classList.add('hidden');
    } else {
      document.getElementById('studentFields').classList.add('hidden');
      document.getElementById('teacherFields').classList.remove('hidden');
    }
  });

  // ===== Login =====
  const loginBtn = document.getElementById('loginBtn');
  loginBtn?.addEventListener('click', () => {
    const type = userType.value;
    if(type==='student'){
      const codeA = document.getElementById('studentCodeA').value;
      const codeB = document.getElementById('studentCodeB').value;
      const result = studentLogin(codeA, codeB);
      document.getElementById('loginMsg').innerText = result.error || '';
    } else {
      const username = document.getElementById('teacherUsername').value;
      const password = document.getElementById('teacherPassword').value;
      const result = teacherLogin(username, password);
      document.getElementById('loginMsg').innerText = result.error || '';
    }
  });

  function studentLogin(codeA, codeB) {
    if(codeA && codeB){
      currentStudent = {name: 'طالب مثال'};
      document.getElementById('studentName').innerText = currentStudent.name;
      showSection('studentPanel');
      return {};
    }
    return {error: 'الرجاء إدخال الكودين'};
  }

  function teacherLogin(username,password) {
    if(username==='admin' && password==='1234'){
      showSection('teacherPanel');
      return {};
    }
    return {error: 'اسم المستخدم أو كلمة المرور غير صحيحة'};
  }

  // ===== Show Sections =====
  function showSection(sectionId){
    ['landing','studentPanel','teacherPanel'].forEach(id=>{
      document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
  }

  // ===== Logout =====
  const studentLogoutBtn = document.getElementById('studentLogoutBtn');
  studentLogoutBtn?.addEventListener('click', ()=>{
    currentStudent = null;
    showSection('landing');
  });

  const teacherLogoutBtn = document.getElementById('teacherLogoutBtn');
  teacherLogoutBtn?.addEventListener('click', ()=>{
    showSection('landing');
  });

});
