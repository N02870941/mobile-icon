const app = require('../app/app')
const request = require('supertest');

// https://codewithhugo.com/testing-an-express-app-with-supertest-moxios-and-jest/

describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/').then((response) => {
            expect(response.statusCode).toBe(200)
            done()
        })
    })
})

// Upload a single file
// Upload many files concurrently
// Post with no file
// Post with invalid file format
// Post with photo that is too large
