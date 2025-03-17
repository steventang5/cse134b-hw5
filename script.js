class ProjectCard extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
                
        
        this.card = document.createElement("div");
        this.card.classList.add("card");

        this.picture = document.createElement("picture");
        const img = document.createElement("img");

        img.src = this.getAttribute("image") || "default.jpg";

        img.alt = this.getAttribute("alt") || "Project Image";
        this.picture.appendChild(img);

        this.info = document.createElement("div");
        this.info.classList.add("info");

        const title = document.createElement("h3");
        title.textContent = this.getAttribute("title") || "Project Title";

        const description = document.createElement("p");
        description.textContent = this.getAttribute("description") || "Project Description";
        
        const link = document.createElement("a");
        const url = this.getAttribute("link") || "#";
        link.href = url;
        link.textContent = "View Project";
        link.target = "_blank";
        
        this.info.appendChild(title);
        this.info.appendChild(description);
        if(url !== "#"){
            this.info.appendChild(link);
        }
        
        const style = document.createElement("style");
        style.textContent = `
            .card {
                display: flex;
                gap: 4rem;
                background: white;
                border-radius: 10px;
            }
            .info {
                display: flex;
                flex-direction:column;
            }
            .info p {
                margin-top: 0;
            }
            img {  
                width: 14rem;
                height: 14rem;
                border-radius: 50%;
            }
            a {
                display: block;
                color: var(--link-color);
                text-decoration: none;
                font-weight: bold;
            }
        `;
        this.shadowRoot.append(style, this.card);

        const allCards = document.querySelectorAll("project-card");
        const index = Array.from(allCards).indexOf(this);

        this.card.innerHTML = "";

        if (index % 2 === 0) {
            this.card.appendChild(this.info);
            this.card.appendChild(this.picture);
        } else {
            this.card.appendChild(this.picture);
            this.card.appendChild(this.info);
        }
    }
}
customElements.define("project-card", ProjectCard);

// Sample project data
const sampleProjects = [
    {
        title: "Document Data Store",
        image: "icons/citrusdb.png",
        alt: "Document Data Store",
        description: "A scalable system using C++, JavaScript, React, and CrowCpp to efficiently store, retrieve, and manage structured documents. This project enabled high-speed operations tailored for JSON structures, incorporated advanced indexing for fast search and access, and featured an intuitive frontend interface for seamless online interaction with the stored documents.",
        link: "https://github.com/CS180-spring/cs180-21-citrusdb-team"
    },
    {
        title: "Text Bot Backend",
        image: "icons/discord.svg",
        alt: "Text Bot Backend",
        description: "Developed an advanced text bot for Discord using JavaScript, Node.js, and MongoDB, which delivers real-time stock charts, in-game statistics from titles like Overwatch, and robust text moderation. The bot features a scalable backend that employs asynchronous programming and comprehensive exception handling to ensure high reliability and responsiveness. Detailed usage history is maintained in MongoDB to facilitate ongoing performance optimization and future enhancements, while seamless integration with external APIs ensures users receive timely and accurate data.",
        link: "https://github.com/CS180-spring/cs180-21-citrusdb-team"
    }
];

// Store sample data in localStorage 
localStorage.setItem("projects", JSON.stringify(sampleProjects));

// Function to load projects from local or remote
function loadProjects(src) {
    let projects = [];

    if (src === "local") {
        projects = JSON.parse(localStorage.getItem("projects"));
        console.log("Local data:", projects);
        displayProjects(projects);
    } else if (src === "remote") {
        fetch("https://api.jsonbin.io/v3/b/67d79e7e8561e97a50ed7070")
            .then(response => response.json())
            .then(data => {
                console.log("Remote data:", data);
                projects = data.record;
                displayProjects(projects);
            })
            .catch(error => console.error("Error fetching remote data:", error));
    }
}

// Function to display the project cards on the page
function displayProjects(projects) {
    const cardsContainer = document.getElementById("cards");
    
    cardsContainer.innerHTML = "";

    projects.forEach(proj => {
        const card = document.createElement("project-card");
        card.setAttribute("title", proj.title);
        card.setAttribute("image", proj.image);
        card.setAttribute("alt", proj.alt);
        card.setAttribute("description", proj.description);
        card.setAttribute("link", proj.link);
        cardsContainer.appendChild(card);
    });
}

//CRUD EC
if (document.getElementById("projectForm")) {
    function getProject() {
        const projects = localStorage.getItem("projects");
        return projects ? JSON.parse(projects) : [];
    }

    function saveProject(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
    }

    function displayProjects() {
        const projectsDisplay = document.getElementById("projectsDisplay");
        const projects = getProject();
        projectsDisplay.innerHTML = "";
        if (projects.length === 0) {
        projectsDisplay.innerHTML = "<p>No projects found.</p>";
        } else {
        projects.forEach((proj, index) => {
            const projectDiv = document.createElement("div");
            projectDiv.innerHTML = `
            <strong>Title:${proj.title}</strong>
            <p>Description:${proj.description}</p>
            <p>Image path:${proj.image}</p>
            <p>Link:<a href="${proj.link}" target="_blank">${proj.link}</a></p>
            `;
            projectsDisplay.appendChild(projectDiv);
        });
        }
    }

    document.getElementById("createBtn").addEventListener("click", function() {
        const title = document.getElementById("title").value;
        const image = document.getElementById("image").value;
        const alt = document.getElementById("alt").value;
        const description = document.getElementById("description").value;
        const link = document.getElementById("link").value;

        if (!title) {
        alert("Title is required.");
        return;
        }

        let projects = getProject();

        projects.push({ title, image, alt, description, link });
        saveProject(projects);
        alert("Project created successfully!");
        displayProjects();
    });

    document.getElementById("readBtn").addEventListener("click", function() {
        displayProjects();
    });

    document.getElementById("updateBtn").addEventListener("click", function() {
        const title = document.getElementById("title").value;
        const image = document.getElementById("image").value;
        const alt = document.getElementById("alt").value;
        const description = document.getElementById("description").value;
        const link = document.getElementById("link").value;

        let projects = getProject();
        const index = projects.findIndex(proj => proj.title === title);
        if (index == -1) {
        alert("Project not found. You can create it first.");
        return;
        }
        projects[index] = { title, image, alt, description, link };
        saveProject(projects);
        alert("Project updated successfully!");
        displayProjects();
    });

    document.getElementById("deleteBtn").addEventListener("click", function() {
        const title = document.getElementById("title").value;
        let projects = getProject();
        const newProjects = projects.filter(proj => proj.title !== title);
        if (projects.length === newProjects.length) {
        alert("Project not found.");
        return;
        }
        saveProject(newProjects);
        alert("Project deleted successfully!");
        displayProjects();
    });

    window.addEventListener("DOMContentLoaded", displayProjects);
}


