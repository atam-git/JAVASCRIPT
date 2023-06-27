// USER CLASS
class User {
    constructor(firstname, lastname, username, email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
    }
}

// UI CLASS
class UI {
    static displayUsers(){
        const users = Store.getUsers();

        users.forEach((user) => UI.addUserToList(user));
    }

    static addUserToList(user){
        // Call the tbody
        const profiles = document.querySelector('#profiles');

        // Create new row for user
        const row = document.createElement('tr');

        // Add HTML to row
        row.innerHTML = `
        <td class='git'>${user.username}</td>
        <td>${user.firstname}</td> 
        <td>${user.lastname}</td>
        <td>${user.email}</td>
        <td><a href='#' class="btn btn-danger btn-sm 
        delete">X</a></td>
        `;

        // Append to row to profiles
        profiles.appendChild(row);
    }


    // Delete User
    static deleteUser(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, classname){
        const div = document.createElement('div');
        div.className = `alert alert-${classname}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.alertcontain');
        const form = document.querySelector('#my-form');
        container.insertBefore(div, form);

        // Vanish in a sec
        setTimeout(() => document.querySelector('.alert').remove(),
        1000);
    }

    // Clear input fields
    static clearFields(){
    document.querySelector('#fname').value = '';
    document.querySelector('#lname').value = '';
    document.querySelector('#uname').value = '';
    document.querySelector('#email').value = '';
    }

    // Filter 
    static searchUser(){

    }


}

// Store CLASS
class Store{
    static getUsers(){
        let users;
        if(localStorage.getItem('users') === null){
            users = [];
        }else{
            users = JSON.parse(localStorage.getItem('users'));
        }
    return users;
    }    
    
    static addUser(user){
        const users = Store.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users)); 
    }    
    
    static removeUser(email){
        const users = Store.getUsers();

        users.forEach((user, index) => {
            if(user.email === email){
                users.splice(index, 1);
            }
        });

        localStorage.setItem('users', JSON.stringify(users));
    }
}

// EVENT: Display User
document.addEventListener('DOMContentLoaded', UI.displayUsers);

// EVENT: Add a Book
const myForm = document.querySelector('#my-form');
myForm.addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();
    // get form values
    const firstname = document.querySelector('#fname').value;
    const lastname = document.querySelector('#lname').value;
    const username = document.querySelector('#uname').value;
    const email = document.querySelector('#email').value;

    // Validate
    if(username === '' || firstname === '' || lastname === '' || email === ''){
    UI.showAlert('Please fill in all fields', 'danger');
    }
    else{
    // Instatiate User
    const user = new User(firstname, lastname, username, email);

    // Add User to UI
    UI.addUserToList(user);

    // Add User to Store
    Store.addUser(user);

    // Show success message
    UI.showAlert('User Added', 'success');

    // Clear
    UI.clearFields();
    }   
});

// EVENT: Remove a Book
const profiles = document.querySelector('#profiles');
profiles.addEventListener('click', (e) => {
    UI.deleteUser(e.target);

    // Remove book from store
    Store.removeUser(e.target.parentElement.previousElementSibling.textContent);

    // Show Delete message
    UI.showAlert('User Removed', 'danger');
});

// Filter: 
const table = document.querySelector('.tableclass')
const filter = document.getElementById('filter');
filter.addEventListener('input', (e) => {
    //Hide
    myForm.style.visibility = 'hidden';
    table.style.visibility = 'visible';
    myForm.style.position = 'absolute';
    // show reset
    reset.style.display= 'block';
    // convert text to lowercase
    var text = e.target.value.toLowerCase();
    // Get lis
    var items = profiles.getElementsByClassName('git');
    // Convert to an array
    Array.from(items).forEach(function(item){
        var i = item.firstChild.textContent;
        if(i.toLowerCase().indexOf(text) != -1){
            item.parentElement.style.display = 'table-row';
        } else {
            item.parentElement.style.display= 'none'
        }
    });
});

//Filter event
const reset = document.getElementById('reset')
reset.addEventListener('click', unFilter);
function unFilter(e){
    myForm.style.visibility = 'visible'; 
    myForm.style.position = 'relative'; 
    table.style.visibility = 'hidden'; 
    reset.style.display= 'none';
}