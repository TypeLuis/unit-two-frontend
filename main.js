// DECLARING VARIABLES

const backendUrl = 'http://localhost:3001'

// h1 elements to get user's name and search name
const heading = document.getElementById('User-heading')
const userPostName = document.getElementById('user-post-name')

// Links that are available
const signUpLink = document.getElementById("signup-link");
const loginLink = document.getElementById("login-link");
const logoutLink = document.getElementById('logout-link')
const settingsLink = document.getElementById('settings-link')
const userLink = document.getElementById('user-link')
const submissions = document.getElementById('submissions')

// Grabs all links 
const navlinks = document.getElementsByClassName("nav-link");

// different pages users can go
const homePage = document.getElementById("home-page");
const userPage = document.getElementById("user-page");
const bodypage = document.getElementById('bodyPage')
const settingsMenu = document.getElementById('settings-menu')

// Forms users can search from
const signUpForm = document.getElementById("signup-form")
const loginForm = document.getElementById("login-form")
const userForm = document.getElementById('user-form')
const searchForm = document.getElementById('search-form')
const videoForm = document.getElementById("video-form")

// Forms for Dom manipulation
const pageBgForm = document.getElementById('page-background')
const postBgForm = document.getElementById('post-background')
const videoBgForm = document.getElementById('video-background')

const domForms = document.getElementsByClassName('settings')

// List of posts in user & search page
const userList = document.getElementById("user-posts")
const videoList = document.getElementById("videos")

// gets the list of drop down fonts in settings
const fontList = document.getElementById('fonts')

// determines if someone is editing code or not
let editMode = false



///// FUNCTIONS ////


// removes all the post displaying on page, it does not destroy the post itself
const removePostElement = async ()=>{
    try{
        const articles = document.getElementsByTagName("article")

        for (let i = articles.length - 1; i >= 0; i--) {

            // nodes that you just obtained from getElementsByTagName() gets updated too
            // to avoid lingering references, you should just keep removing the first node until none remain.
            articles[i].parentNode.removeChild(articles[i]);
        }
    }
    catch(error){
        console.log(error)
    }
}


// function that creates elements that show user posts
const setPostElement = (post, userId, postId)=>{

    // creates elements
    const article = document.createElement('article')
    const newPost = document.createElement("h1")

    // sets attribute to the element
    article.setAttribute('class', 'posts')

    // post is what the parameter is when function is called
    newPost.innerText = post

    // append elements
    userList.append(article)
    article.append(newPost)

    

    // edits and deletes post if id = the assocciation of the post // post.userId converts to a string for operator to be true
    if(userId.toString() === localStorage.getItem('userId')){

        // creates elements
        const deleteButton = document.createElement("button")
        const editButton = document.createElement("button")
        const buttons = document.createElement('div')

        editButton.innerText = "edit"
        deleteButton.innerText = "delete"

        // sets attributes to the elements
        deleteButton.setAttribute('class', 'delete-buttons')
        editButton.setAttribute('class', 'edit-buttons')
        buttons.setAttribute('class', 'postButtons')

        // appending elements to page
        buttons.append(editButton)
        buttons.append(deleteButton)
        article.append(buttons)


        // adds an event listener to delete the post
        deleteButton.addEventListener('click', async ()=>{

            //api deletes post // postId is the parameter when function is called
            await axios.delete(`http://localhost:3001/user/posts/${postId}`,{
                headers: {
                    authorization: localStorage.getItem('userId')
                }
            })
            // remove element
            article.remove()
        })
        

        // event listener creates a form to edit post
        editButton.addEventListener('click', async ()=>{

            // switching edit mode true to false back to true makes the user only to edit one post
            if(editMode === false){

                // turns on edit mode
                editMode = true

                // creates elements
                const editForm = document.createElement('form')
                const textInput = document.createElement('textarea')
                const submitInput = document.createElement('input')
                const editDiv = document.createElement('div')
                const editLabel = document.createElement('label')
                
                // sets attributes to the elements
                editForm.setAttribute('class', 'edit-forms')
                textInput.setAttribute('type', 'text')
                submitInput.setAttribute('type', 'submit')
                submitInput.setAttribute('value', 'edit post')
                submitInput.setAttribute('class', 'editButtons')
                
                
                // display post elements to hide from screen
                newPost.style.display = 'none'
                editButton.style.display = 'none'
                deleteButton.style.display = 'none'
                userForm.style.display='none'

                // makes form ontop of post on not video
                submissions.style.flexDirection='row-reverse'
                
                // takes the text of post element and adds inside of textbox
                textInput.value = newPost.innerText

                editLabel.innerText = 'Make your changes'
                
                // appending elements to page
                editForm.append(editDiv) 
                editForm.append(editLabel)
                editDiv.append(textInput)
                editDiv.append(submitInput)

                submissions.append(editForm)

                // event listener update the post on what user types
                editForm.addEventListener('submit', async (event)=>{

                    // turns off edit mode
                    editMode = false
                    
                    event.preventDefault()
        
                    postVal = textInput.value
        
                    newPost.innerText = postVal
                    
                    //api edits specific post based on id // first object is body, second is headers
                    await axios.put(`http://localhost:3001/user/posts/${postId}`, {post: postVal} ,{
                        headers: {
                            authorization: localStorage.getItem('userId')
                        }
                    })
                    
                    // display post elements to display from screen
                    newPost.style.display = 'flex'
                    editButton.style.display = 'flex'
                    deleteButton.style.display = 'flex'
                    userForm.style.display='flex'

                    submissions.style.flexDirection='row'
                    
                    // removes elements from page
                    editForm.remove()
                    textInput.remove()
                    submitInput.remove()
                })
            }
        })
    }
}


