const pets = [
  { name: "Bruno", age: "8-12 weeks", breed: "Labrador", gender: "Male", type: "Dog", image: "../public/pet1.jpg" },
  { name: "Mittens", age: "2 years", breed: "Tabby Cat", gender: "Female", type: "Cat", image: "../public/pet2.jpg" },
  { name: "Rocky", age: "2 years", breed: "Australian Shepherd", gender: "Male", type: "Dog", image: "../public/pet3.jpg" },
  { name: "Bella", age: "8 weeks", breed: "Munchkin", gender: "Female", type: "Cat", image: "../public/pet4.jpg" },
  { name: "Charlie", age: "1 year", breed: "Corgi", gender: "Male", type: "Dog", image: "../public/pet5.jpg" },
  { name: "Luna", age: "2 years", breed: "Husky", gender: "Female", type: "Dog", image: "../public/pet6.jpg" },
  { name: "Sunny", age: "3 years", breed: "White Cockatoo", gender: "Male", type: "Bird", image: "../public/pet7.jpg" },
  { name: "Coco", age: "12 weeks", breed: "Cockatiel", gender: "Female", type: "Bird", image: "../public/pet8.jpg" },
  { name: "Sky", age: "2 years", breed: "Macaw", gender: "Male", type: "Bird", image: "../public/pet9.jpg" },
  { name: "Snowy", age: "2.5 years", breed: "Persian Cat", gender: "Female", type: "Cat", image: "../public/pet10.jpg" }
];

const container = document.getElementById("pets-container");
const buttons = document.querySelectorAll("#filter-buttons button");

// Show all pets initially
displayPets("All");

// Button filter functionality
buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    displayPets(button.getAttribute("data-type"));
  });
});
// Display pets with clickable "View Details"
function displayPets(type = "All") {
  container.innerHTML = "";
  pets.forEach(pet => {
    if (type === "All" || pet.type === type) {
      const card = document.createElement("div");
      card.className = "pet-card";
      card.innerHTML = `
        <img src="${pet.image}" alt="${pet.name}">
        <h3>${pet.name}</h3>
        <p>Age: ${pet.age}</p>
        <p>Breed: ${pet.breed}</p>
        <p>Gender: ${pet.gender}</p>
        <a href="../pages/details.html">
          <button>View Details</button>
        </a>
      `;
      container.appendChild(card);
    }
  });
}


// ✅ Add "+ Add Pet" button only for sellers
const userRole = "seller"; // change to "buyer" to hide the button

if (userRole === "seller") {
  const addBtn = document.createElement("button");
  addBtn.textContent = "+ Add Pet";
  addBtn.className = "add-pet-btn";
  addBtn.onclick = () => alert("Add pet form will open here!");
  document.body.insertBefore(addBtn, container);
}
