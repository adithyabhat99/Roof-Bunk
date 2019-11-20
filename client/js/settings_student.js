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
let image_upload_header={
    "x-access-token":token   
}
document.addEventListener("DOMContentLoaded",()=>{
    fetch_all();
    document.querySelector(".inp").addEventListener("change", event => {
        document.querySelector(".profilepic").src = URL.createObjectURL(
          event.target.files[0]
        );
      });
    document.querySelector(".update_button").addEventListener("click",(event)=>{
        event.preventDefault();
        data={};
        let name=document.querySelector("#name").value;
        let email=document.querySelector("#email").value;
        let dob=document.querySelector("#dob").value;
        let password=document.querySelector("#password").value;
        if(name)
        {
            data["name"]=name;
        }
        if(email)
        {
            data["email"]=email;
        }
        if(dob)
        {
            data["dob"]=dob;
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
        else if(email || dob || name)
        {
            fetch(host+"/api/student/account",{
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
    document.querySelector(".change_pic").addEventListener("click",event=>{
        event.preventDefault();
        if (document.querySelector(".inp").files.length == 0) 
        {
            alert("Select a file");
            return;
        }
        let Image = document.querySelector(".inp").files[0];
        let form = new FormData();
        form.append("file", Image);
        fetch(host+"/api/student/picture", {
            method: "POST",
            headers: image_upload_header,
            body: form
          })
            .then(response => response.json())
            .then(data => {
              if (data.hasOwnProperty("error")) {
                alert(data["error"]);
                return;
              }
              alert("Success!");
              change_pic(Image);
            })
            .catch(error => {
              return;
            });
    });
    document.querySelector(".delete_button").addEventListener("click",event=>{
        event.preventDefault();
        let t=confirm("Are you sure?");
        if(t==false)
            return;
        fetch(host+"/api/student/account",{
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
    fetch(host+"/api/student/verify/email",{
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
            window.localStorage.setItem("student_token",d["token"]);
            window.localStorage.setItem("uid",d["uid"]);
            alert("Email verified")
        });
}
function reset_password(email,password)
{
    Data={
        username:email
    };
    fetch(host+"/api/student/reset/password",{
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
        fetch(host+"/api/student/reset/password",{
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
    fetch(host+"/api/student/account",{
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
        document.getElementById("name").placeholder=data["Name"];
        document.getElementById("email").placeholder=data["Email"];
        document.getElementById("dob").value=data["DOB"].substring(0,10);
        fetch(host+"/api/student/picture",{
            method:"GET",
            headers:basicHeader
        })
        .then(res=>res.blob())
        .then(file=>{
            document.querySelector(".profilepic").src = URL.createObjectURL(file);
        });
    })
}