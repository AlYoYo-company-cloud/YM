// ---------- بيانات الطلاب والمدرس ----------
let students = [
  {name:"يحيى حسين أحمد", codeA:"YHA1", codeB:"YHA2", activeA:true, activeB:true},
  {name:"زياد ايهاب جمال", codeA:"ZIG1", codeB:"ZIG2", activeA:true, activeB:true},
  {name:"محمد محمد هاشم", codeA:"MMH1", codeB:"MMH2", activeA:true, activeB:true},
  {name:"عمر سعيد", codeA:"OS1", codeB:"OS2", activeA:true, activeB:true}
];

let teacher = {username:"admin", password:"1234", codeA:"TCH1", codeB:"TCH2"};

// حفظ واسترجاع من LocalStorage
if(!localStorage.getItem('students')) localStorage.setItem('students', JSON.stringify(students));
if(!localStorage.getItem('lessons')) localStorage.setItem('lessons', JSON.stringify([]));
students = JSON.parse(localStorage.getItem('students'));
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
    const codeA = document.getElementById('studentCodeA').value.trim();
    const codeB = document.getElementById('studentCodeB').value.trim();
    const student = students.find(s=>s.codeA===codeA && s.codeB===codeB);
    if(!student) {document.getElementById('loginMsg').innerText='الكود غير صحيح'; return;}
    if(!student.activeA || !student.activeB){document.getElementById('loginMsg').innerText='الكود معطل'; return;}
    currentStudent = student;
    document.getElementById('studentName').innerText = student.name;
    showSection('studentPanel');
    renderLessons();
    renderLeaderboard();
  } else {
    const username=document.getElementById('teacherUsername').value.trim();
    const password=document.getElementById('teacherPassword').value.trim();
    if(username===teacher.username && password===teacher.password){
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
  return {codeA:partA, codeB:partB};
}

document.getElementById('addStudentBtn').onclick = ()=>{
  const name=document.getElementById('newStudentName').value.trim();
  if(!name) return alert('ادخل اسم الطالب');
  const codes = generateCode();
  students.push({id:Date.now(), name, codeA:codes.codeA, codeB:codes.codeB, activeA:true, activeB:true});
  localStorage.setItem('students',JSON.stringify(students));
  renderStudents();
  document.getElementById('newStudentName').value='';
}

function renderStudents(){
  const list=document.getElementById('studentsList');
  list.innerHTML='';
  students.forEach((s,i)=>{
    const div=document.createElement('div');
    div.innerHTML=`${s.name} | الكود A: ${s.codeA} | الكود B: ${s.codeB} | 
    <button onclick="toggleStudentA(${i})">${s.activeA?'إيقاف A':'تفعيل A'}</button>
    <button onclick="toggleStudentB(${i})">${s.activeB?'إيقاف B':'تفعيل B'}</button>`;
    list.appendChild(div);
  });
}

function toggleStudentA(index){
  students[index].activeA=!students[index].activeA;
  localStorage.setItem('students',JSON.stringify(students));
  renderStudents();
}
function toggleStudentB(index){
  students[index].activeB=!students[index].activeB;
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
