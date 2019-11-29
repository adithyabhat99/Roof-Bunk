document.addEventListener("DOMContentLoaded",()=>{
    fetch_all();
    fetch_rooms();
    document.querySelector(".update_button").addEventListener("click",(event)=>{
        event.preventDefault();
        data={};
        let name=document.querySelector("#name").value;
        let pgname=document.querySelector("#pg_name").value;
        let email=document.querySelector("#email").value;
        let desc=document.querySelector("#desc").value;
        let password=document.querySelector("#password").value;
        let laundry=(document.querySelector("#laundry").value=="Yes")?1:0;
        let meal=(document.querySelector("#meal").value=="Yes")?1:0;
        let wifi=(document.querySelector("#wifi").value=="Yes")?1:0;
        let maid=(document.querySelector("#maid").value=="Yes")?1:0;
        let bathroom=(document.querySelector("#bathroom").value=="Yes")?1:0;
        let students_preffered=(document.querySelector("#stud").value=="Yes")?1:0;
        let gender=(document.querySelector("#gender").value=="M")?"M":"F";
        data["laundry"]=laundry;
        data["wifi"]=wifi;
        data["meal"]=meal;
        data["maid"]=maid;
        data["bathroom"]=bathroom;
        data["gender"]=gender;
        data["students_preffered"]=students_preffered;
        if(name)
        {
            data["ownername"]=name;
        }
        if(pgname)
        {
            data["pgname"]=pgname;
        }
        if(desc)
        {
            data["desc"]=desc;
        }
        if(email)
        {
            data["email"]=email;
        }
        if(password)
        {
            let email2=prompt("Please enter Email","");
            if(!email2)
            {
                alert("Enter email");
                return;
            }
            reset_password(email2,password);
        }
        else
        {
            fetch(host+"/api/pg/account",{
                method:"PUT",
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
                if(email)
                {
                    otp_handler(email);
                }
                alert("Success!");
            });
        }
    });
    document.querySelector(".add-room").addEventListener("click",event=>{
        event.preventDefault();
        let type1=document.querySelector(".n-type").value;
        let empty1=document.querySelector(".n-empty").value;
        let price=document.querySelector(".n-price").value;
        fetch(host+"/api/pg/rooms",{
            method:"POST",
            headers:basicHeader,
            body:JSON.stringify({type1,empty1,price})
        })
        .then(r=>r.json())
        .then(d=>{
            if(d.hasOwnProperty("error"))
            {
                console.log(d);
                return;
            }
            let parent=document.querySelector(".rooms");
            let rr=document.createElement("div");
            rr.className="rooms-row";
            let h4=document.createElement("h4");
            h4.className="type";
            h4.innerText=type1
            let empty=document.createElement("input");
            empty.className="empty";
            empty.type1="text";
            empty.placeholder=empty1
            let price1=document.createElement("input");
            price1.className="price";
            price1.type1="text";
            price1.placeholder=price;
            let button=document.createElement("button");
            button.className="change-room";
            button.innerText="Change";
            rr.appendChild(h4);
            rr.appendChild(empty);
            rr.appendChild(price1);
            rr.appendChild(button);
            parent.insertBefore(rr,parent.secondChild);
        });
    });
    document.querySelector(".rooms").addEventListener("click",event=>{
        event.preventDefault();
        if(event.target.className=="change-room")
        {
            let p=event.target.parentNode;
            let t=p.children[0].innerText;
            let e=p.children[1].value;
            let pr=p.children[2].value;
            if(!t || !e || !pr)
            {
                alert("Enter all fields");
                return;
            }
            fetch(host+"/api/pg/rooms",{
                method:"PUT",
                headers:basicHeader,
                body:JSON.stringify({"type1":t,"empty1":e,"price":pr})
            })
            .then(r=>r.json())
            .then(d=>{
                if(d.hasOwnProperty("error"))
                {
                    console.log(d["error"]);
                    alert(d["error"]);
                }
            });
        }
    });
    document.querySelector(".loc_button").addEventListener("click",event=>{
        event.preventDefault();
        navigator.geolocation.getCurrentPosition((position)=>{
            let lat=position.coords.latitude;
            let lng=position.coords.longitude;
            fetch(host+"/api/pg/account",{
                method:"PUT",
                headers:basicHeader,
                body:JSON.stringify({lat,lng})
            })
            .then(r=>r.json())
            .then(d=>{
                if(d.hasOwnProperty("error"))
                {
                    alert("Error occured");
                    return;
                }
                document.querySelector(".lat").innerText="Latitude:"+lat;
                document.querySelector(".lng").innerText="Longitude:"+lng;
                alert("Success");
            });
        });
    });
    document.querySelector(".delete_button").addEventListener("click",event=>{
        event.preventDefault();
        let t=confirm("Are you sure?");
        if(t==false)
            return;
        fetch(host+"/api/pg/account",{
            method:"DELETE",
            headers:basicHeader
        })
        .then(r=>r.json())
        .then(d=>{
            if(d.hasOwnProperty("error"))
            {
                alert("Error");
                console.log(d);
                return;
            }
            window.localStorage.removeItem("pg_token");
            location.href="../login/2options.html";
        });
    });
    document.querySelector(".logout_button").addEventListener("click",event=>{
        event.preventDefault();
        window.localStorage.removeItem("pg_token");
        location.href="../login/2options.html";
    });
});
function otp_handler(email)
{
    let otp=prompt("Please enter OTP to change email","");
    if(!otp)
    {
        alert("Enter OTP");
        return;
    }
    let data={
        email,
        otp
    }
    fetch(host+"/api/pg/verify/email",{
        method:"POST",
        headers:basicHeader,
        body:JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(d=>{
            if(d.hasOwnProperty("error"))
            {
                alert(d["error verifying email"]);
                return;
            }
            window.localStorage.setItem("pg_token",d["token"]);
            window.localStorage.setItem("uid",d["uid"]);
            alert("Email verified")
        });
}
function reset_password(email,password)
{
    Data={
        username:email
    };
    fetch(host+"/api/pg/reset/password",{
        method:"PUT",
        headers:basicHeader,
        body:JSON.stringify(Data)
    })
    .then(res=>res.json())
    .then(d=>{
        if(d.hasOwnProperty("error"))
        {
            alert(d["error"]);
            return;
        }
        let otp=prompt("Please enter OTP to change password","");
        if(!otp)
        {
            alert("Enter OTP");
            return;
        }
        let data={
            username:email,
            otp,
            password
        }
        fetch(host+"/api/pg/reset/password",{
           method:"POST",
           headers:{"Content-Type":"application/json"},
           body:JSON.stringify(data)
        })
        .then(res2=>res2.json())
        .then(d2=>{
            if(d2.hasOwnProperty("error"))
            {
                alert(d2["error"]);
                return;
            }
            alert("Password reset success");
        })
    }) 
}

function fetch_all()
{
    fetch(host+"/api/pg/account",{
        method:"GET",
        headers:basicHeader
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.hasOwnProperty("error"))
        {
            alert("Error");
            return;
        }
        data=data["details"];
        document.getElementById("name").placeholder=data["Owner_name"];
        document.getElementById("pg_name").placeholder=data["Pg_name"];
        document.getElementById("email").placeholder=data["Email"];
        document.getElementById("desc").placeholder=(data["Description"])?data["Description"]:"";
        document.querySelector("#laundry").value=(data["Laundry"])?"Yes":"No";
        document.querySelector("#meal").value=(data["Meals"])?"Yes":"No";
        document.querySelector("#wifi").value=(data["Wifi"])?"Yes":"No";
        document.querySelector("#maid").value=(data["Maid"])?"Yes":"No";
        document.querySelector("#bathroom").value=(data["Bathroom"])?"Yes":"No";
        document.querySelector("#stud").value=(data["students_preffered"])?"Yes":"No";
        document.querySelector("#gender").value=data["Gender"];
        document.querySelector(".lat").innerText="Latitude:"+data["lat"];
        document.querySelector(".lng").innerText="Longitude:"+data["lng"];
    });
}
function fetch_rooms()
{
    fetch(host+"/api/pg/rooms",
    {
        method:"GET",
        headers:basicHeader
    })
    .then(r=>r.json())
    .then(d=>{
        d=d["rooms"];
        let parent=document.querySelector(".rooms");
        parent.insertBefore(document.createElement("br"),parent.secondChild);
        for(i=0;i<d.length;i++)
        {
            let rr=document.createElement("div");
            rr.className="rooms-row";
            let h4=document.createElement("h4");
            h4.className="type1";
            h4.innerText=d[i]["Type1"];
            let empty1=document.createElement("input");
            empty1.className="empty1";
            empty1.type1="text";
            empty1.placeholder=d[i]["Empty1"];
            let price=document.createElement("input");
            price.className="price";
            price.type1="text";
            price.placeholder=d[i]["Price"];
            let button=document.createElement("button");
            button.className="change-room";
            button.innerText="Change";
            rr.appendChild(h4);
            rr.appendChild(empty1);
            rr.appendChild(price);
            rr.appendChild(button);
            parent.insertBefore(rr,parent.secondChild);
        }
    });
}