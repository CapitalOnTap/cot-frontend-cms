import axios from 'axios';
import faqConfig from './faqConfig';
import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import ReactDOM from 'react-dom';


function FAQs({searchIcon}) {  
  const [ isActive, setActive ] = useState(false)

  const [ searchTerm, setSearchTerm ] = useState("");
  const handleSearchChange = event => {
    setSearchTerm(event.target.value)
    event.target.value ? setActive(true) : setActive(false)
  }
  
  const [ faqData, setFaqData ] = useState({});
  async function fetchData() {
    
    const res = await fetch('/umbraco/surface/faq/search?lang=en&q=');

    res
      .json()
      .then(res => {

        const results = res.reduce((acc, faq) => {
          acc[faq.category] = acc[faq.category] || [];
          acc[faq.category].push(faq);
          return acc;      
        },[])

        setFaqData(results)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchData()
  },[])
  
  const filterResults = !searchTerm
    ? faqData
    : Object.values(faqData).flat()
    .filter(item => item.questionText.toLowerCase().includes(searchTerm.toLowerCase()) || item.answerCopy.toLowerCase().includes(searchTerm.toLowerCase()) )
    .reduce((acc, faq) => {
      acc[faq.category] = acc[faq.category] || [];
      acc[faq.category].push(faq);
      return acc;      
    },[])
    
  return (
    <>
      <section className="container-fluid">
        <div className="container px-0">
          <div className={` ${isActive ? 'active' : ''} form-group position-relative mx-0 mx-md-2 mb-0`}>
            {searchIcon && (
              <img 
                data-src={searchIcon} 
                className='img-fluid search-icon position-absolute' 
                alt='Capital On Tap' 
              />
            )}
            <input 
              id="faq-search" 
              type="text" 
              className="form-control border-0"
              placeholder="What can we help with?"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <img 
              id="clear" 
              data-src="/assets/dist/img/icons/close-icon.svg" 
              className='img-fluid close-icon position-absolute' 
              alt='Capital On Tap'
              onClick={() => setSearchTerm("")}
            />
          </div>
        </div>
      </section>

      <section className="container-fluid pb-5 px-0 text-left">
        <div className="container">
          <div id="accordion">
            {Object.keys(filterResults).length > 0 ? (
              Object.entries(filterResults).map(([key, list]) => (
                <div key={key.replace(/ /g,"_")}>
                  <h2 id={key.replace(/ /g,"_")} className="card-title mb-4 mt-4 mt-lg-5">{key}</h2>
                  {list.map(item => (
                    <div key={item.id} className="card mb-3 shadow border-0">
                      <div className="card-header border-0 pr-5 position-relative bg-white" id={item.id}>
                        <h5 className="mb-0" role="button" data-toggle="collapse" data-target={`#item-${item.id}`} aria-expanded="false" aria-controls={item.id}>
                          <button className="btn btn-link p-0 text-left w-100 position-relative">{ item.questionText }</button>
                          <img src="/assets/dist/img/icons/add-icon.svg" className='img-fluid search-icon position-absolute' alt='Capital On Tap'/>
                          <img src="/assets/dist/img/icons/remove-icon.svg" className='img-fluid remove search-icon position-absolute' alt='Capital On Tap'/>
                        </h5>
                      </div>
                      <div id={`item-${item.id}`} className="collapse mx-4" aria-labelledby={item.id} data-parent="#accordion">
                        <div className="card-body px-0">{ ReactHtmlParser(item.answerCopy) }</div>
                      </div>    
                    </div>
                  ))}
                </div>
                )))
              : <div className="mt-3">
                  <h4>No results found.</h4>
                  <a className="blue" href="#">Ask our customer team online</a>
                </div>
            }
          </div>
        </div>
      </section>
    </>
  )
};

const faqElement = document.getElementById('accordion-react')
ReactDOM.render(
  <FAQs searchIcon={faqElement.getAttribute('data-search-icon')} />,
  faqElement
);





