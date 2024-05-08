export default class UserDTO {
    constructor({ first_name, last_name, email, age, password, cart, documents, last_connection }) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.age = age;
        this.password = password;
        this.cart = cart;
        this.documents = documents;
        this.last_connection = last_connection;
    }
}