document.addEventListener("DOMContentLoaded", function(){
    const modal  = document.querySelector(".modal");
    const closeBtn =  document.querySelector(".close");
    const tableBody = document.querySelector("#dataList");
    const dataForm  = document.getElementById("dataForm");
      
    const nameInput = document.getElementById("nameInput");
    const ageInput =  document.getElementById("ageInput");
    const genderSelect = document.getElementById("genderSelect");

    // Commenting out old modal edit inputs and form
    /*
    const editForm  = document.getElementById("editForm");
    const editNameInput = document.getElementById("editNameInput");
    const editAgeInput =  document.getElementById("editAgeInput");
    const editGenderSelect = document.getElementById("editGenderSelect");
    const editIndex = document.getElementById("editIndex");
    */

    //modal code for Add Data
    const addButton = document.querySelector(".btnAdd");
    const addModal = document.getElementById("addModal");
    const closeAddBtn = document.querySelector(".closeAddBtn");

    // Show modal when "Add Data" is clicked
    addButton.addEventListener("click", () => {
        addModal.style.display = "block";
    });

    // Close modal when "×" is clicked
    closeAddBtn.addEventListener("click", () => {
        addModal.style.display = "none";
    });

    // Close modal if user clicks outside the modal box
    window.addEventListener("click", (e) => {
        if (e.target === addModal) {
            addModal.style.display = "none";
        }
    });

    //Search for an element
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const searchResult = document.getElementById("searchResult");

    //Search
    searchButton.addEventListener("click", function () {
        const searchName = searchInput.value.trim().toLowerCase();
        const storedData = JSON.parse(localStorage.getItem("myData")) || [];

        const index = storedData.findIndex(user => user.name.toLowerCase() === searchName);

        if (index !== -1) {
            searchResult.textContent = `Name found at index: ${index + 1}`;
        } else {
            searchResult.textContent = "Name not found!";
        }
    });   

    loadStoredData();

    //Sort by Icon
    let sortState = {
        name: true,
        age: true,
        gender: true
    };

    const materialIcons = document.querySelectorAll(".material-symbols-outlined");

    materialIcons.forEach((icon) => {
        icon.addEventListener("click", function () {
            const field = icon.getAttribute("data-field");
            const ascending = sortState[field];

            const storedData = JSON.parse(localStorage.getItem("myData")) || [];

            storedData.sort((a, b) => {
                if (typeof a[field] === "string") {
                    return ascending
                        ? a[field].toLowerCase().localeCompare(b[field].toLowerCase())
                        : b[field].toLowerCase().localeCompare(a[field].toLowerCase());
                } else {
                    return ascending ? a[field] - b[field] : b[field] - a[field];
                }
            });

            // Toggle the sorting direction
            sortState[field] = !ascending;

            localStorage.setItem("myData", JSON.stringify(storedData));
            loadStoredData();
        });
    });

    dataForm.addEventListener("submit", function(e){
        e.preventDefault();
        const name = nameInput.value.trim();
        const age = parseInt(ageInput.value);
        const gender = genderSelect.value;
        if( name !== ""  && !isNaN(age) &&  gender !== ""){
             const user = {
                name: name,
                age: age,
                gender: gender,
             };
             addToLocalStorage(user);
             loadStoredData();
             dataForm.reset();
             addModal.style.display = "none"; // close modal after adding
        }else{
            alert("Please fill all details");
        }
    });

    /*
    // Commenting out modal edit form submit since we're doing inline edit now
    editForm.addEventListener("submit", function(e){
        e.preventDefault();
      
        const newName = editNameInput.value.trim();
        const newAge = parseInt(editAgeInput.value);
        const newGender = editGenderSelect.value;
        const index = parseInt(editIndex.value);
        if( newName != ""  && !isNaN(newAge) &&  newGender != ""){
            const storedData = JSON.parse(localStorage.getItem("myData")) || [];
            storedData[index].name = newName;
            storedData[index].age = newAge;
            storedData[index].gender = newGender;
            localStorage.setItem("myData",JSON.stringify(storedData));
            editForm.reset();
            modal.style.display = "none";
            loadStoredData();
        }else{
            alert("please fill all detials");
        }
    });
    */

    function addToLocalStorage(user){
         const storedData = JSON.parse(localStorage.getItem("myData")) || [];
         storedData.push(user);
         localStorage.setItem("myData",JSON.stringify(storedData));
    }

    /*
    // Commenting out old editData function
    function editData(){
        const index = this.dataset.index;
        const storedData = JSON.parse(localStorage.getItem("myData")) || [];
        const data = storedData[index];
        editIndex.value = index;
        editNameInput.value= data.name;
        editAgeInput.value = data.age;
        editGenderSelect.value = data.gender;
        modal.style.display = "block";
    }
    */

    function deleteData(){
        if(confirm("Are You Sure TO Delete ?")){
            const index = this.dataset.index;
            const storedData = JSON.parse(localStorage.getItem("myData")) || [];
            storedData.splice(index,1);
            localStorage.setItem("myData",JSON.stringify(storedData));
            loadStoredData();
        }
    }

    //Function to close the modal using close Btn (for modal edit) - no longer needed
    /*
    closeBtn.addEventListener("click", function(){
        modal.style.display = "none";
    });
    window.addEventListener("click", function(e){
        if(e.target == modal){
            modal.style.display = "none";
        }
    });
    */

    // Load and render data including inline editing capability
    function loadStoredData(){
        const storedData = JSON.parse(localStorage.getItem("myData")) || [];
        tableBody.innerHTML = ""; // Clear previous data

        storedData.forEach(function(data, index){
            const row  = document.createElement("tr");

            // Create editable cells or plain text depending on mode
            row.innerHTML = `
                <td class="nameCell">${data.name}</td>
                <td class="ageCell">${data.age}</td>
                <td class="genderCell">${data.gender}</td>
                <td><button data-index="${index}" class="btnEdit">Edit</button></td>
                <td><button data-index="${index}" class="btnDelete">Delete</button></td>
            `;

            tableBody.appendChild(row);
        });

        // Attach edit button listeners - for inline editing
        const editButtons = document.querySelectorAll(".btnEdit");
        editButtons.forEach((btn) => {
            btn.addEventListener("click", function(){
                const row = this.closest("tr");
                const index = this.dataset.index;
                if(this.textContent === "Edit"){
                    // Change to Save and make cells editable
                    this.textContent = "Save";

                    // Get current values
                    const name = row.querySelector(".nameCell").textContent;
                    const age = row.querySelector(".ageCell").textContent;
                    const gender = row.querySelector(".genderCell").textContent;

                    // Replace cells with input/select elements
                    row.querySelector(".nameCell").innerHTML = `<input type="text" value="${name}" style="width: 120px;">`;
                    row.querySelector(".ageCell").innerHTML = `<input type="number" value="${age}" min="1" max="120" style="width: 60px;">`;
                    row.querySelector(".genderCell").innerHTML = `
                        <select style="width: 90px;">
                            <option value="Male" ${gender === "Male" ? "selected" : ""}>Male</option>
                            <option value="Female" ${gender === "Female" ? "selected" : ""}>Female</option>
                            <option value="Other" ${gender === "Other" ? "selected" : ""}>Other</option>
                        </select>
                    `;
                } else {
                    // Save button clicked - validate and save changes
                    const newName = row.querySelector(".nameCell input").value.trim();
                    const newAge = parseInt(row.querySelector(".ageCell input").value);
                    const newGender = row.querySelector(".genderCell select").value;

                    if(newName === "" || isNaN(newAge) || newAge < 1 || newAge > 120 || newGender === ""){
                        alert("Please enter valid details before saving.");
                        return;
                    }

                    // Update localStorage
                    const storedData = JSON.parse(localStorage.getItem("myData")) || [];
                    storedData[index].name = newName;
                    storedData[index].age = newAge;
                    storedData[index].gender = newGender;
                    localStorage.setItem("myData", JSON.stringify(storedData));

                    // Change back to text and update row
                    row.querySelector(".nameCell").textContent = newName;
                    row.querySelector(".ageCell").textContent = newAge;
                    row.querySelector(".genderCell").textContent = newGender;

                    this.textContent = "Edit";
                }
            });
        });

        // Attach delete button listeners
        const deleteButtons = document.querySelectorAll(".btnDelete");
        deleteButtons.forEach((btn)=>{
            btn.addEventListener("click", deleteData);
        });
    }
});
