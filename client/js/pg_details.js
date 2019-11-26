let host="http://localhost:6900";
let token=window.localStorage.getItem("student_token");
const U=new URL(location.href);
const PGID=U.searchParams.get("pgid");
let dis=U.searchParams.get("distance");
let Rating=3;
if(!dis)
    dis=10;
if(!PGID)
{
    location.href="../an-ad-deek/index.html";
}
if(!token)
{
    location.href="../login/student.html";
}
let basicHeader={
    "Content-Type":"application/json",
    "x-access-token":token
};
let image_upload_header={
    "x-access-token":token  
}
var n=0;
const stars=["ONE","TWO","THREE","FOUR","FIVE"];
const stars1=["ONE1","TWO2","THREE3","FOUR4","FIVE5"];
document.addEventListener("DOMContentLoaded",()=>{
    loadDetails();
    loadImages();
    loadRooms();
    loadReviews();
    fetch(host+"/api/student/avg_rating",{
        method:"POST",
        headers:basicHeader,
        body:JSON.stringify({"pgid":PGID})
    })
    .then(r=>r.json())
    .then(data=>{
        if(data.hasOwnProperty("error"))
        {
            console.log(data);
            return;
        }
        document.querySelector(".avg").innerText=data["rating"];
        document.querySelector(".avg").innerHTML+="<small>/ 5</small>";
        let i=0;
        for(;i<data["rating"]-1;i++)
        {
            document.querySelector("."+stars[i]).className+=" btn btn-warning btn-sm";
        }
        while(i<5)
        {
            document.querySelector("."+stars[i]).className+=" btn btn-default btn-grey btn-sm";
            i++;
        }
    });
    document.querySelector(".locate").addEventListener("click",event=>{
        let lat=event.target.getAttribute("lat");
        let lng=event.target.getAttribute("lng");
        location.href=`https://maps.google.com?q=${lat},${lng}`;
    }); 
    document.querySelector(".chat").addEventListener("click",event=>{
        event.preventDefault();
        location.href=`../messaging/index.html?type=student&sid=${PGID}`;
    }); 
    document.querySelector(".Stars").addEventListener("click",event=>{
        let c=event.target.className;
        let x=c.split(" ");
        c=x[0];
        let i=stars1.indexOf(c);
        if(i!=-1)
        {
            Rating=i+1;
            let j=0;
            for(;j<=i;j++)
            {
                document.querySelector("."+stars1[j]).className=stars1[j]+" btn btn-warning btn-sm"
            }
            while(j<5)
            {
                document.querySelector("."+stars1[j]).className=stars1[j]+" btn btn-default btn-grey btn-sm";
                j++;
            }
        }
    });
    document.querySelector(".submit_review").addEventListener("click",event=>{
        event.preventDefault();
        reviewed=document.querySelector(".write-review").getAttribute("reviewed");
        if(reviewed=="false")
        {
            post_review("POST");
        }
        else
        {
            post_review("PUT");
        }
    });
});
function loadImages()
{
    fetch(host+"/api/student/pg_pictures",{
        method:"PUT",
        headers:basicHeader,
        body:JSON.stringify({"pgid":PGID})
    })
    .then(r=>r.json())
    .then(d=>{
        if(d.hasOwnProperty("error"))
        {
            console.log(d);
            return;
        }
        d=d["pictures"];
        let parent=document.querySelector(".pictures");
        for(i=0;i<d.length;i++)
        {
            let filename=d[i]["Photo"];
            fetch(host+"/api/student/pg_picture",{
                method:"PUT",
                body:JSON.stringify({"filename":filename}),
                headers:basicHeader
            })
            .then(r=>r.blob())
            .then(image=>{
                let column=document.createElement("div");
                column.className="column";
                let I=document.createElement("img");
                I.src=URL.createObjectURL(image);
                I.setAttribute("filename",filename)
                column.appendChild(I);
                parent.appendChild(column);
            });
        }
    })
}
async function getImageAsync(uid) 
{
  let response = await fetch(host+`/api/student/student_picture`,{
      method:"PUT",
      headers:basicHeader,
      body:JSON.stringify({"uid":uid})
  });
  let data = await response.blob()
  return data;
}
function loadReviews()
{
    let parent=document.querySelector(".review-block");

    fetch(host+"/api/student/reviews",{
        method:"PUT",
        headers:basicHeader,
        body:JSON.stringify({"pgid":PGID})
    })
    .then(r=>r.json())
    .then(d=>{
        if(d.hasOwnProperty("error"))
        {
            console.log(d);
            return;
        }
        for(j=0;j<d.length;j++)
        {
            let uid=d[j]["UID"];
            let row=document.createElement("div");
            row.className="row";
            let col3=document.createElement("div");
            col3.className="col-sm-3";
            let img=document.createElement("img");
            img.className="img-rounded";
            getImageAsync(uid)
            .then(Image=>{
                img.src=URL.createObjectURL(Image);
            });
            let rbn=document.createElement("div");
            rbn.className="review-block-name";
            let h2=document.createElement("h2");
            h2.className="username";
            h2.setAttribute("uid",d[j]["UID"]);
            h2.innerText=d[j]["Name"];
            let rbd=document.createElement("div");
            rbd.className="review-block-date";
            let dateObj = new Date(d[j]["rdate"]);
            let month = dateObj.getUTCMonth() + 1;
            let day = dateObj.getUTCDate();
            let year = dateObj.getUTCFullYear();
            let newdate = year + "/" + month + "/" + day;
            let h=dateObj.getHours();
            let m=dateObj.getMinutes();
            let T=h+":"+m;
            rbd.innerText=newdate;
            rbd.innerText+="\n"+T;
            let col9=document.createElement("div");
            col9.className="col-sm-9";
            let rbr=document.createElement("div");
            rbr.className="review-block-rate";
            for(i=0;i<5;i++)
            {
                let button=document.createElement("button");
                button.className=stars[i];
                if(i<=d[j]["rating"]-1)
                {
                    button.className+="btn btn-warning btn-sm";
                }
                else
                {
                    button.className+="btn btn-default btn-grey btn-sm";
                }
                button.setAttribute("aria-label","Left Align");
                let span=document.createElement("span");
                span.className="glyphicon glyphicon-star";
                span.setAttribute("aria-hidden",true);
                button.appendChild(span);
                rbr.appendChild(button);
            }
            let rbt=document.createElement("div");
            rbt.className="review-block-title";
            if(d[j]["rating"]>=3)
            {
                rbt.innerText="Positive Review";
            }
            else
            {
                rbt.innerText="Negative Review";
            }
            let rbde=document.createElement("div");
            rbde.className="review-block-description";
            rbde.innerText=d[j]["review"];
            col3.appendChild(img);
            rbn.appendChild(h2);
            col3.appendChild(rbn);
            col3.appendChild(rbd);
            col9.appendChild(rbr);
            col9.appendChild(rbt);
            col9.appendChild(rbde);
            row.appendChild(col3);
            row.appendChild(col9);
            parent.appendChild(row);
            parent.appendChild(document.createElement("hr"));
        } 
    });
}
function loadDetails()
{
    fetch(host+"/api/student/pg_details",{
        method:"PUT",
        headers:basicHeader,
        body:JSON.stringify({"pgid":PGID})
    })
    .then(r=>r.json())
    .then(d=>{
        d=d[0];
        document.querySelector(".pg_name").innerText=d["Pg_name"];
        document.querySelector(".pg_desc").innerText=d["Description"];
        document.querySelector(".pg_email").href="mailto: "+d["Email"];
        document.querySelector(".pg_email").innerText=d["Email"];
        document.querySelector(".dis").innerText=(parseFloat(dis).toFixed(1)).toString()+" kms away";
        document.querySelector(".locate").setAttribute("lat",d["lat"]);
        document.querySelector(".locate").setAttribute("lng",d["lng"]);
        let P=document.querySelector(".things");
        if(d["Bathroom"]==1)
        {
            let a=document.createElement("a")
            a.className="btn btn-info btn-lg";
            let sp=document.createElement("span");
            sp.className="glyphicon glyphicon-ok";
            a.innerText="Bathroom";
            a.appendChild(sp);
            P.appendChild(a);
        }
        if(d["Meals"]==1)
        {
            let a=document.createElement("a")
            a.className="btn btn-info btn-lg";
            let sp=document.createElement("span");
            sp.className="glyphicon glyphicon-ok";
            a.innerText="Meals";
            a.appendChild(sp);
            P.appendChild(a);
        }
        if(d["students_prefered"]==1)
        {   
            let a=document.createElement("a")
            a.className="btn btn-info btn-lg";
            let sp=document.createElement("span");
            sp.className="glyphicon glyphicon-ok";
            a.innerText="Students Only";
            a.appendChild(sp);
            P.appendChild(a);
        }
        if(d["Wifi"]==1)
        {
            let a=document.createElement("a")
            a.className="btn btn-info btn-lg";
            let sp=document.createElement("span");
            sp.className="glyphicon glyphicon-ok";
            a.innerText="Wifi";
            a.appendChild(sp);
            P.appendChild(a);
        }
        if(d["Laundry"]==1)
        {
            let a=document.createElement("a")
            a.className="btn btn-info btn-lg";
            let sp=document.createElement("span");
            sp.className="glyphicon glyphicon-ok";
            a.innerText="Laundry";
            a.appendChild(sp);
            P.appendChild(a);
        }
        if(d["Maid"]==1)
        {
            let a=document.createElement("a")
            a.className="btn btn-info btn-lg";
            let sp=document.createElement("span");
            sp.className="glyphicon glyphicon-ok";
            a.innerText="Maid";
            a.appendChild(sp);
            P.appendChild(a);
        }
    });



    fetch(host+"/api/student/my_review",{
        method:"PUT",
        headers:basicHeader,
        body:JSON.stringify({"pgid":PGID})
    })
    .then(r=>r.json())
    .then(d=>{
        if(d.hasOwnProperty("error"))
        {
            console.log(d);
            return;
        }
        d=d[0];
        if(!d)
        {
            document.querySelector(".write-review").setAttribute("reviewed",false);
            return;
        }
        document.querySelector(".review-text").placeholder=d["review"];
        i=0;
        for(;i<d["rating"];i++)
        {
            document.querySelector("."+stars1[i]).className+=" btn btn-warning btn-sm";
        }
        while(i<5)
        {
            document.querySelector("."+stars1[i]).className+=" btn btn-default btn-grey btn-sm";
            i++
        }
        document.querySelector(".write-review").setAttribute("reviewed",true);
    })
}

