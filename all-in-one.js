// ================== DATA ==================

// بيانات افتراضية
let defaultStudents = [
  {name:"يحيى حسين أحمد", codeA:"YHA1", codeB:"YHA2", active:true},
  {name:"زياد ايهاب جمال", codeA:"ZIG1", codeB:"ZIG2", active:true},
  {name:"محمد محمد هاشم", codeA:"MMH1", codeB:"MMH2", active:true},
  {name:"عمر سعيد", codeA:"OS1", codeB:"OS2", active:true}
];

// تحميل الطلاب
let students = JSON.parse(localStorage.getItem("students"));
if(!students || !Array.isArray(students)){
  students = defaultStudents;
}

// 🔴 إصلاح نهائي: إعادة تفعيل كل الأكواد
students = students.map(s => ({...s, active:true}));
localStorage.setItem("students", JSON.stringify(students));

// المدرس
let teacher = {username:"admin", password:"1234"};

// الدروس
let defaultLessons = [
  {title:"حل على الدعامة في الانسان", yt:"https://www.youtube.com/embed/P_-OHiOmftg"},
  {title:"كورس التأسيس لتالته ثانوي", yt:"https://www.youtube.com/embed/VNZ1ivdGhgE"},
  {title:"الدعامة في النبات", yt:"https://www.youtube.com/embed/ocYoCZesMmA"}
];

let lessons = JSON.parse(localStorage.getItem("lessons")) || defaultLessons;
localStorage.setItem("lessons", JSON.stringify(lessons));

let currentStudent = JSON.parse(localStorage.getItem("currentStudent")) || null;

// ================== THEME ==================

function toggleTheme(){
  if(document.body.classList.contains("dark")){
    document.body.classList.replace("dark","light");
    localStorage.setItem("theme","light");
  } else {
    document.body.classList.replace("light","dark");
    localStorage.setItem("theme","dark");
  }
}

function loadTheme(){
  document.body.className = localStorage.getItem("theme") || "dark";
}

document.getElementById("themeToggle").onclick = toggleTheme;
loadTheme();

// ================== UI ==================

function showSection(id){
  ["landing","studentPanel","teacherPanel"].forEach(sec=>{
    document.getElementById(sec).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

// ================== LOGIN ==================

function loginStudent(codeA, codeB){
  const student = students.find(
    s => s.codeA === codeA && s.codeB === codeB
  );

  if(!student) return "الكود غير صحيح";

  // ❌ تم إلغاء فحص التعطيل نهائياً
  currentStudent = student;
  localStorage.setItem("currentStudent", JSON.stringify(student));

  document.getElementById("studentName").innerText = student.name;
  showSection("studentPanel");
  renderLessons();
  renderLeaderboard();
  return null;
}

document.getElementById("loginBtn").onclick = ()=>{
  const type = document.getElementById("userType").value;

  if(type === "student"){
    const codeA = document.getElementById("studentCodeA").value.trim();
    const codeB = document.getElementById("studentCodeB").value.trim();
    const err = loginStudent(codeA, codeB);
    document.getElementById("loginMsg").innerText = err || "";
  } else {
    const u = document.getElementById("teacherUsername").value.trim();
    const p = document.getElementById("teacherPassword").value.trim();
    if(u === teacher.username && p === teacher.password){
      showSection("teacherPanel");
      renderStudents();
      renderLessonsTeacher();
      document.getElementById("loginMsg").innerText = "";
    } else {
      document.getElementById("loginMsg").innerText = "بيانات المدرس غير صحيحة";
    }
  }
};

// ================== LOGOUT ==================

document.getElementById("studentLogoutBtn").onclick = ()=>{
  localStorage.removeItem("currentStudent");
  currentStudent = null;
  showSection("landing");
};

document.getElementById("teacherLogoutBtn").onclick = ()=>{
  showSection("landing");
};

// ================== AUTO LOGIN ==================

window.addEventListener("load", ()=>{
  if(currentStudent){
    document.getElementById("studentName").innerText = currentStudent.name;
    showSection("studentPanel");
    renderLessons();
    renderLeaderboard();
  }
});

// ================== TEACHER ==================

function generateCode(){
  return Math.random().toString(36).substring(2,6).toUpperCase();
}

document.getElementById("addStudentBtn").onclick = ()=>{
  const name = document.getElementById("newStudentName").value.trim();
  if(!name) return alert("اكتب اسم الطالب");

  students.push({
    name,
    codeA: generateCode(),
    codeB: generateCode(),
    active:true
  });

  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
  document.getElementById("newStudentName").value="";
};

function renderStudents(){
  const list = document.getElementById("studentsList");
  list.innerHTML="";
  students.forEach((s,i)=>{
    const div = document.createElement("div");
    div.innerHTML = `
      ${s.name} | ${s.codeA} - ${s.codeB}
      <button onclick="toggleStudent(${i})">
        ${s.active ? "إيقاف" : "تفعيل"}
      </button>
    `;
    list.appendChild(div);
  });
}

function toggleStudent(i){
  students[i].active = !students[i].active;
  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
}

// ================== LESSONS ==================

document.getElementById("addLessonBtn").onclick = ()=>{
  const title = document.getElementById("lessonTitle").value.trim();
  const yt = document.getElementById("lessonYouTube").value.trim();
  if(!title || !yt) return alert("بيانات ناقصة");

  lessons.push({title, yt});
  localStorage.setItem("lessons", JSON.stringify(lessons));
  renderLessonsTeacher();

  document.getElementById("lessonTitle").value="";
  document.getElementById("lessonYouTube").value="";
};

function renderLessonsTeacher(){
  const list = document.getElementById("lessonsListTeacher");
  list.innerHTML="";
  lessons.forEach((l,i)=>{
    const div = document.createElement("div");
    div.innerHTML = `${l.title} <button onclick="deleteLesson(${i})">حذف</button>`;
    list.appendChild(div);
  });
}

function deleteLesson(i){
  lessons.splice(i,1);
  localStorage.setItem("lessons", JSON.stringify(lessons));
  renderLessonsTeacher();
}

function renderLessons(){
  const box = document.getElementById("lessonsList");
  box.innerHTML="";
  lessons.forEach(l=>{
    const btn = document.createElement("button");
    btn.className="lessonBtn";
    btn.innerText=l.title;
    btn.onclick=()=>{
      document.getElementById("lessonVideo").innerHTML =
        `<iframe src="${l.yt}" allowfullscreen></iframe>`;
    };
    box.appendChild(btn);
  });
}

// ================== LEADERBOARD ==================

function renderLeaderboard(){
  const box = document.getElementById("leaderboardContainer");
  box.innerHTML="";
  students.forEach((s,i)=>{
    const div = document.createElement("div");
    div.innerText = `${i+1}. ${s.name}`;
    box.appendChild(div);
  });
}

// ================== STUDENT NAV ==================

document.getElementById("showLessonsBtn").onclick = ()=>{
  document.getElementById("lessonsContainer").classList.remove("hidden");
  document.getElementById("leaderboardContainer").classList.add("hidden");
};

document.getElementById("showLeaderboardBtn").onclick = ()=>{
  document.getElementById("leaderboardContainer").classList.remove("hidden");
  document.getElementById("lessonsContainer").classList.add("hidden");
};
