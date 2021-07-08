//notes:
//json-server --watch db.json


//Global variables

//Initial Render

function initialRender(){
    fetchQuotes();

    //create toggle button
    renderFilterToggle()
    //add event listener to toggle button
    toggleEventListener()

    //add event listener to form
    formEventListener();

} 
initialRender()

//Fetches

function fetchQuotes(){
    fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(json => json.forEach(renderQuote))
}
function fetchQuotesByAuthor(){
    fetch('http://localhost:3000/quotes?_sort=author')
    .then(res => res.json())
    .then(json => json.forEach(renderQuote))
}
function fetchQuotesById(){
    fetch('http://localhost:3000/quotes?_sort=id')
    .then(res => res.json())
    .then(json => json.forEach(renderQuote))
}


//DOM manipulations

function renderQuote(data){
    //create elements
    let li = document.createElement('li')
    let blockQuote = document.createElement('blockquote')
    let pQuote = document.createElement('p')
    let footer = document.createElement('footer')
    let buttonLike = document.createElement('button')
    let buttonDelete = document.createElement('button')
    let pLikes = document.createElement('p')
    let buttonEdit = document.createElement('button')

    //add class names
    li.className = 'quote-card'
    blockQuote.className = "blockquote"
    pQuote.className = 'mb-0'
    footer.className = "blockquote-footer"
    buttonLike.className = 'btn-success'
    buttonDelete.className = 'btn-danger'
    pLikes.className = 'like-count'
    buttonEdit.className = 'btn-edit'

    //add content
    blockQuote.textContent = `"${data.quote}"`
    footer.textContent = data.author
    pLikes.textContent = `Likes: ${data.likes}`
    buttonLike.textContent = '+'
    buttonDelete.textContent = '-'
    buttonEdit.textContent = "edit"

    //append to DOM
    blockQuote.append(pQuote, footer, pLikes, buttonLike, buttonDelete, buttonEdit)
    li.append(blockQuote)
    document.querySelector('#quote-list').append(li)

    //delete button event listener
    buttonDelete.addEventListener('click', () => li.remove())

    //like button event listener
    buttonLike.addEventListener('click', (e) => {
        pLikes.innerHTML = ''
        data.likes = data.likes + 1
        pLikes.textContent = `Likes: ${data.likes}`
    }) 
    
    //creating hidden edit form
    let editFormDiv = document.createElement('div')
    editFormDiv.innerHTML = renderEditForm(data)

    //edit event listener for edit button
    buttonEdit.addEventListener('click', () => {
        //append hidden form to the DOM
        blockQuote.append(editFormDiv)

        //nested Submit event listener
        document.querySelector('#edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
    
            //clear current
            blockQuote.innerHTML =''
            footer.innerHTML = ''
 
            //replace
            blockQuote.textContent = e.target[0].value
            footer.textContent = e.target[1].value
            blockQuote.append(pQuote, footer, pLikes, buttonLike, buttonDelete, buttonEdit)
        })
        
    })


}

function renderEditForm(data){
    return (`
    <form id="edit-form">
        <label for="edit-quote">Edit Quote</label>
        <input name="editquote" type="text" class="form-control" id="editquote" value="${data.quote}">
        <label for="editAuthor">Edit Author</label>
        <input name="editauthor" type="text" class="form-control" id="editauthor" value="${data.author}">
        <button type="submit" class="submitbtn">Submit</button>
    </form>
    `)
}

function renderFilterToggle(){
    //create button
    let filterToggle = document.createElement('button')
    filterToggle.textContent = 'Filter by: ID'
    filterToggle.id = "filterToggle"
    document.querySelector("#filter-toggle").append(filterToggle)
}


//Event handlers


function formEventListener(){
    document.querySelector('#new-quote-form').addEventListener('submit', addQuote)
}

function addQuote(e){
    e.preventDefault();
    //console.log(e)
     //console.log(e.target.quote.value)
    let newQuoteObj = {"quote": e.target.quote.value, "author": e.target.author.value}
    renderQuote(newQuoteObj)
}
    

function toggleEventListener() {
    document.querySelector('#filterToggle').addEventListener('click', filterQuotes)
}

function filterQuotes(){
    //console.log('hi this works')
    //clear page
    document.querySelector('#quote-list').innerHTML = ''
    let toggleBtn = document.querySelector('#filterToggle')

    if (toggleBtn.textContent.includes('ID')){
        fetchQuotesById(),
        toggleBtn.textContent = 'Filter by: Author'
    } else {
        fetchQuotesByAuthor()
        toggleBtn.textContent = 'Filter by: ID'
    }
}



 