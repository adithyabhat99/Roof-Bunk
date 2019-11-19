let url = new URL(location.href);
let type = url.searchParams.get("type");
let sid = url.searchParams.get("sid");
let token;
let host = "http://localhost:6900";
if (type == "student") {
    token = window.localStorage.getItem("student_token");
    host += "/api/student";
} else if (type == "pg") {
    token = window.localStorage.getItem("pg_token");
    host += "/api/pg";
} else {
    location.href = "../login/2options.html";
}
let basicHeader = {
    "Content-Type": "application/json",
    "x-access-token": token
};
document.addEventListener("DOMContentLoaded", () => {
    let Type=(type=="student")?"pg":"student";
    fetch(`http://localhost:6900/api/name?type=${Type}&id=${sid}`)
    .then(res=>res.json())
    .then(d=>{
        if(d.hasOwnProperty("error"))
        {
            return;
        }
        document.querySelector(".sender_name").innerText=d["name"];
    });
    fetch_image();
    fetch_all();
    if(type=="pg")
    {
        document.querySelector(".info").style.display="none";
    }
    document.querySelector(".sendButton").addEventListener("click",event=>{
        let message=document.querySelector(".typedMessage").value;
        let parent=document.querySelector(".msg-page");
        if(message=="")
        {
            return;
        }
        if(type!="student")
        {
            fetch(host+"/message",{
                method:"POST",
                headers:basicHeader,
                body:JSON.stringify({"uid":sid,"message":message})
            })
            .then(res=>res.json())
            .then(d=>{
                if(d.hasOwnProperty("error"))
                {
                    console.log(d);
                    return;
                }
                rc=document.createElement("div");
                rc.className="outgoing-chats";
                rm=document.createElement("div");
                rm.className="outgoing-chats-msg";
                rmi=document.createElement("div");
                rmi.className="outgoing-msg-inbox";
                p=document.createElement("p");
                p.className="m";
                p.innerText=message;
                t=document.createElement("span");
                t.className="time";
                let dateObj = new Date();
                let month = dateObj.getUTCMonth() + 1;
                let day = dateObj.getUTCDate();
                let year = dateObj.getUTCFullYear();
                let newdate = year + "/" + month + "/" + day;
                let h=dateObj.getHours();
                let m=dateObj.getMinutes();
                let T=h+":"+m;
                t.innerText=newdate;
                t.innerText+="\n"+T;
                rmi.appendChild(p);
                rmi.appendChild(t);
                rm.appendChild(rmi);
                rc.appendChild(rm)
                parent.appendChild(rc);
            });
        }
        else
        {
            fetch(host+"/message",{
                method:"POST",
                headers:basicHeader,
                body:JSON.stringify({"pgid":sid,"message":message})
            })
            .then(res=>res.json())
            .then(d=>{
                if(d.hasOwnProperty("error"))
                {
                    console.log(d);
                    return;
                }
                rc=document.createElement("div");
                rc.className="outgoing-chats";
                rm=document.createElement("div");
                rm.className="outgoing-chats-msg";
                rmi=document.createElement("div");
                rmi.className="outgoing-msg-inbox";
                p=document.createElement("p");
                p.className="m";
                p.innerText=message;
                t=document.createElement("span");
                t.className="time";
                let dateObj = new Date();
                let month = dateObj.getUTCMonth() + 1;
                let day = dateObj.getUTCDate();
                let year = dateObj.getUTCFullYear();
                let newdate = year + "/" + month + "/" + day;
                let h=dateObj.getHours();
                let m=dateObj.getMinutes();
                let T=h+":"+m;
                t.innerText=newdate;
                t.innerText+="\n"+T;
                rmi.appendChild(p);
                rmi.appendChild(t);
                rm.appendChild(rmi);
                rc.appendChild(rm)
                parent.appendChild(rc);
            });
        }
        document.querySelector(".typedMessage").value="";
    });
});

function fetch_all() {
    let parent=document.querySelector(".msg-page");
    while(parent.firstChild)
    {
        parent.removeChild(parent.firstChild);
    }
    fetch(host + "/message", {
            method: "PUT",
            headers: basicHeader,
            body: JSON.stringify({ "sid": sid })
        })
        .then(res => res.json())
        .then(data => {
            if (data.hasOwnProperty("error")) {
                console.log(data);
                return;
            }
            let messages = data["messages"];
            for (i = messages.length-1;i>=0;i--)
            {
                let rc,rm,rmi,p,t;
                if(messages[i]["reciever_id"]!=sid)
                {
                    rc=document.createElement("div");
                    rc.className="recieved-chats";
                    rm=document.createElement("div");
                    rm.className="recieved-msg";
                    rmi=document.createElement("div");
                    rmi.className="recieved-msg-inbox";
                    p=document.createElement("p");
                    p.className="m";
                    p.innerText=messages[i]["message"];
                    t=document.createElement("span");
                    t.className="time";
                    let dateObj = new Date(messages[i]["mdate"]);
                    let month = dateObj.getUTCMonth() + 1;
                    let day = dateObj.getUTCDate();
                    let year = dateObj.getUTCFullYear();
                    let newdate = year + "/" + month + "/" + day;
                    let h=dateObj.getHours();
                    let m=dateObj.getMinutes();
                    let T=h+":"+m;
                    t.innerText=newdate;
                    t.innerText+="\n"+T;
                    rmi.appendChild(p);
                    rmi.appendChild(t);
                    rm.appendChild(rmi);
                    rc.appendChild(rm)
                    parent.appendChild(rc);
                }
                else
                {
                    rc=document.createElement("div");
                    rc.className="outgoing-chats";
                    rm=document.createElement("div");
                    rm.className="outgoing-chats-msg";
                    rmi=document.createElement("div");
                    rmi.className="outgoing-msg-inbox";
                    p=document.createElement("p");
                    p.className="m";
                    p.innerText=messages[i]["message"];
                    t=document.createElement("span");
                    t.className="time";
                    let dateObj = new Date(messages[i]["mdate"]);
                    let month = dateObj.getUTCMonth() + 1;
                    let day = dateObj.getUTCDate();
                    let year = dateObj.getUTCFullYear();
                    let newdate = year + "/" + month + "/" + day;
                    let h=dateObj.getHours();
                    let m=dateObj.getMinutes();
                    let T=h+":"+m;
                    t.innerText=newdate;
                    t.innerText+="\n"+T;
                    rmi.appendChild(p);
                    rmi.appendChild(t);
                    rm.appendChild(rmi);
                    rc.appendChild(rm)
                    parent.appendChild(rc);
                }
                parent.appendChild(document.createElement("br"));
            }
        });
}
function fetch_image()
{
    if(type=="student")
    {
        fetch(host+"/pg_picture_1",{
            method:"POST",
            headers:basicHeader,
            body:JSON.stringify({"pgid":sid})
        })
        .then(res=>res.blob())
        .then(i=>{
            document.querySelector(".sender_pic").src=URL.createObjectURL(i);
        })
    }
    else
    {
        fetch(host+"/student_picture",{
            method:"PUT",
            headers:basicHeader,
            body:JSON.stringify({"uid":sid})
        })
        .then(res=>res.blob())
        .then(i=>{
            document.querySelector(".sender_pic").src=URL.createObjectURL(i);
        })
    }
}