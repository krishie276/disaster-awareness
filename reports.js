var form = document.getElementById("reportdb-form");

form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    fetch(form.action, {
        method: "POST",
        body: new FormData(form) // Send the form data
    })
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        if (data.created) {  
            alert("Upload Successful!");  
            setTimeout(() => {
                window.location.href = "reports.html";
            }, 2000);
              // Redirect to reports page
        } else {
            throw new Error("Failed to submit the report.");
        }
    })
    .catch(error => {
        console.error("Error:", error); 
        alert("There was an issue submitting the form. Please try again.");
    });
});

                         