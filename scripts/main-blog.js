class BlogSelect extends HTMLElement {
  constructor() {
    super()
    this.select = this
    this.layout = this.dataset.layout
    this.selectTitle = this.select.querySelector('.js-title')
    this.selectField = this.select.querySelector(".js-box")
    this.selectList = this.querySelectorAll('.js-list')
    this.selectBtn = this.querySelector('.js-btn')
    this.selectUrl = this.selectBtn.href

    document.addEventListener("click", this.closeAnyway.bind(this))
    this.selectTitle.addEventListener('click', this.onClick.bind(this))
    this.selectTitle.addEventListener('keypress', this.keyClick.bind(this))
    this.selectField.addEventListener("keydown", this.handleKeyDown.bind(this))

    this.activeIndex  = -1
    this.length = this.selectList.length

    this.layout 
      ? this.sortList()
      : this.filterList()
  }

  closeAnyway(event) {
    if (!event.target.closest('custom-select')) {
      this.close()
      this.selectList.forEach(el => {
        if(el.classList.contains('hover')) el.classList.remove('hover')
      })
    }
  }

  handleKeyDown(event) {
    const {key} = event;
  
    if(key === "ArrowDown") this.moveDown(event)
    if(key === "ArrowUp") this.moveUp(event)
    if(key === 'Enter' || event.code === 'Space') {
      this.pushSelect(event)
    }
  }
  
  moveDown(event) {
    event.preventDefault();
    this.activeIndex = (this.activeIndex+1) % this.length
    this.navigateThroughElement(this.activeIndex)
  }
  
  moveUp(event) {
    event.preventDefault();
    if(this.activeIndex === -1) this.activeIndex = 0;
    this.activeIndex = (this.length + (this.activeIndex-1)) % this.length
    this.navigateThroughElement(this.activeIndex)
    
  }
  
  navigateThroughElement(index,event) {
    this.selectList.forEach(el => {
      if(el.classList.contains('hover')) el.classList.remove('hover')
    })
    this.selectList[index].classList.add('hover')
  }

  pushSelect(event) {
    event.preventDefault()
    let element = this.selectList[this.activeIndex]
    if (element !== undefined) {
      this.layout 
      ? this.stateSelectSort(element)
      : this.stateSelectFilter(element)
    }
    
  }

  onClick(event) {
    event.preventDefault();
    this.select.classList.contains('open') 
      ? this.close()
      : this.open()
  }

  keyClick(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.select.classList.contains('open') 
        ? this.close()
        : this.open()
    }    
  }

  close() {
    this.select.classList.remove('open');
    this.selectField.setAttribute('tabindex', '-1')
  }

  open() {
    let elements = document.querySelectorAll('custom-select')
    elements.forEach(el => {
      if(el.classList.contains('open')) el.classList.remove('open')
    })
    this.selectList.forEach(el => {
      if(el.classList.contains('hover')) el.classList.remove('hover')
    })
    this.select.classList.add('open');
    this.selectField.setAttribute('tabindex', '0')
  }

  sortList() {
    this.selectList.forEach(element => {
      element.addEventListener('click', this.stateSelectSort.bind(this,element))
    });
  }

  stateSelectSort(element) {
    this.selectList.forEach(element => {
      element.classList.remove('active')
    });

    if (!element.classList.contains('active')) {
      element.classList.add('active')
      element.classList.contains(this.layout) 
        ? this.selectBtn.classList.remove('disabled')
        : this.selectBtn.classList.add('disabled')
    }
  }

  filterList() {
    this.selectList.forEach(element => {
      element.addEventListener('click', this.stateSelectFilter.bind(this,element))
    });
  }

  stateSelectFilter(element) {
    let tag;
    let url;
    let link = window.location.href
        
    if (!element.classList.contains('active')) {
      this.selectList.forEach(element => {
        element.classList.remove('active')
      });
      element.classList.add('active')
      tag = element.dataset.filter
      link.includes('?blog=oldest') 
        ? url = this.selectUrl + '/tagged/' + tag + '?blog=oldest'
        : url = this.selectUrl + '/tagged/' + tag
    }else {
      element.classList.remove('active')
      link.includes('?blog=oldest') 
        ? url = this.selectUrl + '?blog=oldest'
        : url = this.selectUrl
    }

    this.selectBtn.href = url

    try {
      this.selectList.forEach(element => {    
        if (element.classList.contains('active')) { 
          this.selectBtn.classList.remove('disabled');
          throw 'Break';
        }else{
          !link.includes('tagged') 
            ? this.selectBtn.classList.add('disabled')
            : this.selectBtn.classList.remove('disabled')
        }
      })
    } catch (event) {
      if (event !== 'Break') throw event
    }
  }
}

customElements.define('custom-select', BlogSelect);

class BlogLoadMore extends HTMLElement {
  constructor() {
    super()
    window.currentPage = 1
    this.addEventListener('click', this.loadNextPage.bind(this))
  }

  getQueryForBlogPagination(sectionId) {
    const params = new URLSearchParams(window.location.search)
    let query = ''
  
    for (let p of params) {
      if (p[0] !== 'page') {
        if (query !== '') {
          query += '&'
        }
  
        query += `${p[0]}=${p[1]}`
      }
    }
  
    const partQuery = `?section_id=${sectionId}&page=${window.currentPage}${query !== '' ? '&' : ''}`
  
    return partQuery + query
  }

  loadNextPage() {
    const sectionId = document.getElementById('main-blog-post-grid').dataset.id
    window.currentPage++
    const query = this.getQueryForBlogPagination(sectionId)
    fetch(query)
      .then(response => response.text())
      .then((responseText) => {
        const html = new DOMParser()
          .parseFromString(responseText, 'text/html')
          .querySelector(`[id*="${sectionId}"]`).innerHTML
        this.renderPostGrid(html)
      })
  }

  renderPostGrid(html) {
    const content = new DOMParser().parseFromString(html, 'text/html')
    const postGrid = content.getElementById('main-blog-post-grid')
    const innerHTML = postGrid.innerHTML
    const itemsFetched = parseInt(content.querySelector('.js-post-count').innerHTML)
    const totalProducts = parseInt(content.querySelector('.js-total-post-count').innerHTML)
  
    document.querySelector('.js-post-count').innerHTML = itemsFetched >= totalProducts ? totalProducts : itemsFetched
    if (postGrid.querySelector('.article')) {
      document.getElementById('main-blog-post-grid').insertAdjacentHTML('beforeend', innerHTML)
    }
    if (itemsFetched >= totalProducts) {
      document.querySelector('.js-blog-load-more').style.display = 'none'
    }
  
    const searchParams = new URLSearchParams(window.location.search).toString()
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`)
  }
}

customElements.define('blog-load-more', BlogLoadMore);
