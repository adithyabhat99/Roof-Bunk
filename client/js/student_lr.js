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
        fetch(host+"/api/student/login",{
            method:"POST",
            headers:basicHeader,
            body:JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.hasOwnProperty("error"))
            {
                alert(data["error"]);
                return;
            }
            window.localStorage.setItem("student_token",data["token"]);
            location.href="../an-ad-deek/index.html"
        })
    });
    document.getElementById("submit_register").addEventListener("click",event=>{
        event.preventDefault();
        let name=document.getElementById("name").value;
        let password=document.getElementById("password_register").value;
        let email=document.getElementById("email").value;
        let dob=document.getElementById("dob").value;
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
        if(!name || !password || !email || !dob || !gender)
        {
            alert("Enter remaining fields");
            return;
        }
        let data={
            name,
            password,
            email,
            dob,
            gender
        };
        fetch(host+"/api/student/account",{
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
            fetch(host+"/api/student/verify/email",{
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
                window.localStorage.setItem("student_token",d["token"]);
                location.href="../an-ad-deek/index.html";
            })
        })
    });
});