let host="http://localhost:6900";
let token=window.localStorage.getItem("pg_token");
if(!token)
{
    location.href="../login/pgowner.html";
}
let basicHeader={
    "Content-Type":"application/json",
    "x-access-token":token
};
document.addEventListener("DOMContentLoaded",()=>{
    document.querySelector(".notifications").addEventListener("click",event=>{
        let parent=document.querySelector(".nparent");
        while(parent.childNodes.length>1 && parent.lastChild.className!="clear")
        {
            parent.removeChild(parent.lastChild);
        }
        fetch(host+"/api/pg/notifications",{
            method:"GET",
            headers:basicHeader
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.hasOwnProperty("error"))
            {
                console.log(data);
                return;
            }
            for(i=0;i<data.length;i++)
            {
                let li=document.createElement("li");
                li.className="not";
                li.innerText=data[i]["message"];
                li.setAttribute("id",data[i]["id"]);
                parent.appendChild(li);
            }
        });
    });
    document.querySelector(".clear").addEventListener("click",event=>{
        event.preventDefault();
        let parent=document.querySelector(".nparent");
        while(parent.childNodes.length>1 && parent.lastChild.className!="clear")
        {
            parent.removeChild(parent.lastChild);
        }
        fetch(host+"/api/pg/notifications",{
            method:"PUT",
            headers:basicHeader
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.hasOwnProperty("error"))
            {
                console.log(data);
                return;
            }
        })
    });
    document.querySelector(".messages").addEventListener("click",event=>{
        let parent=document.querySelector(".mparent");
        while(parent.childNodes.length>0)
        {
            parent.removeChild(parent.lastChild);
        }
        fetch(host+"/api/pg/messages",{
            method:"GET",
            headers:basicHeader
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.hasOwnProperty("error"))
            {
                console.log(data);
                return;
            }
            for(i=0;i<data.length;i++)
            {
                let li=document.createElement("li");
                li.className="mes";
                li.innerText=data[i]["Name"];
                li.setAttribute("uid",data[i]["UID"]);
                parent.appendChild(li);
            }
        });
    });
    document.querySelector(".mparent").addEventListener("click",event=>{
        if(event.target.className=="mes")
        {
            let uid=event.target.getAttribute("uid");
            location.href=`../messaging/index.html?type=pg&sid=${uid}`;
        }
    });
});