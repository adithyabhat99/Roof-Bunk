let host="http://localhost:6900";
const basicHeader = {
    "Content-Type": "application/json"
  };
document.addEventListener("DOMContentLoaded",()=>{
    document.getElementById("submit_login").addEventListener("click",event=>{
        event.preventDefault();
        let username=document.getElementById("username_login").value;
        let password=document.getElementById("password_login").value;
        let data={
            username:username,
            password:password
        }
        fetch(host+"/api/pg/login",{
            method:"POST",
            headers:basicHeader,
            body:JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.hasOwnProperty("error"))
            {
                alert(data["error"]);
                return;
            }
            window.localStorage.setItem("pg_token",data["token"]);
            location.href="../pg/dashboard.html";
        })
    });
    document.getElementById("submit_register").addEventListener("click",event=>{
        event.preventDefault();
        let ownername=document.getElementById("ownername").value;
        let pgname=document.getElementById("pgname").value;
        let password=document.getElementById("password_register").value;
        let email=document.getElementById("email").value;
        let genders=document.getElementsByClassName("gender");
        let gender=""
        for(i=0;i<genders.length;i++)
        {
            if(genders[i].checked)
            {
                gender=genders[i].value;
                break;
            }
        }
        if(!pgname || !ownername || !password || !email || !gender)
        {
            alert("Enter remaining fields");
            return;
        }
        let lat="";
        let lng="";
        navigator.geolocation.getCurrentPosition((position)=>{
            lat=position.coords.latitude;
            lng=position.coords.longitude;
            let data={
                ownername,
                pgname,
                password,
                email,
                lat,
                lng,
                gender
            };
            console.log(gender);
            fetch(host+"/api/pg/account",{
                method:"POST",
                headers:basicHeader,
                body:JSON.stringify(data)
            })
            .then(res=>res.json())
            .then(data1=>{
                console.log(data1);
                if(data.hasOwnProperty("error"))
                {
                    alert(data["error"]);
                    return;
                }
                let otp=prompt("Please enter OTP","");
                if(!otp)
                {
                    alert("Enter OTP");
                    return;
                }
                let data2={
                    email,
                    otp
                }
                fetch(host+"/api/pg/verify/email",{
                    method:"POST",
                    headers:basicHeader,
                    body:JSON.stringify(data2)
                })
                .then(res=>res.json())
                .then(d=>{
                    if(d.hasOwnProperty("error"))
                    {
                        alert(d["error"]);
                        return;
                    }
                    window.localStorage.setItem("pg_token",d["token"]);
                    window.localStorage.setItem("uid",d["uid"]);
                    location.href="../pg/dashboard.html";
                });
            });
        });
    });
});