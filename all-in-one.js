let students = JSON.parse(localStorage.getItem('students')||'[]');
let lessons = JSON.parse(localStorage.getItem('lessons')||'[]');
let currentStudent = null;

// ---------- Dark/Light Mode ----------
function toggleTheme(){
  if(document.body.classList.contains('dark')){
    document.body.classList.replace('dark','light');
    localStorage.setItem('theme','light');
  } else {
    document.body.classList.replace('light','dark');
    localStorage.setItem('theme','dark');
  }
}
function loadTheme(){
  const theme = localStorage.getItem('theme') || 'dark';
  document.body.className = theme;
}
document.getElementById('themeToggle').onclick = toggleTheme;
loadTheme();

// ---------- Utility ----------
function showSection(sectionId){
  ['landing','studentPanel','teacherPanel'].forEach(id=>{
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(sectionId).classList.remove('hidden');
}

// ---------- Student Login ----------
document.getElementById('loginBtn').onclick = ()=>{
  const type = document.getElementById('userType').value;
  if(type==='student'){
    const code = document.getElementById('studentCode').value.trim();
    const student = students.find(s=>s.code===code);
    if(!student) {document.getElementById('loginMsg').innerText='الكود غير صحيح'; return;}
    if(!student.active){document.getElementById('loginMsg').innerText='الكود معطل'; return;}
    currentStudent = student;
    document.getElementById('studentName').innerText = student.name;
    showSection('studentPanel');
    renderLessons();
    renderLeaderboard();
  } else {
    const username=document.getElementById('teacherUsername').value.trim();
    const password=document.getElementById('teacherPassword').value.trim();
    if(username==='admin' && password==='1234'){
      showSection('teacherPanel');
      renderStudents();
      renderLessonsTeacher();
    } else {
      document.getElementById('loginMsg').innerText='اسم المستخدم أو كلمة المرور غير صحيحة';
    }
  }
}

// ---------- Logout ----------
document.getElementById('studentLogoutBtn').onclick = ()=>{
  currentStudent=null;
  showSection('landing');
}
document.getElementById('teacherLogoutBtn').onclick = ()=>showSection('landing');

// ---------- Teacher Functions ----------
function generateCode(){
  const partA=Math.random().toString(36).substring(2,6).toUpperCase();
  const partB=Math.random().toString(36).substring(2,6).toUpperCase();
  return `${partA}-${partB}`;
}

document.getElementById('addStudentBtn').onclick = ()=>{
  const name=document.getElementById('newStudentName').value.trim();
  if(!name) return alert('ادخل اسم الطالب');
  const code=generateCode();
  students.push({id:Date.now(), name, code, active:true});
  localStorage.setItem('students',JSON.stringify(students));
  renderStudents();
  document.getElementById('newStudentName').value='';
}

function renderStudents(){
  const list=document.getElementById('studentsList');
  list.innerHTML='';
  students.forEach((s,i)=>{
    const div=document.createElement('div');
    div.innerHTML=`${s.name} | الكود: ${s.code} | <button onclick="toggleStudent(${i})">${s.active?'إيقاف':'تفعيل'}</button>`;
    list.appendChild(div);
  });
}

function toggleStudent(index){
  students[index].active=!students[index].active;
  localStorage.setItem('students',JSON.stringify(students));
  renderStudents();
}

// ---------- Lessons ----------
document.getElementById('addLessonBtn').onclick = ()=>{
  const title=document.getElementById('lessonTitle').value.trim();
  const yt=document.getElementById('lessonYouTube').value.trim();
  const form=document.getElementById('lessonForm').value.trim();
  if(!title || !yt) return alert('ادخل العنوان ورابط الفيديو');
  lessons.push({title, yt, form});
  localStorage.setItem('lessons',JSON.stringify(lessons));
  renderLessonsTeacher();
  document.getElementById('lessonTitle').value='';
  document.getElementById('lessonYouTube').value='';
  document.getElementById('lessonForm').value='';
}

function renderLessonsTeacher(){
  const list=document.getElementById('lessonsListTeacher');
  list.innerHTML='';
  lessons.forEach((l,i)=>{
    const div=document.createElement('div');
    div.innerHTML=`${l.title} | <button onclick="deleteLesson(${i})">حذف</button>`;
    list.appendChild(div);
  });
}

function deleteLesson(index){
  lessons.splice(index,1);
  localStorage.setItem('lessons',JSON.stringify(lessons));
  renderLessonsTeacher();
}

function renderLessons(){
  const container=document.getElementById('lessonsList');
  container.innerHTML='';
  lessons.forEach(l=>{
    const btn=document.createElement('button');
    btn.className='lessonBtn';
    btn.innerText=l.title;
    btn.setAttribute('data-src',l.yt);
    container.appendChild(btn);
  });
  attachLessonEvents();
}

// ---------- Show Video ----------
function attachLessonEvents(){
  document.querySelectorAll('.lessonBtn').forEach(btn=>{
    btn.onclick=()=>{
      const src=btn.getAttribute('data-src');
      const container=document.getElementById('lessonVideo');
      container.innerHTML=`<iframe src="${src}" allowfullscreen loading="lazy"></iframe>`;
      container.classList.remove('hidden');
      container.scrollIntoView({behavior:'smooth'});
    }
  });
}

// ---------- Leaderboard (example) ----------
function renderLeaderboard(){
  const container=document.getElementById('leaderboardContainer');
  container.innerHTML='';
  students.sort((a,b)=>b.id - a.id).forEach((s,i)=>{
    const div=document.createElement('div');
    div.innerText=`${i+1}. ${s.name}`;
    container.appendChild(div);
  });
  }
