const supabase = window.supabase.createClient("https://hbaqxouzgiuqtahocngc.supabase.co","sb_publishable_vkAklnJNIuU4gj7suM_WzA_MbjGvFy0");

let tickets = [];

async function load(){
    let { data } = await supabase.from("tickets").select("*");
    tickets = data || [];
    render();
}

function render(data=tickets){
    let table = document.getElementById("table");
    if(!table) return;

    table.innerHTML="";

    let open=0, progress=0, closed=0;

    data.forEach(t=>{
        if(t.status=="open") open++;
        if(t.status=="progress") progress++;
        if(t.status=="closed") closed++;

        table.innerHTML += `
        <tr>
        <td>${t.id}</td>
        <td>${t.subject}</td>
        <td>${t.priority}</td>
        <td>${t.status}</td>
        <td>
        <button onclick="updateStatus(${t.id},'${t.status}')">Update</button>
        <button onclick="del(${t.id})">Delete</button>
        </td>
        </tr>`;
    });

    open && (document.getElementById("open").innerText=open);
    progress && (document.getElementById("progress").innerText=progress);
    closed && (document.getElementById("closed").innerText=closed);

    chart(open,progress,closed);
}

function chart(o,p,c){
    new Chart(document.getElementById("chart"),{
        type:"doughnut",
        data:{
            labels:["Open","Progress","Closed"],
            datasets:[{data:[o,p,c]}]
        }
    });
}

async function add(){
    await supabase.from("tickets").insert([
        {subject:subject.value,priority:priority.value,status:"open"}
    ]);
    alert("Added");
}

async function updateStatus(id,status){
    let newStatus = status=="open"?"progress":
                    status=="progress"?"closed":"closed";

    await supabase.from("tickets")
    .update({status:newStatus})
    .eq("id",id);

    load();
}

async function del(id){
    await supabase.from("tickets").delete().eq("id",id);
    load();
}

function search(){
    let val = document.getElementById("search").value.toLowerCase();
    render(tickets.filter(t=>t.subject.toLowerCase().includes(val)));
}

async function logout(){
    await supabase.auth.signOut();
    window.location="login.html";
}

load();