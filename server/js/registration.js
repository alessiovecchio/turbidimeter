document.getElementById("submitBtn").addEventListener("click", (e)=>
{
    e.preventDefault(); 
    
    let name = document.getElementById("name").value;
    let password = document.getElementById("password").value;

    if(!validatePassword(password))
    {
      document.getElementById("errorDiv").textContent="la password deve esser almeno di 8 caratteri!";
      return;
    }

    const formData = new FormData();
    //ho dovuto costruire manualmente la form per la conversione ad intero di id
    formData.append('name', name);
    formData.append('password', password);
  
    fetch("php/ajax/process_registration.php", {
      method: 'POST',
      body: formData
    })
  .then(response => response.json()) /*setto nel php la variabile $_SESSION['notifica']=true; */
  .then(data => {
      if(!data['result']){
        document.getElementById("errorDiv").textContent=data['text'];
      }
      else{
        document.getElementById("errorDiv").textContent="benvenuto " + data['user'] + "!";
        document.getElementById("errorDiv").style.backgroundColor="lightgreen";
        window.location.replace("index.php");
      }
  });
});

function validatePassword() {
    let pass = document.getElementById("password").value;
    return pass.length >= 8;
}

