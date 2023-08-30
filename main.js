
////bu load html oyna izlaydi
window.addEventListener("load", () =>{
  ///use strict cma script6 qoydasi buyicha nazorat qiladi
    "use strict"

    let form = document.querySelector("form")
    ///buyerda kinolar kesip ilinadi miqdor
    let kinolar = movies.slice(0, 50)
    let search_movie = document.querySelector(".search_movie")
    let template = document.querySelector("template").content
    let movies_items = document.querySelector(".movies_items")
    let select__category = document.querySelector(".select__category")
    let select__sort = document.querySelector(".select__sort")
    const pagination__btns = document.querySelectorAll(".pagination__movie button")
    const next = document.getElementById("next")
    const page__text = document.querySelector(".page")
    const previous = document.getElementById("previous")
    let bookmark = window.localStorage.getItem("bookmark") ? JSON.parse(window.localStorage.getItem("bookmark")) : []
    const bookmark__items = document.querySelector(".bookmark__items")
    let bookmark_template = document.querySelector(".bookmark__template").content

    const handleRenderMovies = (arr) => {
       if(arr?.length){
        movies_items.innerHTML = null 
        for(let i = 0; i<arr.length; i++){

            let clone = template.cloneNode(true)
            let img = clone.querySelector(".movie_img")
            img.src = arr[i].bigPoster
          let name = clone.querySelector(".movie_name")
          name.textContent = arr[i].title.split("").length > 2 ?  `${arr[i]
            .title.split(" ").slice(0,2).join(" ")} ...` :  arr[i].title
            let movie_year = clone.querySelector(".movie_year")
            movie_year.textContent = arr[i].year
            let summary = clone.querySelector(".movie_summary")
            summary.textContent = arr[i].summary
            let trailer = clone.querySelector(".trailer")
            trailer.href = arr[i].trailer
            let Bookmark__btn = clone.querySelector(".Bookmark__btn")
            Bookmark__btn.dataset.id = arr[i].imdbId
          movies_items.appendChild(clone)
        }
       }
    }
    let handleFilterCategory = (arr) => {
      let result = []
       for(let i= 0; i< arr.length; i++){
        let category = arr[i].categories      
        for (let si = 0; si < category.length; si++){
          if(!result.includes(category[si])){
            result.push(category[si])
          }

        }
       }
       
       return result
    }
     
     const handleCreateOption = () => {
      let categories = handleFilterCategory(kinolar)
      for(let i = 0; i < categories.length; i++){
        let option  = document.createElement("option")
        option.value = categories [i]
        option.textContent = categories[i]
        select__category.appendChild(option)
      }
     }
     handleCreateOption()
     const sort__movie = {
      ///bu usul kam kod orqali chiqarish
      AZ(a,b){
              if(a.title < b.title){
                return -1
              }else{
                return 1
              }
      },
      ZA(a,b){
        if(a.title < b.title){
          return 1
        }else{
          return -1
        }
      },
      RATING(a,b){
        if(a.imdbRating < b.imdbRating){
          return 1
        }else{
          return -1
        }
      },
      YEAR(a,b){
        if(a.year < b.year){
          return 1
        }else{
          return -1
        }
      }
     }
    const handleSub = (event) =>{
        event.preventDefault()
        let rejex = new RegExp(search_movie.value, "gi")
        let filter = []
        console.log("ishladi")
        console.log(select__category.value)
       if(select__category.value === "all"){
          filter = kinolar
        }else if(select__category.value !== "all"){
            filter = kinolar.filter(item => item.categories.includes( select__category.value))
        }
       if(search_movie.value.length){
          filter = filter.filter(item =>   item.title.match(rejex))
          console.log("ishladi");
        }
      if(select__sort.value.length){
        filter = filter.sort(sort__movie[select__sort.value])

        ///bu usul kup kod yozish orqali

        //  if(select__sort.value === "AZ"){
        //   filter = filter.sort((a,b) => {
        //       if(a.title < b.title){
        //         return-1
        //       }else{
        //         return 1
        //       }
        //     })
        //  }else if(select__sort.value === "ZA"){
        //    filter = filter.sort((a,b) => {
        //       if(a.title < b.title){
        //         return 1
        //       }else{
        //         return -1
        //       }
        //   })

        //  } else if(select__sort.value === "RATING"){
        // filter = filter.sort((a,b) => {
        //     if(a.imdbRating < b.imdbRating){
        //       return 1
        //     }else{
        //       return -1
        //     }
        //   })

        //   }else if(select__sort.value === "year"){
        //   filter = filter.sort((a,b) => {
        //      if(a.year < b.year){
        //         return 1
        //      }else{
        //         return -1
        //     }
        //  })

        // }

      }

        handleRenderMovies(filter)

     }
      form.addEventListener("submit", handleSub)
      
      let limit = 10
      let maxpage  = kinolar.length / limit
      let page = 1
      
      let handlePagination = (event) => {

          switch (event.target.id){
    
            case "next": {
              if(page < maxpage){
                page ++
               handleRenderMovies(kinolar.slice((page -1)* limit , page * limit));
               previous.disabled = false

              }else{

                next.disabled = true
                previous.disabled = false

              }
              
            }break;
            case "previous": {
              if(page > 1){
                page --
                next.disabled = false
                handleRenderMovies(kinolar.slice((page -1)* limit , page * limit))
              }else{

                previous.disabled = true
                next.disabled = false

              }
            }
          }
          //bu joyi pastdagi raqam almashadi yani strong
          page__text.textContent = page
      }
   
      pagination__btns.forEach(item => {
        item.addEventListener("click", handlePagination)
      })

   let handleRenderBookmarkMovies = (arr) => {

    if(arr?.length){
      bookmark__items.innerHTML = null
      for(let i = 0; i < arr.length; i++){
        let clone = bookmark_template.cloneNode(true)
        let name = clone.querySelector(".name")
        name.textContent = arr[i].title
        let trailer = clone.querySelector(".trailer")
        trailer.href = arr[i].trailer
        let Delete__bookmark = clone.querySelector(".Delete__bookmark")
        Delete__bookmark.dataset.id = arr[i].imdbId
        bookmark__items.appendChild(clone)

      }
    }else{
      let h2 = document.createElement("h2")
      h2.textContent = "Hali kinolar saqlap olinmagan"
      h2.classList.add("text-danger")
      bookmark__items.appendChild(h2)
    }

   }
      const handleClick = (event) => { 
        let id = event.target.dataset.id
        if(event.target.matches(".Bookmark__btn")){
          let movie = kinolar.find(item => item.imdbId === id)
          if(!bookmark.length){
              if(!bookmark.some(item => item.imdbId === id)){
                bookmark.push(movie)
                window.localStorage.setItem("bookmark", JSON.stringify(bookmark))
                handleRenderBookmarkMovies(bookmark) 
              }
             }else{
              bookmark.push(movie)
              handleRenderBookmarkMovies(bookmark)
              window.localStorage.setItem("bookmark", JSON.stringify(bookmark))
          }
        }else if(event.target.closest(".Delete__bookmark")){
           let filter = bookmark.filter(item => item.imdbId !== id)
           handleRenderMovies(filter)
           window.localStorage.setItem("bookmark", JSON.stringify(filter))
           window.location.reload()
        }
      }
      window.addEventListener("click", handleClick)
      handleRenderBookmarkMovies(bookmark)
      handleRenderMovies(kinolar.slice(0,10))
})