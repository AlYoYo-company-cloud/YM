// ---------- بيانات الطلاب والمدرس ----------
let students = JSON.parse(localStorage.getItem('students')) || [
  {name:"يحيى حسين أحمد", code:"YHA1", active:true},
  {name:"زياد ايهاب جمال", code:"ZIG1", active:true},
  {name:"محمد محمد هاشم", code:"MMH1", active:true},
  {name:"عمر سعيد", code:"OS1", active:true}
];

let teacher = {username:"admin", password:"1234"};
let lessons = JSON.parse(localStorage.getItem('lessons')) || [
  {title:"حل على الدعامة في الانسان", yt:"https://www.youtube.com/embed/P_-OHiOmftg"},
  {title:"كورس التأسيس لتالته ثانوي", yt:"https://www.youtube.com/embed/VNZ1ivdGhgE"},
  {title:"الدعامة في النبات", yt:"https://www.youtube.com/embed/ocYoCZesMmA"}
];
let currentStudent = JSON.parse(localStorage.getItem('currentStudent')) || null;

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
function loginStudent(code){
  const student = students.find(s => s.code === code);
  if(!student) return 'الكود غير صحيح';
  if(!student.active) return 'الكود معطل';
  currentStudent = student;
  localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
  document.getElementById('studentName').innerText = student.name;
  showSection('studentPanel');
  renderLessons();
  renderLeaderboard();
  return null;
}

document.getElementById('loginBtn').onclick = ()=>{
  const type = document.getElementById('userType').value;
  if(type==='student'){
    const code = document.getElementById('studentCode').value.trim();
    const err = loginStudent(code);
    if(err) document.getElementById('loginMsg').innerText = err;
  } else {
    const username = document.getElementById('teacherUsername').value.trim();
    const password = document.getElementById('teacherPassword').value.trim();
    if(username === teacher.username && password === teacher.password){
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
  localStorage.removeItem('currentStudent');
  showSection('landing');
}
document.getElementById('teacherLogoutBtn').onclick = ()=>showSection('landing');

// ---------- Auto-login if session exists ----------
window.addEventListener('load', ()=>{
  if(currentStudent){
    document.getElementById('studentName').innerText = currentStudent.name;
    showSection('studentPanel');
    renderLessons();
    renderLeaderboard();
  }
});

// ---------- Teacher Functions ----------
function generateCode(){
  return Math.random().toString(36).substring(2,6).toUpperCase();
}

document.getElementById('addStudentBtn').onclick = ()=>{
  const name=document.getElementById('newStudentName').value.trim();
  if(!name) return alert('ادخل اسم الطالب');
  const code = generateCode();
  students.push({name, code, active:true});
  localStorage.setItem('students',JSON.stringify(students));
  renderStudents();
  document.getElementById('newStudentName').value='';
}

function renderStudents(){
  const list=document.getElementById('studentsList');
  list.innerHTML='';
  students.forEach((s,i)=>{
    const div=document.createElement('div');
    div.innerHTML=`${s.name} | الكود: ${s.code} | 
    <button onclick="toggleStudent(${i})">${s.active?'إيقاف':'تفعيل'}</button>`;
    list.appendChild(div);
  });
}

function toggleStudent(index){
  students[index].active = !students[index].active;
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
}

// ---------- Lessons ----------
document.getElementById('addLessonBtn').onclick = ()=>{
  const title=document.getElementById('lessonTitle').value.trim();
  const yt=document.getElementById('lessonYouTube').value.trim();
  if(!title || !yt) return alert('ادخل العنوان ورابط الفيديو');
  lessons.push({title, yt});
  localStorage.setItem('lessons',JSON.stringify(lessons));
  renderLessonsTeacher();
  document.getElementById('lessonTitle').value='';
  document.getElementById('lessonYouTube').value='';
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

// ---------- Leaderboard ----------
function renderLeaderboard(){
  const container=document.getElementById('leaderboardContainer');
  container.innerHTML='';
  students.forEach((s,i)=>{
    const div=document.createElement('div');
    div.innerText=`${i+1}. ${s.name}`;
    container.appendChild(div);
  });
}

// ---------- Buttons to toggle student panels ----------
document.getElementById('showLessonsBtn').onclick = ()=>{
  document.getElementById('lessonsContainer').classList.remove('hidden');
  document.getElementById('leaderboardContainer').classList.add('hidden');
};
document.getElementById('showLeaderboardBtn').onclick = ()=>{
  document.getElementById('leaderboardContainer').classList.remove('hidden');
  document.getElementById('lessonsContainer').classList.add('hidden');
};