// function that shows every post that user created
const seeUserPosts = async ()=>{

    removePostElement() // removes all the post displaying on screen, it does not destroy the post itself

    
    // api gets all of user's post
    const response = await axios.get(`http://localhost:3001/user/posts`, {
        headers: {
            authorization: localStorage.getItem('userId')
        }
    })

    // gets data from api and set to variable
    const posts = response.data

    // itterates every post user posted
    for(let post of posts){
        const postContent = post.post
        const postId = post.id
        const userId = post.userId

        await setPostElement(postContent, userId, postId) // function that creates elements that show user posts

    }
}


// function that gets all users dom and sets dom to user page
const setDom = async ()=>{

    // api gets all user's dom choices
    try{
        const getDomResponse = await axios.get('http://localhost:3001/dom',{
            headers: {
            authorization: localStorage.getItem('userId')
            }
        })
        
        // gets data from api and set to variable
        bodyBg = getDomResponse.data.dom.body
        pageBg = getDomResponse.data.dom.page
        postBg = getDomResponse.data.dom.post
        videoBg = getDomResponse.data.dom.video
        fontStyle = getDomResponse.data.dom.font
        
        // changes style based on each user data
        bodypage.style.background = bodyBg
        userPage.style.backgroundColor = pageBg
        userList.style.backgroundColor = postBg
        videoList.style.backgroundColor = videoBg
        userPage.style.fontFamily = fontStyle

    }
    catch(TypeError){
        // api creates a dom table for the user
        const createDomResponse = await axios.get('http://localhost:3001/dom/user/create',{
            headers: {
                authorization: localStorage.getItem('userId')
            }
        })

        const getDomResponse = await axios.get('http://localhost:3001/dom',{
            headers: {
            authorization: localStorage.getItem('userId')
            }
        })
        
        // gets data from api and set to variable
        bodyBg = getDomResponse.data.dom.body
        pageBg = getDomResponse.data.dom.page
        postBg = getDomResponse.data.dom.post
        videoBg = getDomResponse.data.dom.video
        fontStyle = getDomResponse.data.dom.font
        
        // changes style based on each user data
        bodypage.style.background = bodyBg
        userPage.style.backgroundColor = pageBg
        userList.style.backgroundColor = postBg
        videoList.style.backgroundColor = videoBg
        userPage.style.fontFamily = fontStyle
    }

}


// displays the name of user's post in post body
const seePosterName = async (string)=>{
    // if there's an 's' at the end, don't add 's, add s
    if(string.slice(-1) === 's' || string.slice(-1) === 'S'){
        userPostName.innerText = `${string}' posts`
    }else{
        userPostName.innerText = `${string}'s posts`
    }
}


