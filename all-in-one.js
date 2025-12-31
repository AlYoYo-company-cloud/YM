document.addEventListener('DOMContentLoaded', () => {
  let currentStudent = null;
  let lessons = [];
  let students = [];

  /* ===== Dark/Light Mode ===== */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', toggleTheme);

  function toggleTheme(){
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('dark')?'dark':'light');
  }

  function loadTheme(){
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.remove('dark','light');
    document.body.classList.add(savedTheme);
  }
  loadTheme();

  /* ===== User Type Toggle ===== */
  const userType = document.getElementById('userType');
  userType?.addEventListener('change',()=>{
    if(userType.value==='student'){
      document.getElementById('studentFields').classList.remove('hidden');
      document.getElementById('teacherFields').classList.add('hidden');
    } else {
      document.getElementById('studentFields').classList.add('hidden');
      document.getElementById('teacherFields').classList.remove('hidden');
    }
  });

  /* ===== Login ===== */
  const loginBtn = document.getElementById('loginBtn');
  loginBtn?.addEventListener('click',()=>{
    const type = userType.value;
    if(type==='student'){
      const codeA = document.getElementById('studentCodeA').value;
      const codeB = document.getElementById('studentCodeB').value;
      const result = studentLogin(codeA, codeB);
      document.getElementById('loginMsg').innerText = result.error || '';
    } else {
      const username = document.getElementById('teacherUsername').value;
      const password = document.getElementById('teacherPassword').value;
      const result = teacherLogin(username,password);
      document.getElementById('loginMsg').innerText = result.error || '';
    }
  });

  function studentLogin(codeA, codeB){
    if(codeA && codeB){
      currentStudent = {name:'طالب مثال'};
      document.getElementById('studentName').innerText = currentStudent.name;
      showSection('studentPanel');
      renderLessons();
      return {};
    }
    return {error:'الرجاء إدخال الكودين'};
  }

  function teacherLogin(username,password){
    if(username==='admin' && password==='1234'){
      showSection('teacherPanel');
      renderStudents();
      renderLessonsTeacher();
      return {};
    }
    return {error:'اسم المستخدم أو كلمة المرور غير صحيحة'};
  }

  /* ===== Show Sections ===== */
  function showSection(sectionId){
    ['landing','studentPanel','teacherPanel'].forEach(id=>{
      document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
  }

  /* ===== Logout ===== */
  document.getElementById('studentLogoutBtn')?.addEventListener('click',()=>{
    currentStudent=null;
    showSection('landing');
  });
  document.getElementById('teacherLogoutBtn')?.addEventListener('click',()=>showSection('landing'));

  /* ===== Student Search ===== */
  document.getElementById('searchLesson')?.addEventListener('input', e=>{
    const filter = e.target.value.toLowerCase();
    document.querySelectorAll('#lessonsContainer .lesson-card').forEach(card=>{
      card.style.display = card.querySelector('h4').innerText.toLowerCase().includes(filter)?'':'none';
    });
  });

  /* ===== Teacher Add Student ===== */
  document.getElementById('addStudentBtn')?.addEventListener('click',()=>{
    const name = document.getElementById('newStudentName').value;
    if(name){
      students.push(name);
      renderStudents();
      document.getElementById('newStudentName').value='';
    }
  });

  function renderStudents(){
    const list = document.getElementById('studentsList');
    list.innerHTML='';
    students.forEach(s=>{
      const div = document.createElement('div');
      div.innerText=s;
      list.appendChild(div);
    });
  }

  /* ===== Teacher Add Lesson ===== */
  document.getElementById('addLessonBtn')?.addEventListener('click',()=>{
    const title = document.getElementById('lessonTitle').value;
    const yt = document.getElementById('lessonYouTube').value;
    const form = document.getElementById('lessonForm').value;
    if(title){
      lessons.push({title,yt,form});
      renderLessons();
      document.getElementById('lessonTitle').value='';
      document.getElementById('lessonYouTube').value='';
      document.getElementById('lessonForm').value='';
    }
  });

  function renderLessons(){
    const container = document.getElementById('lessonsContainer');
    container.innerHTML='';
    lessons.forEach(l=>{
      const div = document.createElement('div');
      div.className='lesson-card card';
      div.innerHTML = `
        <h4>${l.title}</h4>
        ${l.yt?`<iframe src="${l.yt}" loading="lazy"></iframe>`:''}
        ${l.form?`<a href="${l.form}" target="_blank"><button>رابط الفورم</button></a>`:''}
      `;
      container.appendChild(div);
    });
  }

  function renderLessonsTeacher(){
    const container = document.getElementById('lessonsList');
    container.innerHTML='';
    lessons.forEach(l=>{
      const div = document.createElement('div');
      div.innerText = l.title;
      container.appendChild(div);
    });
  }

});
