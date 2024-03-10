
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Book API', () => {
    let bookId;

    it('should POST a book', (done) => {
        const book = {
            id: "1",
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",};

        chai.request(server)
            .post('/books')
            .send(book)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                bookId = res.body.id;
                done();                
            });
        });
    it('should GET all books', (done) => {
        chai.request(server)
            .get('/books')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it('should GET a single book', (done) => {
        const bookId = 1;
        chai.request(server)
            .get(`/books/${bookId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                done();
            });
    });

    it('should PUT an existing book', (done) => {
        const bookId = 1;
        const updatedBook = { id: bookId, title: "The Hobbit", author: "Hristo Botev" };
        chai.request(server)
            .put(`/books/${bookId}`)
            .send(updatedBook)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.title).to.equal('The Hobbit');
                expect(res.body.author).to.equal('Hristo Botev');
                done();
            });
    });

    it('should return 404 when trying to GET, PUT or DELETE a non existing book', (done) => {
        chai.request(server)
            .get('/books/999')
            .end((err, res) => {
                expect(res).to.have.status(404);
            });

        chai.request(server)
            .put('/books/999')
            .send({ id: 999, title: "The Hobbit", author: "Hristo Botev" })
            .end((err, res) => {
                expect(res).to.have.status(404);
            });

        chai.request(server)
            .delete('/books/999')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
}); 
