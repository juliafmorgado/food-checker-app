document.querySelector('button').addEventListener('click', getFetch)

function getFetch() {
    let inputVal = document.getElementById('barcode').value
    if (inputVal.length !== 12) {
        alert(`Please ensure the barcode is 12 characters, should be an UPC barcode`)
        return; //exit the entire function
    }

    const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => { //use JSON data
            console.log(data)
            if (data.status === 1) {  //If product is valid. Status is a specific property in the object.
                const item = new ProductInfo(data.product)  //call Constructor if product is found and it will build a new product/object with the assigned properties(name, ingredient, label and image)
                // item.testCall()//calling the method to test it
                item.showInfo() //Call the showInfo on the product
                item.listIngredients() //Call method
            } else if (data.status === 0) { //If the product is not valid don't call anything
                alert(`Product ${inputVal} not found. Please try another one.`)
            }
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

class ProductInfo {
    constructor(productData) {  //I am passing in data.product
        this.name = productData.product_name
        this.ingredients = productData.ingredients
        this.label = productData.labels
        this.image = productData.image_url
    }

    // testCall() {
    //     console.log(this.ingredients);
    // }       -----------> This method is just used to check it the constructor function works and if we can see the ingredients in the console

    showInfo() {
        document.getElementById('product-img').src = this.image
        document.getElementById('product-name').innerText = this.name
    }

    listIngredients() {
        let tableRef = document.getElementById('ingredient-table') //specify what we're targeting. In this case it's our table with id ingredient-table

        for (let i = 1; i < tableRef.rows.length;) { //Quickly go through the table and if there are existing rows we delete them. Clear rows that are below the header (so skip the 1st row). Bc otherwise it appends from the previous search.
            tableRef.deleteRow(i) //whatever row we're on, delete the entire row. And loop through whole table. But you don't have to add the i++ bc each time you delete one row it moves up.
        }
        if (!(this.ingredients == null)) { //check if ingredients are not null and then enter the for loop

            for (let key in this.ingredients) { //For each ingredient in our list of ingredients
                let newRow = tableRef.insertRow(-1) //inserts new row in our table at the end. To append row at the end of our table use -1, like for an array if we wanna add something at the end of it use -1.
                let newICell = newRow.insertCell(0) //insert a cell on the left (point 0 on the row)
                let newVCell = newRow.insertCell(1) //insert another cell on the right (point 1 on the row)
                let newIText = document.createTextNode(this.ingredients[key].text)   //Pass in some text in the space we specified. Create new text value for each ingredient
                let vegStatus = this.ingredients[key].vegetarian ? this.ingredients[key].vegetarian : 'unknown' //if it's any kind of falsy value return unknown  else return the value
                let newVText = document.createTextNode(vegStatus) //Create new status for the vegetarian
                newICell.appendChild(newIText) //put text value inside cell we created
                newVCell.appendChild(newVText) //put the text into the cell
                if (vegStatus === 'no') {
                    newVCell.classList.add('non-veg-item') //will add a class
                    //turn item red
                } else if (vegStatus === 'unknown' || vegStatus === 'maybe') {
                    newVCell.classList.add('unknown-maybe-item')
                    //turn yellow
                }
            }
        }
    }
}
