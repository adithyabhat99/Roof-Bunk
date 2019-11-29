let image_upload_header={
    "x-access-token":token  
}
var n=0;
const stars=["ONE","TWO","THREE","FOUR","FIVE"]
document.addEventListener("DOMContentLoaded",()=>{
    loadImages();
    loadReviews();
    fetch(host+"/api/pg/avg_rating",{
        method:"GET",
        headers:basicHeader
    })
    .then(r=>r.json())
    .then(data=>{
        if(data.hasOwnProperty("error"))
        {
            console.log(data);
            return;
        }
        document.querySelector(".avg").innerText=data[0]["avg(rating)"];
        document.querySelector(".avg").innerHTML+="<small>/ 5</small>";
        let i=0;
        for(;i<data[0]["avg(rating)"];i++)
        {
            document.querySelector("."+stars[i]).className+="btn btn-warning btn-sm";
        }
        while(i<5)
        {
            document.querySelector("."+stars[i]).className+="btn btn-default btn-grey btn-sm";
            i++;
        }
    });

    document.querySelector(".Upload").addEventListener("click",event=>{
        event.preventDefault();
        if (document.querySelector(".file_upload").files.length == 0) 
        {
            alert("Select a file");
            return;
        }
        let Image = document.querySelector(".file_upload").files[0];
        let form = new FormData();
        form.append("file", Image);
        fetch(host+"/api/pg/picture", {
            method: "POST",
            headers: image_upload_header,
            body: form
          })
            .then(response => response.json())
            .then(data => {
                let parent=document.querySelector(".pictures");
                if (data.hasOwnProperty("error")) {
                    alert(data["error"]);
                    return;
                }
                alert("Success!");
                let column=document.createElement("div");
                column.className="column";
                let I=document.createElement("img");
                I.src=URL.createObjectURL(Image);
                column.appendChild(I);
                parent.appendChild(column);
            })
            .catch(error => {
              return;
            });
    });
    document.querySelector(".pictures").addEventListener("dblclick",event=>{
        let filename=event.target.getAttribute("filename");
        if(!filename)
            return;
        let t=confirm("Are you sure?");
        if(t==true)
        {
            fetch(host+"/api/pg/picture",{
                method:"DELETE",
                headers:basicHeader,
                body:JSON.stringify({"filename":filename})
            })
            .then(r=>r.json())
            .then(d=>{
                if(d.hasOwnProperty("error"))
                {
                    alert("Error occured");
                    console.log(d);
                    return;
                }
                alert("Success!, Changes will be seen after refresh");
            })
        }
    });

    document.querySelector(".review-block").addEventListener("click",event=>{
        let t=event.target;
        if(t.className=="username")
        {
            let id=t.getAttribute("uid");
            location.href=`../messaging/index.html?type1=pg&sid=${id}`;
        }
    });

});
function loadImages()
{
    fetch(host+"/api/pg/pictures",{
        method:"GET",
        headers:basicHeader
    })
    .then(r=>r.json())
    .then(d=>{
        if(d.hasOwnProperty("error"))
        {
            console.log(d);
            return;
        }
        let parent=document.querySelector(".pictures");
        for(i=0;i<d.length;i++)
        {
            let filename=d[i]["photo"];
            fetch(host+"/api/pg/picture",{
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
  let response = await fetch(host+`/api/pg/student_picture`,{
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

    fetch(host+"/api/pg/reviews",{
        method:"GET",
        headers:basicHeader
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