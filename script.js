// بيانات تجريبية
let store = {
  students:[
    {name:'يحيى حسين أحمد', codeA:'ABC123', codeB:'XYZ789', active:true, progress:{}},
    {name:'زياد ايهاب جمال', codeA:'DEF456', codeB:'UVW987', active:true, progress:{}},
    {name:'محمد علاء العبودي', codeA:'GHI789', codeB:'RST654', active:true, progress:{}}
  ],
  lessons:[
    {id:1, title:'مقدمة في الخلية', youtube:'https://www.youtube.com/embed/0z6U3kVQ3aU', form:'https://docs.google.com/forms/d/e/1FAIpQLSe-example-form/viewform?usp=sf_link'}
  ],
  teacher:{username:'yahia', password:'123456'}
};

let currentStudent=null;

// Theme toggle
document.getElementById('themeToggle').onclick = ()=>{
  document.body.className=document.body.className==='dark'?'light':'dark';
};

// Student login
document.getElementById('studentLoginBtn').onclick = ()=>{
  const codeA=document.getElementById('studentCodeA').value;
  const codeB=document.getElementById('studentCodeB').value;
  const student=store.students.find(s=>s.codeA===codeA && s.codeB===codeB);
  if(!student){document.getElementById('studentMsg').innerText='كود غير صحيح';return;}
  if(!student.active){document.getElementById('studentMsg').innerText='الحساب غير مفعل';return;}
  currentStudent=student;
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('studentPanel').classList.remove('hidden');
  document.getElementById('studentName').innerText=student.name;
  renderStudentPanel();
};

// Teacher login
document.getElementById('teacherLoginBtn').onclick = ()=>{
  const u=document.getElementById('teacherUsername').value;
  const p=document.getElementById('teacherPassword').value;
  if(u===store.teacher.username && p===store.teacher.password){
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('teacherPanel').classList.remove('hidden');
    renderTeacherPanel();
  }else{document.getElementById('teacherMsg').innerText='بيانات غير صحيحة';}
};

// Logout buttons
document.getElementById('studentLogoutBtn').onclick = ()=>{
  currentStudent=null;
  document.getElementById('studentPanel').classList.add('hidden');
  document.getElementById('landing').classList.remove('hidden');
};
document.getElementById('teacherLogoutBtn').onclick = ()=>{
  document.getElementById('teacherPanel').classList.add('hidden');
  document.getElementById('landing').classList.remove('hidden');
};

// Render functions
function renderStudentPanel(){
  const container=document.getElementById('lessonsContainer');
  container.innerHTML='';
  store.lessons.forEach(l=>{
    const card=document.createElement('div');
    card.className='card';
    card.innerHTML=`<h4>${l.title}</h4><iframe src="${l.youtube}"></iframe><button onclick='window.open("${l.form}")'>حل الكويز</button>`;
    container.appendChild(card);
  });
  // لوحة الصدارة ممكن نضيف لاحقاً مع Progress
}

function renderTeacherPanel(){
  // Students list
  const studentsList=document.getElementById('studentsList');
  studentsList.innerHTML='';
  store.students.forEach((s,i)=>{
    const div=document.createElement('div');
    div.innerHTML=`${s.name} - ${s.active?'نشط':'غير نشط'} <button onclick='toggleStudent(${i})'>تبديل التفعيل</button> <button onclick='resetProgress(${i})'>إعادة التقدم</button>`;
    studentsList.appendChild(div);
  });
  // Lessons list
  const lessonsList=document.getElementById('lessonsList');
  lessonsList.innerHTML='';
  store.lessons.forEach(l=>{
    const div=document.createElement('div');
    div.innerText=l.title;
    lessonsList.appendChild(div);
  });
}

// Teacher functions
window.toggleStudent=(i)=>{store.students[i].active=!store.students[i].active; renderTeacherPanel();}
window.resetProgress=(i)=>{store.students[i].progress={}; alert('تم إعادة التقدم');}

// Add student
document.getElementById('addStudentBtn').onclick = ()=>{
  const name=document.getElementById('newStudentName').value;
  if(!name){alert('أدخل اسم الطالب');return;}
  store.students.push({name, codeA:Math.random().toString(36).slice(2,8).toUpperCase(), codeB:Math.random().toString(36).slice(2,8).toUpperCase(), active:true, progress:{}});
  document.getElementById('newStudentName').value='';
  renderTeacherPanel();
}

// Add lesson
document.getElementById('addLessonBtn').onclick = ()=>{
  const title=document.getElementById('lessonTitle').value;
  const youtube=document.getElementById('lessonYouTube').value;
  const form=document.getElementById('lessonForm').value;
  if(!title || !youtube || !form){alert('أكمل كل الحقول');return;}
  store.lessons.push({id:store.lessons.length+1,title,youtube,form});
  document.getElementById('lessonTitle').value=''; document.getElementById('lessonYouTube').value=''; document.getElementById('lessonForm').value='';
  renderTeacherPanel();
    }
