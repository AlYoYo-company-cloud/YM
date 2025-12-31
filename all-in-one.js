document.addEventListener("DOMContentLoaded", function () {

/* ---------- بيانات الطلاب والمدرس ---------- */
let defaultStudents = [
  {name:"يحيى حسين أحمد", codeA:"YHA1", codeB:"YHA2", active:true},
  {name:"زياد ايهاب جمال", codeA:"ZIG1", codeB:"ZIG2", active:true},
  {name:"محمد محمد هاشم", codeA:"MMH1", codeB:"MMH2", active:true},
  {name:"عمر سعيد", codeA:"OS1", codeB:"OS2", active:true}
];

let students = JSON.parse(localStorage.getItem('students')) || defaultStudents;
localStorage.setItem('students', JSON.stringify(students));

let teacher = {username:"admin", password:"1234"};

let defaultLessons = [
  {title:"حل على الدعامة في الانسان", yt:"https://www.youtube.com/embed/P_-OHiOmftg"},
  {title:"كورس التأسيس لتالته ثانوي", yt:"https://www.youtube.com/embed/VNZ1ivdGhgE"},
  {title:"الدعامة في النبات", yt:"https://www.youtube.com/embed/ocYoCZesMmA"}
];

let lessons = JSON.parse(localStorage.getItem('lessons')) || defaultLessons;
localStorage.setItem('lessons', JSON.stringify(lessons));

let currentStudent = JSON.parse(localStorage.getItem('currentStudent')) || null;

/* ---------- Dark / Light ---------- */
function toggleTheme(){
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.className);
}
document.getElementById('themeToggle').onclick = toggleTheme;
document.body.className = localStorage.getItem('theme') || 'dark';

/* ---------- Utility ---------- */
function showSection(id){
  ['landing','studentPanel','teacherPanel'].forEach(s=>{
    document.getElementById(s).classList.add('hidden');
  });
  document.getElementById(id).classList.remove('hidden');
}

/* ---------- Student Login ---------- */
function loginStudent(codeA, codeB){
  const student = students.find(s => s.codeA === codeA && s.codeB === codeB);
  if(!student) return 'الكود غير صحيح';
  if(!student.active) return 'الكود معطل';

  currentStudent = student;
  localStorage.setItem('currentStudent', JSON.stringify(student));
  document.getElementById('studentName').innerText = student.name;

  showSection('studentPanel');
  renderLessons();
  renderLeaderboard();
  return null;
}

document.getElementById('loginBtn').onclick = ()=>{
  const type = document.getElementById('userType').value;

  if(type === 'student'){
    const err = loginStudent(
      document.getElementById('studentCodeA').value.trim(),
      document.getElementById('studentCodeB').value.trim()
    );
    document.getElementById('loginMsg').innerText = err || '';
  } else {
    if(
      document.getElementById('teacherUsername').value === teacher.username &&
      document.getElementById('teacherPassword').value === teacher.password
    ){
      showSection('teacherPanel');
      renderStudents();
      renderLessonsTeacher();
      document.getElementById('loginMsg').innerText = '';
    } else {
      document.getElementById('loginMsg').innerText = 'بيانات المدرس غير صحيحة';
    }
  }
};

/* ---------- Logout ---------- */
document.getElementById('studentLogoutBtn').onclick = ()=>{
  localStorage.removeItem('currentStudent');
  showSection('landing');
};
document.getElementById('teacherLogoutBtn').onclick = ()=>showSection('landing');

/* ---------- Auto Login ---------- */
if(currentStudent){
  document.getElementById('studentName').innerText = currentStudent.name;
  showSection('studentPanel');
  renderLessons();
  renderLeaderboard();
}

/* ---------- Lessons ---------- */
function renderLessons(){
  const list = document.getElementById('lessonsList');
  list.innerHTML = '';

  lessons.forEach(l=>{
    const btn = document.createElement('button');
    btn.className = 'lessonBtn';
    btn.innerText = l.title;
    btn.onclick = ()=>{
      const v = document.getElementById('lessonVideo');
      v.innerHTML = `<iframe src="${l.yt}" allowfullscreen></iframe>`;
      v.classList.remove('hidden');
    };
    list.appendChild(btn);
  });
}

/* ---------- Leaderboard ---------- */
function renderLeaderboard(){
  const c = document.getElementById('leaderboardContainer');
  c.innerHTML = '';
  students.forEach((s,i)=>{
    c.innerHTML += `<div>${i+1}. ${s.name}</div>`;
  });
}

/* ---------- Student Nav ---------- */
document.getElementById('showLessonsBtn').onclick = ()=>{
  document.getElementById('lessonsContainer').classList.remove('hidden');
  document.getElementById('leaderboardContainer').classList.add('hidden');
};
document.getElementById('showLeaderboardBtn').onclick = ()=>{
  document.getElementById('leaderboardContainer').classList.remove('hidden');
  document.getElementById('lessonsContainer').classList.add('hidden');
};

/* ---------- Teacher ---------- */
function renderStudents(){
  const list = document.getElementById('studentsList');
  list.innerHTML = '';
  students.forEach((s,i)=>{
    list.innerHTML += `
      <div>
        ${s.name} | ${s.codeA} - ${s.codeB}
        <button onclick="toggleStudent(${i})">
          ${s.active ? 'إيقاف' : 'تفعيل'}
        </button>
      </div>`;
  });
}

window.toggleStudent = function(i){
  students[i].active = !students[i].active;
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
};

function renderLessonsTeacher(){
  const list = document.getElementById('lessonsListTeacher');
  list.innerHTML = '';
  lessons.forEach((l,i)=>{
    list.innerHTML += `
      <div>${l.title}
        <button onclick="deleteLesson(${i})">حذف</button>
      </div>`;
  });
}

window.deleteLesson = function(i){
  lessons.splice(i,1);
  localStorage.setItem('lessons', JSON.stringify(lessons));
  renderLessonsTeacher();
};

});
