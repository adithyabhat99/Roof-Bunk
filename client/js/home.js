let host="http://localhost:6900";
let token=window.localStorage.getItem("student_token");
if(!token)
{
    location.href="../login/student.html";
}
let basicHeader={
    "Content-Type":"application/json",
    "x-access-token":token
};
var num=0;
document.addEventListener("DOMContentLoaded",()=>{
    home();
    document.querySelector(".pg_search_button").addEventListener("click",event=>{
        event.preventDefault();
        search();
    });
});

function home()
{
    navigator.geolocation.getCurrentPosition((position)=>{
        lat=position.coords.latitude.toFixed(6);
        lng=position.coords.longitude.toFixed(6);
        let gender="M"
        let data={
            lat,
            lng,
            gender,
            num
        };
        fetch(host+"/api/student/home",{
            method:"POST",
            headers:basicHeader,
            body:JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(d=>{
            if(d.hasOwnProperty("error"))
            {
                alert(d["error"]);
                return;
            }
            for(i=0;i<d.length;i++)
            {
                let box=document.createElement("div");
                box.id="box5";
                box.className="border-box";
                box.setAttribute("lat",d[i]["lat"]);
                box.setAttribute("lng",d[i]["lng"]);
                box.setAttribute("pgid",d[i]["PGID"]);
                let h2=document.createElement("h2");
                h2.className="pg_name";
                h2.innerText=d[i]["Pg_name"];
                let h1=document.createElement("h1");
                h1.className="pg_gender";
                h1.innerText=(d[i]["Gender"]=="M")?"Male":"Female";
                let h11=document.createElement("h1");
                h11.className="pg_distance";
                h11.innerText=(parseFloat(d[i]["distance"]).toFixed(1)).toString()+"km";
                let button=document.createElement("button");
                button.className="pg_details_button";
                button.innerText="See details";
                let a=[]
                let b=["one","two","three","four","five"];
                let pgid=d[i]["PGID"];
                fetch(host+"/api/student/pg_picture_1",{
                    method:"POST",
                    headers:basicHeader,
                    body:JSON.stringify({"pgid":d[i]["PGID"]})
                })
                .then(res=>res.blob())
                .then(image=>{
                    let Image=document.createElement("img");
                    Image.className="pg_image";
                    Image.src=URL.createObjectURL(image);
                    fetch(host+"/api/student/avg_rating",{
                        method:"POST",
                        headers:basicHeader,
                        body:JSON.stringify({"pgid":pgid})
                    })
                    .then(res=>res.json())
                    .then(r=>{
                        let rating=r["rating"];
                        box.appendChild(Image);
                        box.appendChild(h2);
                        box.appendChild(h1);
                        box.appendChild(h11);
                        for(j=0;j<5;j++)
                        {
                            a[j]=document.createElement("span");
                            a[j].className="fa fa-star "+b[j];
                            if(rating!=null && j<rating-1)
                                a[j].className+=" checked";
                            box.appendChild(a[j]);
                        }
                        let parent=document.querySelector("#parent");
                        box.appendChild(button);
                        parent.appendChild(box);
                    });
                });
            }
        });
    });
}
function search()
{
    let p=document.querySelector("#parent");
    while(p.lastElementChild)
    {
        p.removeChild(p.lastElementChild);
    }
    document.getElementById("text_pg").innerText="Search Results";
    let g1=document.querySelector(".g1").checked;
    let g2=document.querySelector(".g2").checked;
    let pgname=document.querySelector(".pg_name_search").value;
    let distance=document.querySelector(".pg_distance_search").value;
    if(!g1 && !g2)
    {
        alert("Chose Male or Female");
        return;
    }
    if(!pgname || !distance)
    {
        alert("Enter PG Name and Distance");
        return;
    }
    let gender=(g1)?"M":"F";
    navigator.geolocation.getCurrentPosition((position)=>{
        lat=position.coords.latitude.toFixed(6);
        lng=position.coords.longitude.toFixed(6);
        let data={
            lat,
            lng,
            gender,
            num,
            distance,
            name:pgname
        };
        fetch(host+"/api/student/search",{
            method:"POST",
            headers:basicHeader,
            body:JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(d=>{
            if(d.hasOwnProperty("error"))
            {
                alert(d["error"]);
                return;
            }
            for(i=0;i<d.length;i++)
            {
                let box=document.createElement("div");
                box.id="box5";
                box.className="border-box";
                box.setAttribute("lat",d[i]["lat"]);
                box.setAttribute("lng",d[i]["lng"]);
                box.setAttribute("pgid",d[i]["PGID"]);
                let h2=document.createElement("h2");
                h2.className="pg_name";
                h2.innerText=d[i]["Pg_name"];
                let h1=document.createElement("h1");
                h1.className="pg_gender";
                h1.innerText=(d[i]["Gender"]=="M")?"Male":"Female";
                let h11=document.createElement("h1");
                h11.className="pg_distance";
                h11.innerText=(parseFloat(d[i]["distance"]).toFixed(1)).toString()+"km";
                let button=document.createElement("button");
                button.className="pg_details_button";
                button.innerText="See details";
                let a=[]
                let b=["one","two","three","four","five"];
                let pgid=d[i]["PGID"];
                fetch(host+"/api/student/pg_picture_1",{
                    method:"POST",
                    headers:basicHeader,
                    body:JSON.stringify({"pgid":d[i]["PGID"]})
                })
                .then(res=>res.blob())
                .then(image=>{
                    let Image=document.createElement("img");
                    Image.className="pg_image";
                    Image.src=URL.createObjectURL(image);
                    fetch(host+"/api/student/avg_rating",{
                        method:"POST",
                        headers:basicHeader,
                        body:JSON.stringify({"pgid":pgid})
                    })
                    .then(res=>res.json())
                    .then(r=>{
                        let rating=r["rating"];
                        box.appendChild(Image);
                        box.appendChild(h2);
                        box.appendChild(h1);
                        box.appendChild(h11);
                        for(j=0;j<5;j++)
                        {
                            a[j]=document.createElement("span");
                            a[j].className="fa fa-star "+b[j];
                            if(rating!=null && j<rating-1)
                                a[j].className+=" checked";
                            box.appendChild(a[j]);
                        }
                        let parent=document.querySelector("#parent");
                        box.appendChild(button);
                        parent.appendChild(box);
                    });
                });
            }
        });
    });
}