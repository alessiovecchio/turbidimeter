
document.getElementById("loginBtn").addEventListener("click", (e) => {

    e.preventDefault(); 


    let name = document.getElementById("name").value;
    let password = document.getElementById("password").value;

    const formData = new FormData();
    //ho dovuto costruire manualmente la form per la conversione ad intero di id
    formData.append('name', name);
    formData.append('password', password);
  
    fetch("php/ajax/process_login.php", {
      method: 'POST',
      body: formData
    })
  .then(response => response.json()) /*setto nel php la variabile $_SESSION['notifica']=true; */
  .then(data => {
      if(!data['result']){
        document.getElementById("errorDiv").textContent=data['text'];
      }
      else{
        document.getElementById("errorDiv").textContent="bentornato " + name + "!";
        document.getElementById("errorDiv").style.backgroundColor="lightgreen";
        window.location.replace("index.php");
      }
  });
});