// function that sees every videos that user created
const seeUserVideos = async (even)=>{

    // api that gets all user's video
    const response = await axios.get(`http://localhost:3001/user/videos`, {
        headers: {
            authorization: localStorage.getItem('userId')
        }
    })

    // gets data from api and set to variable
    const videos = response.data

    // gets each video link user has in database
    for(let video of videos){
        
        // creates elements
        const iFrame =  document.createElement('iframe')
        const videoFrame = document.createElement('div')
        const delButton = document.createElement('button')

        // gets link from api
        const link= video.videoLink

        // replace part of the link to another word
        let url = link.replace("watch?v=", "embed/")

        delButton.innerText = 'delete'

        // sets attributes to the iframe
        iFrame.setAttribute('src',url) 
        iFrame.setAttribute('height','200vmi') 
        iFrame.setAttribute('width','280vmi') 

        // appending elements
        videoFrame.append(iFrame)
        videoFrame.append(delButton)
        videoList.append(videoFrame)

        const videoId = video.id
        
        // now each video itteration has an event listener // deletes the video link inside the database
        delButton.addEventListener('click', async ()=>{

            // gets the id of each video itteration
            await axios.delete(`http://localhost:3001/user/videos/${videoId}`,{
                headers: {
                    authorization: localStorage.getItem('userId')
                }
            })
            if(localStorage.getItem('userId')){
                videoFrame.remove()
            }
        })

    }
    
}




//// FOR LOOPS //////


// itterates every link in navigation bar
for(let nav of navlinks){
    nav.addEventListener("click", async function(){ 

        // gets the element id name and splits by '-' this returns a list of all characters seperated by '-'
        let navName = nav.id.split("-")[0]
        console.log(navName);

        // switch takes in an expression then then if case condition is true, run the block of code before break
        switch(navName){

            // case has a : syntax at the end of the expression condition
            case 'login':

                // "none" hides the content from being shown
               signUpForm.style.display = "none";
               loginLink.style.display = "none";
            

               // "flex" shows the content
               loginForm.style.display = "flex";
               signUpLink.style.display = "flex";
            break;

            case 'signup':
                loginForm.style.display = "none";  
                signUpLink.style.display = "none";
            

                loginLink.style.display = "flex";
                signUpForm.style.display = "flex";
            break;

            case 'logout':
                userPage.style.display ="none";
                logoutLink.style.display = "none";
                settingsLink.style.display = "none"
                signUpForm.style.display = "none";
                searchForm.style.display = "none";
                
                // removes id from local storage
                localStorage.removeItem('userId')

                loginForm.style.display = "flex";
                signUpLink.style.display = "flex";
                homePage.style.display = "flex";
            break;

            case 'settings':

                if(settingsMenu.style.display === "none"){
                    settingsMenu.style.display = "flex"
                }
                else{
                    settingsMenu.style.display = "none"
                }
            break

            case 'user':
                seeUserPosts() // function that shows every post that user created

                seePosterName(localStorage.getItem('userName')) // displays the name of user's post in post body
                
                userLink.style.display = "none"
            break


        }
    })
}


// gets every form in settings container
for(let form of domForms){

    form.addEventListener('submit', async (event)=>{

        event.preventDefault()

        // grabs the first word of the event listener
        let domName = form.id.split("-")[0]


        // since the first word of form id is the same for input id we can get the id of the text
        const color = document.getElementById(`${domName}-background-text`).value 

        // function updates the dom to database
        const updateDomDB = async (domName, colorPicked)=>{
            // sets variable to empty object
            let bodyObject = {}

            // this gives object a "key" : "value" pair. EX {post: "blue"}
            bodyObject[domName] = colorPicked
            console.log(bodyObject) 

            // api that updates database based on user input
            const changeColorResponse = await axios.put('http://localhost:3001/dom/user/update',bodyObject,{
                headers: {
                    authorization: localStorage.getItem('userId')
                }
            })
        }

        // empty the value inside of text
        document.getElementById(`${domName}-background-text`).value = ""

        switch(domName){

            case 'page':

                userPage.style.backgroundColor = null
                userPage.style.backgroundColor = color

                if(userPage.style.backgroundColor === ""){

                    setDom() // function that gets all users dom and sets dom to user page

                    console.log('Color not in CSS')
                }
                else{
                    updateDomDB(domName, color) // function updates the dom to database
                }

            break

            case 'post':

                userList.style.backgroundColor = null
                userList.style.backgroundColor = color

                if(userList.style.backgroundColor === ""){

                    setDom() // function that gets all users dom and sets dom to user page

                    console.log('Color not in CSS')
                }
                else{
                    updateDomDB(domName, color) // function updates the dom to database
                }

            break

            case 'video':

                videoList.style.backgroundColor = null
                videoList.style.backgroundColor = color

                if(videoList.style.backgroundColor === ""){

                    setDom() // function that gets all users dom and sets dom to user page

                    console.log('Color not in CSS')
                }
                else{
                    updateDomDB(domName, color) // function updates the dom to database
                }

            break

            case 'body':
                bodypage.style.backgroundColor = null
                bodypage.style.backgroundColor = color

                if(bodypage.style.backgroundColor === ""){

                    setDom() // function that gets all users dom and sets dom to user page

                    console.log('Color not in CSS')
                }
                else{
                    updateDomDB(domName, color) // function updates the dom to database
                }
            break

        }
    })
}

