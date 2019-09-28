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

        if(value!="" && value!= this.oldVal ) {
            clearTimeout(this.typeWait)
            this.showLoader()
            this.typeWait = setTimeout(() => this.sendReq(), 700)
        }

        this.oldVal = value
    }

    sendReq() {
        axios.post('/search', {searchTerm: this.inputFld.value})
        .then(()=>{})
        .catch(()=>{
            
        })
    }

    showLoader() {
        this.loader.classList.add("circle-loader--visible")
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
          <div class="list-group shadow-sm">
            <div class="list-group-item active"><strong>Search Results</strong> (4 items found)</div>

            <a href="#" class="list-group-item list-group-item-action">
              <img class="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"> <strong>Example Post #1</strong>
              <span class="text-muted small">by barksalot on 0/14/2019</span>
            </a>
            <a href="#" class="list-group-item list-group-item-action">
              <img class="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"> <strong>Example Post #2</strong>
              <span class="text-muted small">by brad on 0/12/2019</span>
            </a>
            <a href="#" class="list-group-item list-group-item-action">
              <img class="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"> <strong>Example Post #3</strong>
              <span class="text-muted small">by barksalot on 0/14/2019</span>
            </a>
            <a href="#" class="list-group-item list-group-item-action">
              <img class="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"> <strong>Example Post #4</strong>
              <span class="text-muted small">by brad on 0/12/2019</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
        `)
    }
}