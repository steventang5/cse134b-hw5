class ProjectCard extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        
        
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
                align-items:flex-start;
            }
            .info p {
                margin-top: 0;
            }
            img {  
                display:block;
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
    }

    connectedCallback() {
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