//// FORM EVENT LISTENER //////

// signup form for user to log in
signUpForm.addEventListener("submit", async(event)=>{
    
    event.preventDefault()

    try{
        // gets value inside of form text
        const user = document.querySelector('#signup-name').value
        const password = document.querySelector('#signup-password').value

        // empty the value inside of text
        document.querySelector('#signup-name').value = ""
        document.querySelector('#signup-password').value = ""
        
        // api creates a user in the database
        const signUpResponse = await axios.post('http://localhost:3001/user',
        {
            userName: user,
            password: password
        })
        
        // gets data from api and set to variable
        const userName = signUpResponse.data.user.userName
        const userId = signUpResponse.data.user.id

        // set item to local storage
        localStorage.setItem('userName', userName)
        localStorage.setItem('userId', userId)

        // api creates a dom table for the user
        const createDomResponse = await axios.get('http://localhost:3001/dom/user/create',{
            headers: {
            authorization: localStorage.getItem('userId')
            }
        })
        
        // reloads the page
        await location.reload()

        heading.innerText = `Welcome ${userName}!`
        
        seePosterName(userName) // displays the name of user's post in post body

        setDom() // function that gets all users dom and sets dom to user page

    }
    catch(error){
        console.log(error)
    }
})


// login form for user to log in
loginForm.addEventListener("submit", async(event)=>{
    
    event.preventDefault()
    
    try{

        // gets value inside of form text
        const user = document.querySelector('#login-name').value
        const password = document.querySelector('#login-password').value

        // empty the value inside of text
        document.querySelector('#login-name').value = ""
        document.querySelector('#login-password').value = ""
        
        // api logs in if username and password match
        const response = await axios.post('http://localhost:3001/user/login',{
            userName: user,
            password: password
        })
        
        // gets data from api and set to variable
        const userName = response.data.user.userName
        const userId = response.data.user.id
        
        // set item to local storage
        localStorage.setItem('userName', userName)
        localStorage.setItem('userId', userId)

        // reloads the page
        await location.reload()

        heading.innerText = `${userName}`

        seePosterName(userName) // displays the name of user's post in post body

        setDom() // function that gets all users dom and sets dom to user page
        
    }
    catch(error){
        console.log(error)
    }
})


// Form for user to create a post
userForm.addEventListener('submit', async (event)=>{

    event.preventDefault()

    try{

        // gets value inside of form text
        const post = document.querySelector('#user-post').value

        let id = localStorage.getItem('userId')
        
        // api creates a post associated with user
        const response = await axios.post(`http://localhost:3001/user/posts/${id}`, {
            post: post
        })
        
        // gets data from api and set to variable
        const newPost = response.data.userPost.post
        const postId = response.data.userPost.id
        const userId = response.data.userPost.userId

        // gets the name of who's post is being viewed in post body
        posterName = userPostName.innerText.split("'")[0]

        // if the poster's user name the same as the name in local storage
        if( posterName === localStorage.getItem('userName')){
            
            await setPostElement(newPost, userId, postId) // function that creates elements that show user posts
        
        }
        else{

            userLink.style.display = 'none'

            seeUserPosts() // function that shows every post that user created

            setPostElement(newPost, userId, postId) // function that creates elements that show user posts

            seePosterName(localStorage.getItem('userName')) // displays the name of user's post in post body
        }
        
        // empty the value inside of text
        document.querySelector('#user-post').value = ""
    }

    catch(error){
        console.log(error)
    }
})


