const mealsEl=document.getElementById('meals');
const fav_meals=document.getElementById('fav-meals');
const searchterm=document.getElementById('search-term');
const btnsearch=document.getElementById('btn-search');

//meal info
const mealInfoEl=document.getElementById('meal-info');

const mealpopup=document.getElementById('meal-popup');
const popupClosebtn=document.getElementById('close-popup');


getRandomMeal();
fetchFavMeals();



function ShowMealInfo(mealData){

const ingrediants=[];
    for(let i=1;i<=20;i++){
        if(mealData[`strIngredient${i}`])
        {

            ingrediants.push(`
            ${mealData[`strIngredient`+i]}

            -
            ${mealData[`strMeasure`+i]}

            `);



        }

       
        else{
            break
        }
        
    }
    console.log(ingrediants);

    
    mealInfoEl.innerHTML=``;


    //update Meal Info
    const mealInfo=document.createElement('div');
    

    

    mealInfo.innerHTML=` <h1>
${mealData.strMeal}

                </h1>
                <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" srcset="">



                    <p>
                   ${mealData.strInstructions}

                    </p>

                    <h3>ingrediants</h3>

                    <ul class="ingrediants">
                    ${ingrediants.map((ing)=>`
                    <li>${ing}</li>
                    `
                        
                        
                        ).join('')}
                    </ul>
                    `


    //show the popup
    mealpopup.classList.remove('hidden')
    mealInfoEl.appendChild(mealInfo);

}

async function getRandomMeal(){
    const resp= await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const RespData =await resp.json();
    const RandomMeal=RespData.meals[0];

    
    

    addMeal(RandomMeal,true);
    
    

}
async function getMealByID(id){
    const resp=  await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);

    const respData=await resp.json();

    const  meal=respData.meals[0];
    
    

    return meal;
    



}

async function getMealBySearch(term){
    const resp=  await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term);

    const respdata= await resp.json();
    const meals=respdata.meals;
    
    
    return meals;

}


btnsearch.addEventListener('click',async()=>{
    //clean the conatainer
    mealsEl.innerHTML='';
    const search=searchterm.value;

    const meals=await getMealBySearch(search);

    if(meals){
        
    meals.forEach(meal => {
        addMeal(meal);
    });

    }

});




function addMeal(mealData,random=false){
    const meal=document.createElement('div');
    
    meal.classList.add('meal');
    meal.innerHTML=`
    
               
                <div class="meal-header">
                ${random?`<span class="random">
                random recipe
            </span>` : ``}
                    
                    <img src="${mealData.strMealThumb}" alt=${mealData.strMeal}/ >
                </div>
                <div class="meal-body">
                    <h1>${mealData.strMeal}</h1>
                    <button class="fav-btn ">
                        <i class="fas fa-heart"></i>
                      </button>
                </div>
            `

            const btn=meal.querySelector('.meal-body .fav-btn');
            btn.addEventListener('click',()=>{
                if(btn.classList.contains('active')){
                    removeMealFromLS(mealData.idMeal);
                    btn.classList.remove('active')
                }
                else{
                    addMealToLS(mealData.idMeal);
                    btn.classList.add('active')
                }
                
                fetchFavMeals();

                
            })

            meal.addEventListener('click',()=>{

                const btn2=document.querySelector('.clear');

                if(!btn2.addEventListener('click',()=>{})){
                    ShowMealInfo(mealData);
                    
                }
                
                
            })

            mealsEl.appendChild(meal);


}

function removeMealFromLS(MealID){

    const mealIds=getMealsFrmLS();
    localStorage.setItem('mealIds',JSON.stringify(mealIds.filter(id=>id!==MealID)));

    



}

function addMealToLS(mealId){
    const mealIds=getMealsFrmLS();
    localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId]));



}
    
function getMealsFrmLS(){
    const mealIds=JSON.parse(localStorage.getItem('mealIds'))
    return mealIds===null?[]:mealIds;
    
    
}
async function fetchFavMeals(){

    //clear the container
    fav_meals.innerHTML='';
    
    const mealIds=getMealsFrmLS();

    

    

    
    

    for(let i=0;i<mealIds.length;i++){
        

        const mealid=mealIds[i];

        const meal=  await getMealByID(mealid);
        
        AddFavMeal(meal);
    }
    
    



}
function AddFavMeal(mealData){
    const favmeal=document.createElement('li');

    favmeal.innerHTML=`
    <li><img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
    <button class="clear" >
                        <i class="fas fa-window-close "></i>
                      </button></li>
    `;


    

    const btn2=favmeal.querySelector('.clear');

    btn2.addEventListener('click',()=>{
        removeMealFromLS(mealData.idMeal);
        fetchFavMeals();
        
    })

    fav_meals.appendChild(favmeal);

}

function UpdateMealInfo(mealData){

    const meal =document.createElement('div');

    meal.classList.add('meal-info')



}

popupClosebtn.addEventListener('click',(

)=>{
    
    mealpopup.classList.add('hidden');

    

})