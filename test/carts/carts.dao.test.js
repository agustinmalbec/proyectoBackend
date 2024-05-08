import { expect } from 'chai';
import mongoose from "mongoose";
import environment from '../../src/config/environment.config.js';
import CartService from '../../src/services/dao/mongoDb/carts.service.js'
import { cartService } from '../../src/services/service.js';

mongoose.connect('mongodb+srv://agustinmalbec123:123@ecommerce-test.qd866ug.mongodb.net/?retryWrites=true&w=majority');



describe('Testing Carts Dao', () => {

    before(function () {

        this.cartsDao = cartService;
    })

    beforeEach(function () {
        // time de espera ya que estamos usando una DB
        mongoose.connection.collections.carts.drop();

    })

    it('El dao debe devolver los carritos en forma de arreglo', async function () {
        this.timeout(100000)
        // Given
        const isArray = []
        // Then
        const result = await this.cartsDao.getCarts()
        console.log(result);
        // Assert that
        expect(result).to.be.deep.equal(isArray)
        expect(Array.isArray(result)).to.be.ok
        expect(Array.isArray(result)).to.be.equal(true);
        expect(result.length).to.be.deep.equal(isArray.length);
    })


    it('El dao debe agregar el carrito correctamente a la DB', async function () {
        this.timeout(10000)
        // Given
        let cart = {
            products: []
        }

        // Then
        const result = await this.cartsDao.addCart(cart);
        // console.log(result);

        // Assert that
        expect(result._id).to.be.ok
    })

    afterEach(function () {
        mongoose.connection.collections.carts.drop();
    })

})
