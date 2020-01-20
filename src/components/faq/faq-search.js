// import axios from 'axios';
import faqConfig from './faqConfig';

class FAQSearch {
  constructor() {
    this.searchInput = document.getElementById('faq-search');
    this.accordion = document.getElementById('accordion');
    this.accordionResults = document.getElementById('accordion-results');    
    this.emptySearch = document.getElementById('empty-search');    
  }

  search() {
    const val = this.searchInput.value

    if(val) {
      // axios.get('/faq.json')
      //   .then(response => {
      //     console.log(response)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })      
      this.accordion.style = "display: none;";
      this.searchInput.parentElement.classList.add("active");
      this.accordionResults.style = "display: block;";
      const results = faqConfig.filter(item => {
        return item.question.includes(val.toLowerCase()) || item.answer.includes(val.toLowerCase())
      })

      return this.template(results)
    } else {
      this.accordion.style = "display: block;";
      this.searchInput.parentElement.classList.remove("active");
      this.accordionResults.style = "display: none;";
    }
  }

  template(results) {
    this.accordionResults.innerHTML = "";

    if (results.length > 0) {

      return results.map((item, idx) => {
        this.accordionResults.innerHTML += `
          <div class="card my-3 shadow border-0">
            <div class="card-header border-0 pr-5 position-relative bg-white" id="question-${item.id}">
              <h5 class="mb-0" role="button" data-toggle="collapse" data-target="#question-${item.id}-${idx}" aria-expanded="false" aria-controls="question-${item.id}-${idx}">
                <button class="btn btn-link p-0 text-left w-100 position-relative">${item.question}</button>
                <img class="img-fluid search-icon position-absolute loaded" src="/img/icons/add-icon.svg" alt="Capital On Tap">
                <img class="img-fluid remove search-icon position-absolute loaded" src="/img/icons/remove-icon.svg" alt="Capital On Tap">
              </h5>
            </div>
            <div class="collapse mx-4" id="question-${item.id}-${idx}" aria-labelledby="question-${item.id}" data-parent="#accordion-results">
              <div class="card-body px-0">${item.answer}</div>
            </div>
          </div>
        `;
      }) 

    } else {
      this.accordionResults.innerHTML = `<div class="mt-3"><h4>No results found.</h4><a class="blue" href="#">Ask our customer team online</a></div>`;
    }

  }

  init() {
    if(this.searchInput) {
      document.addEventListener('keyup', () => {
        this.search()
      })
    }

    if(this.emptySearch) {
      document.addEventListener('click', () => {
        this.searchInput.value = ""
        this.search()
      })
    }
  }
}

export default FAQSearch;