function loadRooms()
{
    fetch(host+"/api/student/rooms",{
        method:"PUT",
        headers:basicHeader,
        body:JSON.stringify({"pgid":PGID})
    })
    .then(r=>r.json())
    .then(d=>{
        if(d.hasOwnProperty("error"))
        {
            console.log(d);
            return;
        }
        d=d["rooms"];
        let parent=document.querySelector(".rooms");
        for(i=0;i<d.length;i++)
        {
            let rr=document.createElement("div");
            rr.className="rooms-row";
            let h4=document.createElement("h4");
            h4.className="type";
            h4.innerText=d[i]["Type"];
            let p1=document.createElement("p");
            p1.className="empty";
            p1.innerText=d[i]["Empty"];
            let p2=document.createElement("p");
            p2.className="price";
            p2.innerText=d[i]["Price"];
            rr.appendChild(h4);
            rr.appendChild(p1);
            rr.appendChild(p2);
            parent.appendChild(rr);
        }
    })
}

function post_review(method)
{
    let m=document.querySelector(".review-text").value;
    if(!m)
    {
        alert("Write review");
        return;
    }
    fetch(host+"/api/student/review",{
        method:method,
        headers:basicHeader,
        body:JSON.stringify({"pgid":PGID,"review":m,"rating":Rating})
    })
    .then(r=>r.json())
    .then(d=>{
        if(d.hasOwnProperty("error"))
        {
            alert("Error");
            console.log(d);
            return;
        }
        reviewed=document.querySelector(".write-review").setAttribute("reviewed",true);
        alert("Thank you for your review!");
    });
}