/// Form to search for other users in search page
searchForm.addEventListener('submit', async(event)=>{

    event.preventDefault()

    try{
        const search = document.getElementById('search-user').value

        await removePostElement() // removes all the post displaying on page

        // api searchs user by userName and gets all post
        const response = await axios.post('http://localhost:3001/user/search',{
            userName: search
        })
        
        // gets data from api and set to variable
        const posts = response.data

        seePosterName(search) // displays the name of user's post in post body

        // if name is the user's name, dont display user link
        if(search === localStorage.getItem('userName')){
            userLink.style.display = 'none'
        }
        else{
            userLink.style.display = 'flex'
        }

        for(let post of posts){
            const postContent = post.post
            const postId = post.id
            const userId = post.userId
    
            await setPostElement(postContent, userId, postId) // function that creates elements that show user posts
    
        }

        // empty the value inside of text
        document.getElementById('search-user').value = ""

    }

    catch(error){
        console.log(error.request)
    }

})


// event listener that adds video to page
videoForm.addEventListener('submit', async (event)=>{

    event.preventDefault()

    try{
        const video = document.querySelector('#user-video').value

        document.querySelector('#user-video').value = ""

        let id = localStorage.getItem('userId')
        
        // api adds video link to the database
        const response = await axios.post(`http://localhost:3001/user/videos/${id}`, {
            videoLink:video  
        })

        // gets data from api and set to variable
        const videoId = response.data.id

        // creates elements
        const iFrame =  document.createElement('iframe')
        const videoFrame = document.createElement('div')
        const delButton = document.createElement('button')

        // replaces part of url query with "embed/"
        let url = video.replace("watch?v=", "embed/");
        
        delButton.innerText = 'delete'

        // sets attributes to the iframe
        iFrame.setAttribute('src',url) 
        iFrame.setAttribute('class', 'youtube')
        videoFrame.setAttribute('class', 'videoContainer')
        delButton.setAttribute('class','videoDeleteButtons')
        iFrame.setAttribute('height','280vmin') 
        iFrame.setAttribute('width','380vmin') 
        // iFrame.setAttribute('frameborder','0') 
        // iFrame.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture') 
        // iFrame.setAttribute('allowfullscreen') 
       
        
        // appending elements
        videoFrame.append(iFrame)
        videoFrame.append(delButton)
        videoList.append(videoFrame)

        
        // deletes the video link inside the database
        delButton.addEventListener('click', async ()=>{
            await axios.delete(`http://localhost:3001/user/videos/${videoId}`,{
                headers: {
                    authorization: localStorage.getItem('userId')
                }
            })
            // removes video from page
            videoFrame.remove()
        })
    }

    catch(error){
        console.log(error)
    }
})

// Event listener to change based on the drop down list in settings
fontList.addEventListener('change', async ()=>{

    // gets the value of drop down selected
    fontStyle = fontList.value

    userPage.style.fontFamily = fontStyle
    

    const changeFontResponse = await axios.put('http://localhost:3001/dom/user/update',{font: fontStyle},
    {
        headers: {
            authorization: localStorage.getItem('userId')
        }
    })
    
})



//// IF USER COMES BACK TO PAGE OR RELAOAD ////

//prevent to logout the user page after the user refreshes the page if the user is still logged in 
if (localStorage.getItem('userId')){


    // runs the function after half a second
    // setTime out for axios to load first
    setTimeout(setDom, 500)
    seePosterName(localStorage.getItem('userName'))
    setTimeout(seeUserPosts, 500);
    setTimeout(seeUserVideos, 500);
    
    heading.innerText = `${localStorage.getItem('userName')}`
    
    homePage.style.display = 'none';
    signUpLink.style.display='none';
    loginLink.style.display='none';
    userLink.style.display = "none"
    settingsMenu.style.display = "none"
    
    searchForm.style.display = "flex";
    userPage.style.display = 'flex';
    logoutLink.style.display = 'flex';


    
}else{
    
    settingsLink.style.display = "none"
    userLink.style.display = "none"
    userPage.style.display = "none"
    logoutLink.style.display = 'none'
    searchForm.style.display = "none"


    homePage.style.display = 'flex'
    
}