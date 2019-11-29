var M=0;
var N=0;
var T=0;
document.addEventListener("DOMContentLoaded",()=>{
    document.querySelector(".notifications").addEventListener("click",event=>{
        let parent=document.querySelector(".nparent");
        document.querySelector(".clear_p").style.display="block";
        while(parent.childNodes.length>1 && parent.lastChild.className!="clear")
        {
            parent.removeChild(parent.lastChild);
        }
        if(N==1)
        {
            N=0;
            document.querySelector(".clear_p").style.display="none";
            return;
        }
        fetch(host+"/api/student/notifications",{
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
                let a=document.createElement("a");
                a.className="not";
                a.innerText=data[i]["message"];
                a.setAttribute("id",data[i]["id"]);
                li.appendChild(a);
                parent.appendChild(li);
            }
            N=1;
        });
    });
    document.querySelector(".clear").addEventListener("click",event=>{
        event.preventDefault();
        let parent=document.querySelector(".nparent");
        while(parent.childNodes.length>1 && parent.lastChild.className!="clear")
        {
            parent.removeChild(parent.lastChild);
        }
        fetch(host+"/api/student/notifications",{
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
        if(M==1)
        {
            M=0;
            return;
        }
        fetch(host+"/api/student/messages",{
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
                let a=document.createElement("a");
                a.className="mes";
                a.innerText=data[i]["Pg_name"];
                a.setAttribute("pgid",data[i]["PGID"]);
                li.appendChild(a);
                parent.appendChild(li);
                M=1;
            }
        });
    });

    document.querySelector(".mparent").addEventListener("click",event=>{
        if(event.target.className=="mes")
        {
            let pgid=event.target.getAttribute("pgid");
            location.href=`../messaging/index.html?type1=student&sid=${pgid}`;
        }
    });
    document.querySelector(".tparent").addEventListener("click",event=>{
        if(event.target.className=="tes")
        {
            let pgid=event.target.getAttribute("pgid");
            location.href=`../pg/pg_details.html?pgid=${pgid}&distance=6`;
        }
    });
    document.querySelector(".Top_Rated").addEventListener("click",event=>{
        let parent=document.querySelector(".tparent");
        while(parent.childNodes.length>0)
        {
            parent.removeChild(parent.lastChild);
        }
        if(T==1)
        {
            T=0;
            return;
        }
        fetch(host+"/api/student/top_rated",{
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
            data=data["top_rated"];
            for(i=0;i<data.length;i++)
            {
                let li=document.createElement("li");
                let a=document.createElement("a");
                a.className="tes";
                a.innerText=data[i]["Pg_name"];
                a.setAttribute("pgid",data[i]["PGID"]);
                li.appendChild(a);
                parent.appendChild(li);
                T=1;
            }
        });
    });
});