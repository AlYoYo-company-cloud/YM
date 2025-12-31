document.addEventListener("DOMContentLoaded", function () {

  /* ---------- بيانات الطلاب ---------- */
  let students = [
    {name:"يحيى حسين أحمد", codeA:"YHA1", codeB:"YHA2", active:true},
    {name:"زياد ايهاب جمال", codeA:"ZIG1", codeB:"ZIG2", active:true},
    {name:"محمد محمد هاشم", codeA:"MMH1", codeB:"MMH2", active:true},
    {name:"عمر سعيد", codeA:"OS1", codeB:"OS2", active:true}
  ];

  let teacher = {username:"admin", password:"1234"};

  /* ---------- الدروس الثابتة ---------- */
  let lessons = [
    {title:"حل على الدعامة في الانسان", yt:"https://www.youtube.com/embed/P_-OHiOmftg"},
    {title:"كورس التأسيس لتالته ثانوي", yt:"https://www.youtube.com/embed/VNZ1ivdGhgE"},
    {title:"الدعامة في النبات", yt:"https://www.youtube.com/embed/ocYoCZesMmA"}
  ];

  let currentStudent = null;

  /* ---------- Dark / Light ---------- */
  function toggleTheme(){
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
  }
  document.getElementById('themeToggle').onclick = toggleTheme;

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
    document.getElementById('studentName').innerText = student.name;

    showSection('studentPanel');
    showLessonsPanel();  // نجعل قائمة الدروس تظهر تلقائيًا بعد تسجيل الدخول
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
    currentStudent = null;
    showSection('landing');
  };
  document.getElementById('teacherLogoutBtn').onclick = ()=>showSection('landing');

  /* ---------- Auto Login ---------- */
  if(currentStudent){
    document.getElementById('studentName').innerText = currentStudent.name;
    showSection('studentPanel');
    showLessonsPanel(); // تظهر قائمة الدروس تلقائيًا
    renderLessons();
    renderLeaderboard();
  }

  /* ---------- Lessons ---------- */
  function renderLessons(){
    const list = document.getElementById('lessonsList');
    list.innerHTML = '';

    lessons.forEach((l, index)=>{
      const btn = document.createElement('button');
      btn.className = 'lessonBtn';
      btn.innerText = l.title;
      btn.dataset.index = index;
      list.appendChild(btn);
    });
  }

  /* ---------- Show Video ---------- */
  document.getElementById('lessonsList').addEventListener('click', function(e){
    if(e.target && e.target.classList.contains('lessonBtn')){
      const idx = e.target.dataset.index;
      const v = document.getElementById('lessonVideo');
      v.innerHTML = `<iframe src="${lessons[idx].yt}" allowfullscreen></iframe>`;
      v.classList.remove('hidden');
      v.scrollIntoView({behavior:'smooth'});
    }
  });

  /* ---------- Leaderboard ---------- */
  function renderLeaderboard(){
    const c = document.getElementById('leaderboardContainer');
    c.innerHTML = '';
    students.forEach((s,i)=>{
      c.innerHTML += `<div>${i+1}. ${s.name}</div>`;
    });
  }

  /* ---------- Student Nav ---------- */
  function showLessonsPanel(){
    document.getElementById('lessonsContainer').classList.remove('hidden');
    document.getElementById('leaderboardContainer').classList.add('hidden');
  }

  document.getElementById('showLessonsBtn').onclick = showLessonsPanel;
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
    renderLessonsTeacher();
    renderLessons();
  };

  /* ---------- Add Student ---------- */
  document.getElementById('addStudentBtn').onclick = ()=>{
    const name = document.getElementById('newStudentName').value.trim();
    if(!name) return alert('ادخل اسم الطالب');
    const codeA = Math.random().toString(36).substring(2,6).toUpperCase();
    const codeB = Math.random().toString(36).substring(2,6).toUpperCase();
    students.push({name, codeA, codeB, active:true});
    renderStudents();
    document.getElementById('newStudentName').value = '';
  };

  /* ---------- Add Lesson ---------- */
  document.getElementById('addLessonBtn').onclick = ()=>{
    const title = document.getElementById('lessonTitle').value.trim();
    const yt = document.getElementById('lessonYouTube').value.trim();
    if(!title || !yt) return alert('ادخل العنوان ورابط الفيديو');
    lessons.push({title, yt});
    renderLessonsTeacher();
    renderLessons();
    document.getElementById('lessonTitle').value = '';
    document.getElementById('lessonYouTube').value = '';
  };

});
