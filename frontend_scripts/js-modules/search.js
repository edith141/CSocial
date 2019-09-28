import axios from 'axios'

export default class Search {
    constructor() {
        this.insertHTMMLtemp()
        this.headerSearchIcon = document.querySelector(".header-search-icon")
        this.overlay = document.querySelector(".search-overlay")
        this.closeIcn = document.querySelector(".close-live-search")
        this.inputFld = document.querySelector("#live-search-field")
        this.resultsArea = document.querySelector(".live-search-results")
        this.loader = document.querySelector(".circle-loader")
        this.typeWait
      
        this.events()
    }


    events() {
        this.closeIcn.addEventListener("click", (evt) => {
            this.closeSearchOverlay()
        })


        this.headerSearchIcon.addEventListener("click", (evt) => {
            evt.preventDefault()
            this.openSearchOverlay()
        })

        this.inputFld.addEventListener("keyup", () => this.keyPressed())
    }



    keyPressed() {
        let value = this.inputFld.value

        if(value =="") {
            clearTimeout(this.typeWait)
            this.hideResults()
            this.hideLoader()
        }

        if(value!="" && value!= this.oldVal ) {
            clearTimeout(this.typeWait)
            this.showLoader()
            this.hideResults()
            this.typeWait = setTimeout(() => this.sendReq(), 500)
        }

        this.oldVal = value
    }

    sendReq() {
        axios.post('/search', {searchTerm: this.inputFld.value})
        .then((responses)=>{
            console.log(responses.data)
            this.renderResults(responses.data)
        })
        .catch(()=>{

        })
    }

    renderResults(posts) {
        if (posts.length) {
            this.resultsArea.innerHTML = `<div class="list-group shadow-sm">
            <div class="list-group-item active"><strong>Search Results</strong> (${posts.length} item(s) found)</div>

            ${posts.map((post)=> {
                return `<a href="post/${post._id}" class="list-group-item list-group-item-action">
                <img class="avatar-tiny" src="https://avatars.dicebear.com/v2/initials/${post.author.username}.svg"> <strong>${post.title}</strong>
                <span class="text-muted small">by ${post.author.username}</span>
              </a>`
            }).join('')}
           
          </div>`
        }

        else {
            this.resultsArea.innerHTML = `<p class= "alert alert-danger text-xenter shadow-sm">Can't find anything</p>`

        }
        this.hideLoader()
        this.showResults()
    }


    showLoader() {
        this.loader.classList.add("circle-loader--visible")
    }
    showResults() {
        this.resultsArea.classList.add("live-search-results--visible")
    }
    hideResults() {
        this.resultsArea.classList.remove("live-search-results--visible")
    }
    hideLoader() {
        this.loader.classList.remove("circle-loader--visible")
    }

    openSearchOverlay() {
        this.overlay.classList.add("search-overlay--visible")
        setTimeout(() => this.inputFld.focus(), 35)
    }
    closeSearchOverlay() {
        this.overlay.classList.remove("search-overlay--visible")
    }

    insertHTMMLtemp() {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="search-overlay ">
    <div class="search-overlay-top shadow-sm">
      <div class="container container--narrow">
        <label for="live-search-field" class="search-overlay-icon"><i class="fas fa-search"></i></label>
        <input type="text" id="live-search-field" class="live-search-field" placeholder="What are you interested in?">
        <span class="close-live-search"><i class="fas fa-times-circle"></i></span>
      </div>
    </div>

    <div class="search-overlay-bottom">
      <div class="container container--narrow py-3">
        <div class="circle-loader"></div>
        <div class="live-search-results">
          
        </div>
      </div>
    </div>
  </div>
        `)
    }
}